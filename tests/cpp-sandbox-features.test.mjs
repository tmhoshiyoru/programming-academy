import assert from 'node:assert/strict';
import test from 'node:test';
import { createSandbox, displaySandboxValue, parseSandboxInput, readPreparedSandboxInput } from '../src/lib/cpp-sandbox.mjs';

const declRef = (id, name, type) => ({
  kind: 'DeclRefExpr', type: { qualType: type }, referencedDecl: { id, name, kind: 'VarDecl' },
});
const intLiteral = (value) => ({ kind: 'IntegerLiteral', type: { qualType: 'int' }, value: String(value) });
const boolLiteral = (value) => ({ kind: 'CXXBoolLiteralExpr', type: { qualType: 'bool' }, value });
const binary = (opcode, left, right, type = 'int') => ({
  kind: 'BinaryOperator', opcode, type: { qualType: type }, inner: [left, right],
});
const stream = (operator, name, left, right) => ({
  kind: 'CXXOperatorCallExpr', inner: [
    { kind: 'ImplicitCastExpr', inner: [{ referencedDecl: { name: operator } }] },
    { kind: 'DeclRefExpr', referencedDecl: { name } },
    right,
  ],
});
const variable = (id, name, type, init) => ({
  kind: 'VarDecl', id, name, type: { qualType: type }, ...(init ? { init: 'c', inner: [init] } : {}),
});
const program = (statements) => ({ inner: [{
  kind: 'FunctionDecl', name: 'main', inner: [{ kind: 'CompoundStmt', inner: statements }],
}] });

test('string variables accept one input token and speak their value', () => {
  assert.equal(parseSandboxInput('string', 'Maple'), 'Maple');
  assert.equal(parseSandboxInput('string', 'two words'), undefined);
  assert.equal(displaySandboxValue('Maple', 'string'), 'Maple');
  const id = 'name-id';
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable(id, 'name', 'std::string')] },
    stream('operator>>', 'cin', null, declRef(id, 'name', 'std::string')),
    stream('operator<<', 'cout', null, declRef(id, 'name', 'std::string')),
  ]), '');
  assert.equal(trace.next().value.action, 'declare');
  const waiting = trace.next().value;
  assert.equal(waiting.action, 'input');
  assert.equal(waiting.inputType, 'string');
  assert.equal(trace.next('Maple').value.action, 'receive');
  const spoken = trace.next().value;
  assert.equal(spoken.action, 'output');
  assert.equal(spoken.spoken, 'Maple');
});

test('cout displays the calculation and result for arithmetic and logical expressions', () => {
  const a = declRef('a-id', 'a', 'int');
  const b = declRef('b-id', 'b', 'int');
  const comparison = binary('<', a, b, 'bool');
  const notFalse = { kind: 'UnaryOperator', opcode: '!', type: { qualType: 'bool' }, inner: [boolLiteral(false)] };
  const logical = binary('&&', comparison, notFalse, 'bool');
  const arithmetic = binary('+', intLiteral(2), binary('*', intLiteral(3), intLiteral(4)));
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable('a-id', 'a', 'int', intLiteral(2)), variable('b-id', 'b', 'int', intLiteral(3))] },
    stream('operator<<', 'cout', null, arithmetic),
    stream('operator<<', 'cout', null, logical),
  ]), '');
  let frame;
  do { frame = trace.next().value; } while (frame?.action !== 'output');
  assert.equal(frame.spoken, '14');
  assert.deepEqual(frame.calculation, { expression: '2 + 3 * 4', result: '14' });
  frame = trace.next().value;
  assert.equal(frame.spoken, '1');
  assert.deepEqual(frame.calculation, { expression: 'a < b && !false', result: 'true' });
});

test('all six comparisons and logical OR can be displayed without branching', () => {
  const comparisons = [
    ['==', 2, 2, true], ['!=', 2, 3, true], ['<', 2, 3, true],
    ['<=', 3, 3, true], ['>', 4, 3, true], ['>=', 3, 3, true],
  ];
  const expressions = comparisons.map(([op, left, right]) => binary(op, intLiteral(left), intLiteral(right), 'bool'));
  expressions.push(binary('||', boolLiteral(false), boolLiteral(true), 'bool'));
  const trace = createSandbox(program(expressions.map((expression) => stream('operator<<', 'cout', null, expression))), '');
  for (const [, , , expected] of comparisons) {
    const frame = trace.next().value;
    assert.equal(frame.action, 'output');
    assert.equal(frame.spoken, expected ? '1' : '0');
    assert.equal(frame.calculation.result, String(expected));
  }
  const orFrame = trace.next().value;
  assert.equal(orFrame.spoken, '1');
  assert.equal(orFrame.calculation.result, 'true');
});

