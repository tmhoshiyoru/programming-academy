import Prism from 'prismjs';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';

export function highlightCpp(source) {
  return Prism.highlight(source, Prism.languages.cpp, 'cpp');
}

function maskNonCode(source) {
  const ignored = new Set(['comment', 'string', 'raw-string', 'char', 'macro']);
  let offset = 0;
  return Prism.tokenize(source, Prism.languages.cpp).map((token) => {
    const text = source.slice(offset, offset + token.length);
    offset += token.length;
    return ignored.has(token.type) ? text.replace(/[^\n]/g, ' ') : text;
  }).join('');
}

export function findMissingIncludeHashes(source, diagnosticLines) {
  if (diagnosticLines.size === 0) return [];
  const codeLines = maskNonCode(source).split('\n');
  const lines = source.split('\n');
  const suggestions = [];
  for (const line of diagnosticLines) {
    const index = line - 1;
    if (!/^[ \t]*include\b/.test(codeLines[index] ?? '')) continue;
    const match = /^[ \t]*include[ \t]*(<[^<>\r\n]+>|"[^"\r\n]+")[ \t]*(?=$|\/\/|\/\*)/.exec(lines[index]);
    if (match) suggestions.push({ line, corrected: '#include ' + match[1] });
  }
  return suggestions.sort((a, b) => a.line - b.line);
}

export function findForSeparatorMistakes(source, diagnosticLines) {
  if (diagnosticLines.size === 0) return [];
  const code = maskNonCode(source);

  const suggestions = [];
  const lineStarts = [0];
  for (const newline of code.matchAll(/\n/g)) lineStarts.push(newline.index + 1);
  let lineIndex = 0;
  for (const header of code.matchAll(/(?<![\p{ID_Continue}])for\s*\(/gu)) {
    while (lineStarts[lineIndex + 1] <= header.index) lineIndex++;
    const start = header.index + header[0].length;
    let depth = 0;
    let end = start;
    const separators = [];
    for (; end < code.length; end++) {
      const token = code[end];
      if (token === ')' && depth === 0) break;
      if (depth === 0 && (token === ';' || token === ',')) separators.push(end);
      if ('([{'.includes(token)) depth++;
      if (')]}'.includes(token)) depth--;
      if (depth < 0) break;
    }
    if (code[end] !== ')' || separators.length !== 2) continue;
    const commas = separators.filter((index) => code[index] === ',');
    if (commas.length === 0) continue;
    // A second declaration such as "j = 0" may be a legitimate part of the initializer.
    const middle = code.slice(separators[0] + 1, separators[1]);
    if (!middle.trim() || /(?<![=!<>])=(?!=)/.test(middle)) continue;
    const related = [...diagnosticLines].some((line) =>
      line > lineIndex && lineStarts[line - 1] <= end);
    if (!related) continue;

    let corrected = source.slice(header.index, end + 1);
    for (const comma of commas) {
      const index = comma - header.index;
      corrected = corrected.slice(0, index) + ';' + corrected.slice(index + 1);
    }
    suggestions.push({ line: lineIndex + 1, corrected });
  }
  return suggestions;
}
