import { formatSandboxFloat } from './cpp-sandbox-format.mjs';

const minInt = -2147483648;
const maxInt = 2147483647;
const minShort = -32768;
const maxShort = 32767;
const minLongLong = -(1n << 63n);
const maxLongLong = (1n << 63n) - 1n;
const stream = { input: 'cin', output: 'cout' };
const floating = new Set(['float', 'double']);
const scalarTypes = new Set(['short', 'int', 'long', 'long long', 'bool', 'char', 'string', ...floating]);
const bitwiseOperators = new Set(['&', '|', '^', '<<', '>>']);
const charEscapes = new Map([[0, '\\0'], [7, '\\a'], [8, '\\b'], [9, '\\t'], [10, '\\n'], [11, '\\v'],
  [12, '\\f'], [13, '\\r'], [39, "\\'"], [92, '\\\\']]);

export function parseSandboxInput(type, token) {
  if (typeof token !== 'string') return;
  if (type === 'string') return token.length && !/\s/.test(token) ? token : undefined;
  if (type === 'char') return [...token].length === 1 && token.codePointAt(0) <= 127 ? token.codePointAt(0) : undefined;
  if (type === 'bool') return /^[+-]?0*[01]$/.test(token) && [0, 1].includes(Number(token)) ? Number(token) === 1 : undefined;
  if (type === 'int') {
    const number = Number(token);
    return /^[-+]?\d+$/.test(token) && number >= minInt && number <= maxInt ? number : undefined;
  }
  if (type === 'short' || type === 'long' || type === 'long long') {
    if (!/^[-+]?\d+$/.test(token)) return;
    const value = BigInt(token);
    const minimum = type === 'short' ? BigInt(minShort) : type === 'long' ? BigInt(minInt) : minLongLong;
    const maximum = type === 'short' ? BigInt(maxShort) : type === 'long' ? BigInt(maxInt) : maxLongLong;
    if (value < minimum || value > maximum) return;
    return type === 'long long' ? value : Number(value);
  }
  if (floating.has(type) && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(token)) {
    const number = type === 'float' ? Math.fround(Number(token)) : Number(token);
    return Number.isFinite(number) ? number : undefined;
  }
}

export function readPreparedSandboxInput(source, mode, position = { row: 0, column: 0 }) {
  const lines = source.split('\n');
  const trailingNewline = source.endsWith('\n');
  if (trailingNewline) lines.pop();
  let { row, column } = position;
  if (!source.length) return;
  if (mode === 'line') {
    if (row >= lines.length) return;
    const value = lines[row].slice(column);
    return { value, position: { row: row + 1, column: 0 } };
  }
  if (mode === 'raw-char') {
    if (row >= lines.length) return;
    if (column < lines[row].length) {
      const character = [...lines[row].slice(column)][0];
      return { value: character, position: { row, column: column + character.length } };
    }
    if (row < lines.length - 1 || (trailingNewline && row === lines.length - 1)) {
      return { value: '\n', position: { row: row + 1, column: 0 } };
    }
    return;
  }
  while (row < lines.length) {
    while (column < lines[row].length && /\s/.test(lines[row][column])) column++;
    if (column < lines[row].length) {
      const rest = lines[row].slice(column);
      const token = mode === 'formatted-char' ? [...rest][0] : rest.match(/^\S+/)?.[0];
      if (token) return { value: token, position: { row, column: column + token.length } };
    }
    row++;
    column = 0;
  }
}

export function displaySandboxValue(value, type) {
  if (value === null) return '未初始化';
  if (type === 'string') return String(value);
  if (typeof value === 'bigint') return value.toString();
  if (type !== 'char') return Object.is(value, -0) ? '-0' : String(value);
  return "'" + (charEscapes.get(value) ?? (value >= 32 && value < 127 ? String.fromCharCode(value) : '\\x' + value.toString(16).padStart(2, '0'))) + "'";
}

