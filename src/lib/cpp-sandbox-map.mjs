function sourceRange(node, offsets) {
  const begin = node?.range?.begin?.offset;
  const end = node?.range?.end;
  if (!Number.isInteger(begin) || !Number.isInteger(end?.offset)) return null;
  const start = offsets.get(begin);
  const finish = offsets.get(end.offset + (end.tokLen ?? 1));
  return start === undefined || finish === undefined ? null : { start, end: finish };
}

function lineAt(source, offset) {
  return source.slice(0, offset).split('\n').length;
}

function textOf(node, source, offsets) {
  const range = sourceRange(node, offsets);
  return range ? source.slice(range.start, range.end).replace(/\s+/g, ' ').trim() : '';
}

function streamOperator(node) {
  if (node?.kind !== 'CXXOperatorCallExpr') return '';
  const reference = node.inner?.[0]?.inner?.[0]?.referencedDecl?.name;
  return reference === 'operator>>' || reference === 'operator<<' ? reference : '';
}

export function buildSandboxMap(ast, source) {
  const main = (ast.inner ?? []).find((node) => node.kind === 'FunctionDecl' && node.name === 'main');
  const body = main?.inner?.find((node) => node.kind === 'CompoundStmt');
  let sequence = 0;
  const offsets = new Map();
  const encoder = new TextEncoder();
  let byte = 0;
  let index = 0;
  for (const character of source) {
    offsets.set(byte, index);
    byte += character.length === 1 && character.charCodeAt(0) < 128 ? 1 : encoder.encode(character).length;
    index += character.length;
  }
  offsets.set(byte, index);

  function item(kind, title, node, details = {}) {
    const range = sourceRange(node, offsets);
    return {
      id: 'route-' + (++sequence), kind, title, details,
      range,
      line: range ? lineAt(source, range.start) : null,
    };
  }

  function statements(node) {
    if (!node) return [];
    if (node.kind === 'CompoundStmt') return (node.inner ?? []).flatMap(statements);
    if (node.kind === 'DeclStmt') return (node.inner ?? []).map((decl) =>
      item('declare', '放入變數', decl, { label: (decl.type?.qualType ?? '') + ' ' + (decl.name ?? '') }));
    if (node.kind === 'IfStmt') {
      const children = node.inner ?? [];
      const condition = children[0];
      const hasElse = Boolean(node.hasElse);
      return [item('branch', 'if 條件判斷', node, {
        condition: textOf(condition, source, offsets),
        yes: statements(children[1]),
        no: hasElse ? statements(children[2]) : [],
        hasElse,
      })];
    }
    if (node.kind === 'ForStmt') {
      const children = node.inner ?? [];
      return [item('loop', '迴圈路徑', node, {
        condition: children[2]?.kind ? textOf(children[2], source, offsets) : '沒有停止條件',
        body: statements(children[4]),
      })];
    }
    if (node.kind === 'WhileStmt') {
      const children = node.inner ?? [];
      return [item('loop', '迴圈路徑', node, {
        condition: textOf(children[0], source, offsets),
        body: statements(children[1]),
      })];
    }
    if (node.kind === 'DoStmt') {
      const children = node.inner ?? [];
      return [item('loop', '至少走一次的迴圈', node, {
        condition: textOf(children[1], source, offsets),
        body: statements(children[0]),
      })];
    }
    if (node.kind === 'CXXOperatorCallExpr') {
      const operator = streamOperator(node);
      if (operator) return [item(operator === 'operator>>' ? 'input' : 'output', operator === 'operator>>' ? '讀取資料' : '輸出內容', node)];
    }
    if (node.kind === 'CallExpr' || node.kind === 'CXXMemberCallExpr') {
      const name = node.inner?.[0]?.referencedDecl?.name ?? node.inner?.[0]?.name
        ?? node.inner?.[0]?.inner?.[0]?.referencedDecl?.name;
      if (name === 'getline' || name === 'get') return [item('input', '讀取資料', node, { label: name === 'getline' ? '整行文字' : '一個字元' })];
    }
    if (node.kind === 'ReturnStmt') return [item('finish', '程式結束', node)];
    if (['BinaryOperator', 'CompoundAssignOperator', 'UnaryOperator'].includes(node.kind)) {
      return [item('work', '運算與指定', node, { label: textOf(node, source, offsets) })];
    }
    return [];
  }

  return statements(body);
}
