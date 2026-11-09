import assert from 'node:assert/strict';
import test from 'node:test';
import { formatSandboxFloat } from '../src/lib/cpp-sandbox-format.mjs';
import { displaySandboxValue, parseSandboxInput } from '../src/lib/cpp-sandbox.mjs';

test('floating output rounds the binary value and preserves fixed-width decimals', () => {
  assert.equal(formatSandboxFloat(2.5, 'fixed', 0), '2');
  assert.equal(formatSandboxFloat(3.5, 'fixed', 0), '4');
  assert.equal(formatSandboxFloat(1.125, 'fixed', 2), '1.12');
  assert.equal(formatSandboxFloat(1.005, 'fixed', 2), '1.00');
  assert.equal(formatSandboxFloat(-0, 'fixed', 2), '-0.00');
  assert.equal(formatSandboxFloat(1e21, 'fixed', 2), '1000000000000000000000.00');
});

test('significant precision and scientific notation use the rounded exponent', () => {
  assert.equal(formatSandboxFloat(999.9, 'defaultfloat', 3), '1e+03');
  assert.equal(formatSandboxFloat(0.0000999999, 'defaultfloat', 3), '0.0001');
  assert.equal(formatSandboxFloat(0.125, 'scientific', 2), '1.25e-01');
  assert.equal(formatSandboxFloat(0, 'scientific', 2), '0.00e+00');
});

test('typed input and character labels distinguish char, float, and double', () => {
  assert.equal(parseSandboxInput('char', 'A'), 65);
  assert.equal(parseSandboxInput('char', '字'), undefined);
  assert.equal(displaySandboxValue(10, 'char'), "'\\n'");
  assert.equal(displaySandboxValue(65, 'char'), "'A'");
  assert.equal(parseSandboxInput('float', '1e-1'), Math.fround(0.1));
  assert.equal(parseSandboxInput('double', '1e-1'), 0.1);
  assert.equal(parseSandboxInput('float', '1e40'), undefined);
});