export function createSandbox(ast, source) {
  const declarations = ast.inner ?? [];
  const main = declarations.find((node) => node.kind === 'FunctionDecl' && node.name === 'main');
  const body = main?.inner?.find((node) => node.kind === 'CompoundStmt');
  if (!body || declarations.some((node) => node !== main && node.kind !== 'UsingDirectiveDecl')) {
    throw new Error('第一版會追蹤 main 內的程式。請先試只有 main 的範例。');
  }

  const offsets = new Map();
  let byte = 0;
  let index = 0;
  const encoder = new TextEncoder();
  for (const char of source) {
    offsets.set(byte, index);
    byte += char.length === 1 && char.charCodeAt(0) < 128 ? 1 : encoder.encode(char).length;
    index += char.length;
  }
  offsets.set(byte, index);

  const boxes = new Map();
  const scopes = [[]];
  let output = '';
  let steps = 0;
  const format = { mode: 'defaultfloat', precision: 6, width: 0, fill: ' ', left: false };

  function normalizedType(type = '') {
    const plain = type.replace(/^const /, '').replace(/^std::/, '');
    if (/^char\s*\*/.test(plain)) return 'cstring';
    if (plain === 'short int') return 'short';
    if (plain === 'long int') return 'long';
    if (plain === 'long long int') return 'long long';
    return plain === 'string' || plain.startsWith('basic_string<char') ? 'string' : plain;
  }

  function location(node) {
    const start = offsets.get(node?.range?.begin?.offset);
    const end = node?.range?.end;
    const finish = offsets.get(end?.offset + end?.tokLen);
    return start === undefined || finish === undefined ? null : { start, end: finish };
  }

  function unsupported(node) {
    const range = location(node);
    const line = range ? source.slice(0, range.start).split('\n').length : null;
    throw new Error((line ? '第 ' + line + ' 行。' : '') + '這個寫法還無法在第一版沙盒逐步展示。');
  }

  function frame(node, action, message, target = null) {
    if (++steps > 600) throw new Error('已達 600 步的展示上限。可以縮短迴圈次數後再試。');
    return { range: location(node), action, message, target, output, boxes: [...boxes.values()].map((box) => ({ ...box })) };
  }

  function cast(value, type, node) {
    type = normalizedType(type);
    if (type === 'string') return String(value);
    if (type === 'cstring') return String(value).split('\0')[0];
    const number = Number(value);
    if (type === 'bool') return value !== 0 && value !== 0n;
    if (type === 'float') return Math.fround(number);
    if (type === 'double') return number;
    if (type === 'short' || type === 'int' || type === 'long' || type === 'long long' || type === 'char') {
      const integer = typeof value === 'bigint' ? value : Number.isFinite(number) ? BigInt(Math.trunc(number)) : null;
      const char = type === 'char';
      const minimum = type === 'long long' ? minLongLong : BigInt(type === 'short' ? minShort : char ? 0 : minInt);
      const maximum = type === 'long long' ? maxLongLong : BigInt(type === 'short' ? maxShort : char ? 127 : maxInt);
      if (integer === null || integer < minimum || integer > maximum) {
        if (char) throw new Error('這版只展示 ASCII 範圍內的 char。');
        throw new Error('運算結果超出了 ' + type + ' 的範圍。');
      }
      return type === 'long long' ? integer : Number(integer);
    }
    unsupported(node);
  }

  function boxFor(node) {
    const box = boxes.get(node?.referencedDecl?.id);
    if (!box) unsupported(node);
    return box;
  }

  function referencedName(node) {
    if (!node) return '';
    if (node.referencedDecl?.name) return node.referencedDecl.name;
    if (node.name) return node.name;
    for (const child of node.inner ?? []) {
      const name = referencedName(child);
      if (name) return name;
    }
    return '';
  }

  function scalar(node, explanation) {
    const type = normalizedType(node.type?.qualType);
    const [left, right, third] = node.inner ?? [];
    switch (node.kind) {
      case 'IntegerLiteral': return cast(type === 'long long' ? BigInt(node.value) : Number(node.value), type, node);
      case 'FloatingLiteral':
      case 'CharacterLiteral': return cast(Number(node.value), type, node);
      case 'CXXBoolLiteralExpr': return node.value;
      case 'StringLiteral':
        return decodeCppLiteral(stringLiteralSource(node));
      case 'CXXConstructExpr':
        if (type === 'string') {
          const literal = findStringLiteral(node);
          return literal ? scalar(literal) : '';
        }
        unsupported(node);
      case 'ParenExpr': return scalar(left, explanation);
      case 'ImplicitCastExpr': return cast(scalar(left, explanation), type, node);
      case 'CStyleCastExpr':
      case 'CXXStaticCastExpr':
      case 'CXXFunctionalCastExpr':
        return cast(scalar(left, explanation), type, node);
      case 'ConditionalOperator': {
        const condition = scalar(left, explanation);
        const selected = condition ? right : third;
        const result = scalar(selected, explanation);
        if (explanation) explanation.expression = expressionText(node);
        return cast(result, type, node);
      }
      case 'DeclRefExpr': {
        const box = boxFor(node);
        if (box.value === null) throw new Error('「' + box.name + '」還沒有值。請先輸入或指定一個值。');
        return box.value;
      }
      case 'UnaryOperator': {
        if (['++', '--'].includes(node.opcode)) {
          const box = boxFor(left);
          const before = box.value;
          if (before === null) throw new Error('「' + box.name + '」還沒有值。請先輸入或指定一個值。');
          box.value = cast(operation(node.opcode === '++' ? '+' : '-', before, 1, node, type), box.type, node);
          return node.isPostfix ? before : box.value;
        }
        if (!['!', '-', '+', '~'].includes(node.opcode)) unsupported(node);
        const value = scalar(left, explanation);
        if (node.opcode === '!') {
          if (explanation) explanation.expression = '!' + value;
          return !value;
        }
        if (node.opcode === '~') {
          const width = integerWidth(type);
          const result = cast(fromTwosComplement(~toBigInt(value), width), type, node);
          if (explanation) {
            explanation.bitwiseSteps ??= [];
            explanation.bitwiseSteps.push(makeBitwiseStep('~', value, null, result, type));
          }
          return result;
        }
        return cast(node.opcode === '-' ? -value : value, type, node);
      }
      case 'BinaryOperator': {
        if (node.opcode === '=') {
          const box = boxFor(left);
          const value = cast(scalar(right, explanation), box.type, node);
          box.value = value;
          return value;
        }
        if ((node.inner ?? []).some((child) => normalizedType(child.type?.qualType) === 'string')) unsupported(node);
        const value = scalar(left, explanation);
        if (node.opcode === '&&' || node.opcode === '||') {
          const leftBoolean = Boolean(value);
          const needsRight = node.opcode === '&&' ? leftBoolean : !leftBoolean;
          const rightBoolean = needsRight ? Boolean(scalar(right, explanation)) : node.opcode === '||';
          const result = node.opcode === '&&' ? leftBoolean && rightBoolean : leftBoolean || rightBoolean;
          if (explanation) explanation.expression = expressionText(node);
          return result;
        }
        const rightValue = scalar(right, explanation);
        if (explanation) explanation.expression = [value, node.opcode, rightValue].join(' ');
        const result = operation(node.opcode, value, rightValue, node, type);
        if (explanation && bitwiseOperators.has(node.opcode)) {
          explanation.bitwiseSteps ??= [];
          explanation.bitwiseSteps.push(makeBitwiseStep(node.opcode, value, rightValue, result, type));
        }
        return result;
      }
      default: unsupported(node);
    }
  }

  function operation(op, left, right, node, type) {
    switch (op) {
      case '==': return left === right;
      case '!=': return left !== right;
      case '<': return left < right;
      case '<=': return left <= right;
      case '>': return left > right;
      case '>=': return left >= right;
    }
    const a = Number(left);
    const b = Number(right);
    let value;
    if (bitwiseOperators.has(op)) {
      const width = integerWidth(type);
      const leftInteger = toBigInt(left);
      const rightInteger = toBigInt(right);
      if (op === '<<' || op === '>>') {
        if (rightInteger < 0n || rightInteger >= BigInt(width)) throw new Error('位移格數必須介於 0 和 ' + (width - 1) + ' 之間。');
        if (op === '<<' && leftInteger < 0n) throw new Error('這裡先展示非負整數的左移。');
        value = op === '<<' ? leftInteger << rightInteger : leftInteger >> rightInteger;
      } else if (op === '&') value = leftInteger & rightInteger;
      else if (op === '|') value = leftInteger | rightInteger;
      else value = leftInteger ^ rightInteger;
      return cast(fromTwosComplement(value, width), type, node);
    }
    const useBigInt = type === 'long long' && !floating.has(type);
    if (useBigInt) {
      const leftInteger = toBigInt(left);
      const rightInteger = toBigInt(right);
      switch (op) {
        case '+': value = leftInteger + rightInteger; break;
        case '-': value = leftInteger - rightInteger; break;
        case '*': value = leftInteger * rightInteger; break;
        case '/':
        case '%':
          if (rightInteger === 0n) throw new Error('這一步的除數是 0，程式無法繼續。');
          if (leftInteger === minLongLong && rightInteger === -1n) throw new Error('這一步超出了 long long 的範圍。');
          value = op === '/' ? leftInteger / rightInteger : leftInteger % rightInteger;
          break;
        default: unsupported(node);
      }
      return cast(value, type, node);
    }
    switch (op) {
      case '+': value = a + b; break;
      case '-': value = a - b; break;
      case '*': value = a * b; break;
      case '/':
      case '%':
        if (!floating.has(type)) {
          if (b === 0) throw new Error('這一步的除數是 0，程式無法繼續。');
          if (a === minInt && b === -1) throw new Error('這一步超出了 int 的範圍。');
        }
        value = op === '/' ? a / b : a % b;
        break;
      default: unsupported(node);
    }
    return cast(value, type, node);
  }

  function integerWidth(type) {
    return normalizedType(type) === 'long long' ? 64 : 32;
  }

  function toBigInt(value) {
    return typeof value === 'bigint' ? value : BigInt(Math.trunc(Number(value)));
  }

  function fromTwosComplement(value, width) {
    const modulus = 1n << BigInt(width);
    const unsigned = ((value % modulus) + modulus) % modulus;
    return unsigned >= (modulus >> 1n) ? unsigned - modulus : unsigned;
  }

  function makeBitwiseStep(operator, left, right, result, type) {
    const width = integerWidth(type);
    const bits = (value) => {
      const modulus = 1n << BigInt(width);
      const unsigned = ((toBigInt(value) % modulus) + modulus) % modulus;
      return unsigned.toString(2).padStart(width, '0').replace(/(.{8})(?=.)/g, '$1 ');
    };
    return {
      operator,
      left: String(left),
      right: right === null ? null : String(right),
      leftBits: bits(left),
      rightBits: right === null ? null : bits(right),
      result: String(result),
      resultBits: bits(result),
      width,
    };
  }

  function findStringLiteral(node) {
    if (node.kind === 'StringLiteral') return node;
    for (const child of node.inner ?? []) {
      const literal = findStringLiteral(child);
      if (literal) return literal;
    }
  }

  function stringLiteralSource(node) {
    const range = location(node);
    return range ? source.slice(range.start, range.end) : node.value;
  }

  function decodeCppLiteral(literal) {
    const match = literal.match(/^(?:u8|u|U|L)?"([\s\S]*)"$/);
    if (!match) throw new Error('字串常值格式無法辨識。');
    const source = match[1];
    let result = '';
    for (let index = 0; index < source.length; index++) {
      const char = source[index];
      if (char !== '\\') {
        result += char;
        continue;
      }
      const escape = source[++index];
      const simple = { "'": "'", '"': '"', '?': '?', '\\': '\\', a: '\x07', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t', v: '\x0b' };
      if (Object.hasOwn(simple, escape)) {
        result += simple[escape];
      } else if (/[0-7]/.test(escape ?? '')) {
        let digits = escape;
        while (digits.length < 3 && /[0-7]/.test(source[index + 1] ?? '')) digits += source[++index];
        result += String.fromCodePoint(parseInt(digits, 8));
      } else if (escape === 'x') {
        let digits = '';
        while (/[0-9a-f]/i.test(source[index + 1] ?? '')) digits += source[++index];
        if (!digits) throw new Error('\\x 後面需要至少一個十六進位數字。');
        result += String.fromCodePoint(parseInt(digits, 16));
      } else if (escape === 'u' || escape === 'U') {
        const count = escape === 'u' ? 4 : 8;
        const digits = source.slice(index + 1, index + 1 + count);
        if (digits.length !== count || !new RegExp('^[0-9a-f]{' + count + '}$', 'i').test(digits)) throw new Error('Unicode 跳脫字元格式不完整。');
        result += String.fromCodePoint(parseInt(digits, 16));
        index += count;
      } else {
        throw new Error('這個跳脫字元目前無法解讀：\\' + (escape ?? ''));
      }
    }
    return result;
  }

  function expressionText(node) {
    const range = location(node);
    if (range) return source.slice(range.start, range.end);
    const [left, right] = node.inner ?? [];
    switch (node.kind) {
      case 'ParenExpr': return '(' + expressionText(left) + ')';
      case 'ImplicitCastExpr':
      case 'MaterializeTemporaryExpr':
      case 'CXXBindTemporaryExpr': return expressionText(left);
      case 'IntegerLiteral':
      case 'FloatingLiteral': return String(node.value);
      case 'CXXBoolLiteralExpr': return String(node.value);
      case 'StringLiteral': return String(node.value);
      case 'DeclRefExpr': return node.referencedDecl?.name ?? '?';
      case 'UnaryOperator': return node.isPostfix ? expressionText(left) + node.opcode : node.opcode + expressionText(left);
      case 'BinaryOperator': return expressionText(left) + ' ' + node.opcode + ' ' + expressionText(right);
      case 'ConditionalOperator': return expressionText(left) + ' ? ' + expressionText(right) + ' : ' + expressionText(node.inner?.[2]);
      case 'CStyleCastExpr': return '(' + normalizedType(node.type?.qualType) + ')(' + expressionText(left) + ')';
      default: return '';
    }
  }

  function isCalculation(node) {
    return ['BinaryOperator', 'UnaryOperator', 'ConditionalOperator', 'CStyleCastExpr', 'CXXStaticCastExpr', 'CXXFunctionalCastExpr'].includes(node.kind)
      && !['=', '+=', '-=', '*=', '/=', '%='].includes(node.opcode);
  }

  function* scoped(node, run) {
    scopes.push([]);
    const signal = yield* run();
    const removed = scopes.pop();
    for (const id of removed) boxes.delete(id);
    if (removed.length) yield frame(node, 'leave', '離開這個區塊，裡面的變數箱退場。');
    return signal;
  }

  function flattenStream(node, operator, name) {
    if (node.kind === 'DeclRefExpr' && node.referencedDecl?.name === name) return [];
    if (node.kind !== 'CXXOperatorCallExpr') unsupported(node);
    const [call, left, right] = node.inner;
    if (call.inner?.[0]?.referencedDecl?.name !== operator) unsupported(node);
    return [...flattenStream(left, operator, name), right];
  }

  function unwrapOutput(node) {
    while (['ImplicitCastExpr', 'MaterializeTemporaryExpr', 'CXXBindTemporaryExpr', 'ParenExpr'].includes(node.kind)) {
      node = node.inner[0];
    }
    return node;
  }

  function outputText(node, calculations) {
    const value = unwrapOutput(node);
    if (value.kind === 'DeclRefExpr' && value.referencedDecl?.kind === 'FunctionDecl') {
      const name = value.referencedDecl.name;
      if (name === 'endl') return '\n';
      if (['fixed', 'scientific', 'defaultfloat'].includes(name)) format.mode = name;
      else if (name === 'left' || name === 'right') format.left = name === 'left';
      else unsupported(node);
      return '';
    }
    if (value.kind === 'CallExpr') {
      const [callee, argument] = value.inner;
      const name = unwrapOutput(callee).referencedDecl?.name;
      const parameter = scalar(argument);
      if (name === 'setfill' && argument.type?.qualType === 'char') format.fill = String.fromCharCode(parameter);
      else if (name === 'setw' || name === 'setprecision') {
        const width = name === 'setw';
        const limit = width ? 1000 : 100;
        if (parameter < 0 || parameter > limit) throw new Error(name + ' 的展示範圍是 0～' + limit + '。');
        format[width ? 'width' : 'precision'] = parameter;
      } else unsupported(node);
      return '';
    }

    let text;
    let calculationValue;
    const explanation = {};
    if (value.kind === 'StringLiteral') {
      text = decodeCppLiteral(stringLiteralSource(value)).split('\0')[0];
    } else {
      const type = normalizedType(node.type?.qualType);
      const number = scalar(node, explanation);
      calculationValue = number;
      if (type === 'char') text = String.fromCharCode(number);
      else if (type === 'string' || type === 'cstring') text = String(number);
      else if (floating.has(type)) text = formatSandboxFloat(number, format.mode, format.precision);
      else if (type === 'bool') text = String(Number(number));
      else if (typeof number === 'bigint') text = number.toString();
      else text = String(Number(number));
    }
    const pad = format.fill.repeat(Math.max(0, format.width - encoder.encode(text).length));
    format.width = 0;
    const formatted = format.left ? text + pad : pad + text;
    if (isCalculation(value)) {
      const result = normalizedType(value.type?.qualType) === 'bool' ? String(Boolean(calculationValue)) : formatted;
      calculations.push({ expression: expressionText(node), result, bitwiseSteps: explanation.bitwiseSteps ?? [] });
    }
    return formatted;
  }

  function* statement(node) {
    const children = node.inner ?? [];
    const [first, second, third, fourth, fifth] = children;
    switch (node.kind) {
      case 'ExprWithCleanups': return yield* statement(first);
      case 'CompoundStmt':
        return yield* scoped(node, function* () {
          for (const child of children) {
            const signal = yield* statement(child);
            if (signal) return signal;
          }
        });
      case 'DeclStmt':
        for (const decl of children) {
          const type = normalizedType(decl.type?.qualType);
          if (decl.kind !== 'VarDecl' || !scalarTypes.has(type) || decl.storageClass) unsupported(decl);
          const value = decl.init ? cast(scalar(decl.inner[0]), type, decl) : null;
          boxes.set(decl.id, { id: decl.id, name: decl.name, type, value });
          scopes.at(-1).push(decl.id);
          yield frame(decl, 'declare', '放下 ' + decl.name + ' 的箱子。', decl.id);
        }
        return;
      case 'IfStmt': {
        if (children.length !== (node.hasElse ? 3 : 2)) unsupported(node);
        const yes = Boolean(scalar(first));
        yield frame(first, 'condition', yes ? '條件成立。' : '條件不成立。');
        const branch = yes ? second : third;
        if (branch) return yield* scoped(branch, () => statement(branch));
        return;
      }
      case 'ForStmt':
        if (children.length !== 5 || second.kind) unsupported(node);
        return yield* scoped(node, function* () {
          if (first.kind) yield* statement(first);
          while (true) {
            const yes = !third.kind || Boolean(scalar(third));
            yield frame(third.kind ? third : node, 'condition', yes ? '條件成立，進入這一輪。' : '條件不成立，離開迴圈。');
            if (!yes) return;
            const signal = yield* scoped(fifth, () => statement(fifth));
            if (signal === 'return') return signal;
            if (signal === 'break') return;
            if (fourth.kind) yield* statement(fourth);
          }
        });
      case 'WhileStmt':
        if (children.length !== 2) unsupported(node);
        while (true) {
          const yes = Boolean(scalar(first));
          yield frame(first, 'condition', yes ? '條件成立，進入這一輪。' : '條件不成立，離開迴圈。');
          if (!yes) return;
          const signal = yield* scoped(second, () => statement(second));
          if (signal === 'return') return signal;
          if (signal === 'break') return;
        }
      case 'ReturnStmt':
        if (first) scalar(first);
        yield frame(node, 'return', '離開 main，程式結束。');
        return 'return';
      case 'BreakStmt':
      case 'ContinueStmt': {
        const breaks = node.kind === 'BreakStmt';
        yield frame(node, 'condition', breaks ? '走到迴圈出口。' : '跳過這一輪剩下的指令。');
        return breaks ? 'break' : 'continue';
      }
      case 'NullStmt': return;
      case 'CXXOperatorCallExpr': {
        const operator = first.inner?.[0]?.referencedDecl?.name;
        if (operator === 'operator>>') {
          for (const variable of flattenStream(node, 'operator>>', stream.input)) {
            const box = boxFor(variable);
            const input = yield {
              ...frame(node, 'input', '打開背包，準備接收 ' + box.name + ' 的資料。', box.id),
              inputType: box.type,
              inputName: box.name,
              inputMode: box.type === 'char' ? 'formatted-char' : 'formatted-token',
            };
            const value = parseSandboxInput(box.type, input);
            if (value === undefined) throw new Error('「' + input + '」無法存入 ' + box.type + ' 變數 ' + box.name + '。');
            box.value = value;
            yield { ...frame(node, 'receive', '把 ' + input + ' 放進 ' + box.name + '。', box.id), inputToken: input };
          }
          return;
        }
        if (operator === 'operator<<') {
          const calculations = [];
          const spoken = flattenStream(node, 'operator<<', stream.output).map((part) => outputText(part, calculations)).join('');
          for (const bitwise of calculations.flatMap((item) => item.bitwiseSteps)) {
            yield { ...frame(node, 'bitwise', '倉鼠把每個位元排開，逐格算完這一步。'), bitwise };
          }
          output += spoken;
          if (output.length > 8000) throw new Error('輸出已達展示上限。');
          const calculation = calculations.length ? {
            expression: calculations.map((item) => item.expression).join('\n'),
            result: calculations.map((item) => item.result).join('\n'),
          } : undefined;
          yield { ...frame(node, 'output', spoken ? '倉鼠說出這一步的輸出。' : '設定後續的輸出格式。'), spoken, calculation };
          return;
        }
        unsupported(node);
        break;
      }
      case 'CallExpr':
      case 'CXXMemberCallExpr': {
        const callee = first;
        const name = referencedName(callee);
        const args = children.slice(1);
        let variable;
        let mode;
        if (name === 'getline' && args.length === 2 && referencedName(args[0]) === 'cin') {
          variable = args[1];
          mode = 'line';
        } else if (name === 'get' && args.length === 1 && referencedName(callee).includes('get')
          && (callee.inner ?? []).some((part) => referencedName(part) === 'cin')) {
          variable = args[0];
          mode = 'raw-char';
        } else {
          unsupported(node);
        }
        const box = boxFor(variable);
        if ((mode === 'line' && box.type !== 'string') || (mode === 'raw-char' && box.type !== 'char')) unsupported(node);
        const value = yield {
          ...frame(node, 'input', '打開背包，準備接收 ' + box.name + ' 的資料。', box.id),
          inputType: box.type,
          inputName: box.name,
          inputMode: mode,
        };
        const parsed = mode === 'line' ? String(value)
          : mode === 'raw-char'
          ? (typeof value === 'string' && [...value].length === 1 ? value.codePointAt(0) : undefined)
          : parseSandboxInput(box.type, value);
        if (parsed === undefined) throw new Error('輸入資料無法存入 ' + box.type + ' 變數 ' + box.name + '。');
        box.value = parsed;
        yield { ...frame(node, 'receive', '把輸入資料放進 ' + box.name + '。', box.id), inputToken: value };
        return;
      }
      case 'BinaryOperator':
      case 'CompoundAssignOperator':
      case 'UnaryOperator': {
        const op = node.opcode;
        if (!['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '++', '--'].includes(op)) unsupported(node);
        const box = boxFor(first);
        const before = box.value;
        const calculation = {};
        let value;
        if (op === '=') {
          const range = location(second);
          calculation.expression = range ? source.slice(range.start, range.end) : '';
          value = scalar(second, calculation);
        } else {
          const leftType = node.computeLHSType?.qualType ?? box.type;
          const resultType = node.computeResultType?.qualType ?? box.type;
          const left = cast(scalar(first), leftType, node);
          const right = second ? scalar(second) : 1;
            const operationKind = ['++', '--'].includes(op) ? op[0] : op.slice(0, -1);
            calculation.expression = [left, op, right].join(' ');
            value = operation(operationKind, left, right, node, resultType);
            if (bitwiseOperators.has(operationKind)) {
              calculation.bitwiseSteps ??= [];
              calculation.bitwiseSteps.push(makeBitwiseStep(operationKind, left, right, value, resultType));
            }
        }
          for (const bitwise of calculation.bitwiseSteps ?? []) {
            yield { ...frame(node, 'bitwise', '倉鼠把每個位元排開，逐格算完這一步。', box.id), bitwise };
          }
        box.value = cast(value, box.type, node);
        yield {
          ...frame(node, 'update', box.name + '：' + displaySandboxValue(before, box.type) + ' → ' + displaySandboxValue(box.value, box.type), box.id),
          calculation: { ...calculation, result: displaySandboxValue(box.value, box.type) },
        };
        return;
      }
      default: unsupported(node);
    }
  }

  return (function* () {
    for (const node of body.inner ?? []) {
      if ((yield* statement(node)) === 'return') break;
    }
    yield frame(null, 'done', '模擬完成。你可以回到前一步重看。');
  })();
}
