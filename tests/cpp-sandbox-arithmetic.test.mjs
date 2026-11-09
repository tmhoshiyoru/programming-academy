import assert from 'node:assert/strict';
import test from 'node:test';
import { createSandbox } from '../src/lib/cpp-sandbox.mjs';

const literal = (value, type = 'int') => ({
  kind: type === 'bool' ? 'CXXBoolLiteralExpr' : type === 'double' || type === 'float' ? 'FloatingLiteral' : 'IntegerLiteral',
  type: { qualType: type },
  value,
});

const binary = (op, left, right, type = 'int') => ({
  kind: 'BinaryOperator', opcode: op, type: { qualType: type }, inner: [left, right],
});

function runWith(initializers) {
  const declarations = initializers.map(([name, type, init], index) => ({
    kind: 'VarDecl', id: 'var-' + index, name, type: { qualType: type }, inner: init ? [init] : [],
    ...(init ? { init: 'c' } : {}),
  }));
  const ast = { inner: [{
    kind: 'FunctionDecl', name: 'main', inner: [{ kind: 'CompoundStmt', inner: [{ kind: 'DeclStmt', inner: declarations }] }],
  }] };
  const trace = createSandbox(ast, '');
  return [...trace].at(-1).boxes;
}

test('C-style casts such as (char)(107) create the requested variable type', () => {
  const cast = { kind: 'CStyleCastExpr', type: { qualType: 'char' }, inner: [literal('107')] };
  const [box] = runWith([['letter', 'char', cast]]);
  assert.equal(box.value, 107);
});

test('nested arithmetic follows precedence, parentheses, integer division, and remainder', () => {
  const expression = binary('%',
    binary('*',
      binary('/', binary('+', literal('20'), literal('4')), literal('3')),
      literal('2')),
    literal('5'));
  const negativeDivision = binary('/', { kind: 'UnaryOperator', opcode: '-', type: { qualType: 'int' }, inner: [literal('7')] }, literal('2'));
  const [answer, negative] = runWith([['answer', 'int', expression], ['negative', 'int', negativeDivision]]);
  assert.equal(answer.value, 1);
  assert.equal(negative.value, -3);
});

test('float and double arithmetic retain their C++ result types', () => {
  const floatSum = binary('+', literal('0.1', 'float'), literal('0.2', 'float'), 'float');
  const doubleProduct = binary('*', literal('1.25', 'double'), literal('4', 'int'), 'double');
  const [sum, product] = runWith([['sum', 'float', floatSum], ['product', 'double', doubleProduct]]);
  assert.equal(sum.value, Math.fround(Math.fround(0.1) + Math.fround(0.2)));
  assert.equal(product.value, 5);
});
