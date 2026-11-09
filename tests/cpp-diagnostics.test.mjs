import assert from 'node:assert/strict';
import test from 'node:test';
import { findEarlierClue, findSymbolMistake, parseCppDiagnostics, sourceColumn } from '../src/lib/cpp-diagnostics.mjs';
import { findMissingIncludeHashes } from '../src/lib/cpp-source.mjs';

test('a missing include hash is suggested only on a reported source line outside comments and strings', () => {
  const source = [
    'include<iostream>',
    '  include "my-header.h" // 說明',
    '#include <vector>',
    '/*',
    'include <string>',
    '*/',
    'auto example = R"(',
    'include <queue>',
    ')";',
    'include <map>',
  ].join('\n');

  assert.deepEqual(findMissingIncludeHashes(source, new Set([1, 2, 3, 5, 8])), [
    { line: 1, corrected: '#include <iostream>' },
    { line: 2, corrected: '#include "my-header.h"' },
  ]);
});

test('an earlier matching bracket or insertion can be shown beside the reported line', () => {
  const [brace, semicolon] = parseCppDiagnostics([
    "main.cpp:4:2: error: expected '}'",
    "main.cpp:1:12: note: to match this '{'",
    "main.cpp:8:1: error: expected ';' at end of declaration",
    'fix-it:"main.cpp":{7:11-7:11}:";"',
  ].join('\n'));

  assert.equal(brace.line, 4);
  assert.equal(findEarlierClue(brace).line, 1);
  assert.equal(findEarlierClue(brace).text, '{');
  assert.deepEqual(findEarlierClue(semicolon), {
    line: 7, column: 11, endLine: 7, endColumn: 11, text: ';', kind: 'insert',
  });
});

test('reported fullwidth symbols use UTF-8 columns and select the exact character', () => {
  const [entry] = parseCppDiagnostics(
    'main.cpp:1:11: error: character <U+FF1B> not allowed in an identifier',
  );
  const lines = ['int 分數；'];
  assert.equal(sourceColumn(lines[0], entry.column), 6);
  assert.deepEqual(findSymbolMistake(entry, lines), {
    index: 6, length: 1, symbol: '；', replacement: ';', fullwidth: true,
  });
  assert.equal(findSymbolMistake({ ...entry, column: 1 }, lines), undefined);
  assert.equal(sourceColumn('😀；', 5), 2);
});
