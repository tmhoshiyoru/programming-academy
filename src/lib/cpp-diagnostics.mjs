const locatedMessage = /^(.*?):(\d+):(\d+): (fatal error|error|warning|note): (.*)$/;
const fixitRecord = /^fix-it:"main\.cpp":\{(\d+):(\d+)-(\d+):(\d+)\}:("(?:[^"\\]|\\.)*")$/;

export function parseCppDiagnostics(output) {
  const entries = [];
  let current;
  for (const row of output.split('\n')) {
    const located = locatedMessage.exec(row);
    if (located) {
      const [, file, line, column, severity, message] = located;
      const location = { file, line: Number(line), column: Number(column), message };
      if (severity === 'note') {
        current?.notes.push(location);
      } else {
        current = { ...location, severity, notes: [], fixes: [] };
        entries.push(current);
      }
      continue;
    }
    const fix = fixitRecord.exec(row);
    if (fix && current) {
      try {
        current.fixes.push({
          line: Number(fix[1]), column: Number(fix[2]),
          endLine: Number(fix[3]), endColumn: Number(fix[4]), text: JSON.parse(fix[5]),
        });
      } catch {
        // Other escape sequences remain available in the original diagnostics.
      }
      continue;
    }
    const unlocated = /^(?:[^:]+: )?(fatal error|error|warning): (.*)$/.exec(row);
    if (unlocated) {
      current = { file: '', line: 0, column: 0, severity: unlocated[1], message: unlocated[2], notes: [], fixes: [] };
      entries.push(current);
    }
  }
  return entries;
}

// Clang's columns count UTF-8 bytes. Textarea selections count UTF-16 code units.
export function sourceColumn(line, column) {
  let bytes = 1;
  let index = 0;
  for (const char of line) {
    if (bytes >= column) break;
    const codePoint = char.codePointAt(0);
    bytes += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
    index += char.length;
  }
  return index;
}

const symbolReplacements = new Map([
  ['“', '"'], ['”', '"'], ['‘', "'"], ['’', "'"], ['−', '-'],
  ['\u00a0', ' '], ['\u3000', ' '],
]);

export function findSymbolMistake(entry, lines) {
  if (entry.file !== 'main.cpp' || lines[entry.line - 1] === undefined) return;
  const codePoint = /(?:unexpected character|character) <U\+([\dA-F]+)>/i.exec(entry.message);
  const whitespace = /treating Unicode character as whitespace/i.test(entry.message);
  if (!codePoint && !whitespace) return;

  const line = lines[entry.line - 1];
  const index = sourceColumn(line, entry.column);
  const code = line.codePointAt(index);
  if (code === undefined || (codePoint && code !== parseInt(codePoint[1], 16))) return;
  const symbol = String.fromCodePoint(code);
  const fullwidth = code >= 0xff01 && code <= 0xff5e;
  const replacement = fullwidth ? String.fromCodePoint(code - 0xfee0) : symbolReplacements.get(symbol);
  if (replacement === undefined) return;
  return { index, length: symbol.length, symbol, replacement, fullwidth: fullwidth || code === 0x3000 };
}

export function findEarlierClue(entry) {
  const fix = entry.fixes.find(({ line, column, endLine, endColumn, text }) =>
    line === endLine && column === endColumn &&
    ((text === ';' && /^expected ';'/.test(entry.message) && !entry.message.includes("'for'")) ||
     ([')', ']', '}'].includes(text) && entry.message.startsWith("expected '" + text + "'")))
  );
  if (fix) return { ...fix, kind: 'insert' };

  const opening = entry.notes.find(({ file, message }) =>
    file === 'main.cpp' && /^to match this '(?:\{|\(|\[)'/.test(message)
  );
  if (opening) return { ...opening, kind: 'opening', text: opening.message.slice(-2, -1) };

  const previous = entry.notes.find(({ file, message }) =>
    file === 'main.cpp' && /^previous (?:definition|declaration) is here/.test(message)
  );
  if (previous) return { ...previous, kind: 'previous' };
}