test('short and long long keep their ranges and exact integer values', () => {
  assert.equal(parseSandboxInput('short', '32767'), 32767);
  assert.equal(parseSandboxInput('short', '32768'), undefined);
  assert.equal(parseSandboxInput('long', '2147483647'), 2147483647);
  assert.equal(parseSandboxInput('long long', '9223372036854775807'), 9223372036854775807n);
  assert.equal(parseSandboxInput('long long', '9223372036854775808'), undefined);
  assert.equal(displaySandboxValue(5000000000n, 'long long'), '5000000000');
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable('small', 'small', 'short', intLiteral(32767)), variable('large', 'large', 'long long', { kind: 'IntegerLiteral', type: { qualType: 'long long' }, value: '5000000000' })] },
  ]), '');
  trace.next();
  const frame = trace.next().value;
  assert.equal(frame.boxes.find((box) => box.name === 'large').value, 5000000000n);
  const arithmetic = createSandbox(program([
    stream('operator<<', 'cout', null, binary('+',
      { kind: 'IntegerLiteral', type: { qualType: 'long long' }, value: '5000000000' },
      { kind: 'IntegerLiteral', type: { qualType: 'long long' }, value: '7' }, 'long long')),
  ]), '');
  assert.equal(arithmetic.next().value.spoken, '5000000007');
});

test('bitwise operations produce a wide per-bit work frame before their output', () => {
  const bitAnd = binary('&', intLiteral(13), intLiteral(10));
  const bitOr = binary('|', intLiteral(13), intLiteral(10));
  const bitXor = binary('^', intLiteral(13), intLiteral(10));
  const shiftLeft = binary('<<', intLiteral(5), intLiteral(1));
  const shiftRight = binary('>>', intLiteral(20), intLiteral(2));
  const bitNot = { kind: 'UnaryOperator', opcode: '~', type: { qualType: 'int' }, inner: [intLiteral(0)] };
  const trace = createSandbox(program([bitAnd, bitOr, bitXor, shiftLeft, shiftRight, bitNot]
    .map((expression) => stream('operator<<', 'cout', null, expression))), '');
  for (const [op, expected] of [['&', '8'], ['|', '15'], ['^', '7'], ['<<', '10'], ['>>', '5'], ['~', '-1']]) {
    const work = trace.next().value;
    assert.equal(work.action, 'bitwise');
    assert.equal(work.bitwise.operator, op);
    assert.equal(work.bitwise.width, 32);
    assert.equal(work.bitwise.result, expected);
    assert.equal(work.bitwise.resultBits.replaceAll(' ', '').length, 32);
    const output = trace.next().value;
    assert.equal(output.action, 'output');
    assert.equal(output.spoken, expected);
  }
});

test('conditional expressions select and display the chosen branch in cout', () => {
  const choice = {
    kind: 'ConditionalOperator', type: { qualType: 'int' },
    inner: [declRef('condition', 'condition', 'int'), intLiteral(42), intLiteral(7)],
  };
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable('condition', 'condition', 'int', intLiteral(1))] },
    stream('operator<<', 'cout', null, choice),
  ]), '');
  assert.equal(trace.next().value.action, 'declare');
  const output = trace.next().value;
  assert.equal(output.spoken, '42');
  assert.deepEqual(output.calculation, { expression: 'condition ? 42 : 7', result: '42' });

  const textChoice = {
    kind: 'ConditionalOperator', type: { qualType: 'const char *' },
    inner: [boolLiteral(false), { kind: 'StringLiteral', type: { qualType: 'const char[5]' }, value: '"even"' },
      { kind: 'StringLiteral', type: { qualType: 'const char[4]' }, value: '"odd"' }],
  };
  const textTrace = createSandbox(program([stream('operator<<', 'cout', null, textChoice)]), '');
  const textOutput = textTrace.next().value;
  assert.equal(textOutput.spoken, 'odd');
  assert.deepEqual(textOutput.calculation, { expression: 'false ? "even" : "odd"', result: 'odd' });
});

test('chained assignment and increment expressions keep C++ evaluation results', () => {
  const a = declRef('a-id', 'a', 'int');
  const b = declRef('b-id', 'b', 'int');
  const assignB = binary('=', b, intLiteral(3));
  const assignA = binary('=', a, assignB);
  const postIncrement = { kind: 'UnaryOperator', opcode: '++', type: { qualType: 'int' }, isPostfix: true, inner: [a] };
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable('a-id', 'a', 'int', intLiteral(0)), variable('b-id', 'b', 'int', intLiteral(0))] },
    assignA,
    stream('operator<<', 'cout', null, postIncrement),
    stream('operator<<', 'cout', null, a),
  ]), '');
  trace.next();
  trace.next();
  const assigned = trace.next().value;
  assert.equal(assigned.boxes.find((box) => box.name === 'a').value, 3);
  assert.equal(assigned.boxes.find((box) => box.name === 'b').value, 3);
  const oldValue = trace.next().value;
  assert.equal(oldValue.spoken, '3');
  assert.deepEqual(oldValue.calculation, { expression: 'a++', result: '3' });
  assert.equal(oldValue.boxes.find((box) => box.name === 'a').value, 4);
  assert.equal(trace.next().value.spoken, '4');
});

test('C++ string escapes and prepared formatted, raw-character, and line input are handled', () => {
  const literal = { kind: 'StringLiteral', type: { qualType: 'const char[1]' },
    value: String.raw`"quote: \"hi\", slash \\, apostrophe \' octal \101 hex \x42 unicode \u4e2d"` };
  const outputTrace = createSandbox(program([stream('operator<<', 'cout', null, literal)]), '');
  assert.equal(outputTrace.next().value.spoken, 'quote: "hi", slash \\, apostrophe \' octal A hex B unicode 中');

  assert.deepEqual(readPreparedSandboxInput('one  two\n3', 'formatted-token'), { value: 'one', position: { row: 0, column: 3 } });
  assert.deepEqual(readPreparedSandboxInput('one  two\n3', 'formatted-token', { row: 0, column: 3 }), { value: 'two', position: { row: 0, column: 8 } });
  assert.deepEqual(readPreparedSandboxInput('Ada Lovelace\n \nX', 'line'), { value: 'Ada Lovelace', position: { row: 1, column: 0 } });
  assert.deepEqual(readPreparedSandboxInput('Ada Lovelace\n \nX', 'raw-char', { row: 1, column: 0 }), { value: ' ', position: { row: 1, column: 1 } });
  assert.equal(parseSandboxInput('char', ' '), 32);
  assert.equal(parseSandboxInput('string', 'two words'), undefined);
});

test('getline preserves a full string line and cin.get can receive a space character', () => {
  const name = declRef('name-id', 'name', 'std::string');
  const separator = declRef('separator-id', 'separator', 'char');
  const cin = { kind: 'DeclRefExpr', referencedDecl: { name: 'cin' } };
  const getlineCall = { kind: 'CallExpr', inner: [
    { kind: 'ImplicitCastExpr', inner: [{ referencedDecl: { name: 'getline' } }] }, cin, name,
  ] };
  const getCall = { kind: 'CXXMemberCallExpr', inner: [
    { kind: 'MemberExpr', name: 'get', inner: [cin] }, separator,
  ] };
  const trace = createSandbox(program([
    { kind: 'DeclStmt', inner: [variable('name-id', 'name', 'std::string'), variable('separator-id', 'separator', 'char')] },
    getlineCall,
    getCall,
  ]), '');
  trace.next();
  trace.next();
  const lineInput = trace.next().value;
  assert.equal(lineInput.inputMode, 'line');
  trace.next('Ada Lovelace');
  const characterInput = trace.next().value;
  assert.equal(characterInput.inputMode, 'raw-char');
  const received = trace.next(' ').value;
  assert.equal(received.boxes.find((box) => box.name === 'name').value, 'Ada Lovelace');
  assert.equal(received.boxes.find((box) => box.name === 'separator').value, 32);
});
