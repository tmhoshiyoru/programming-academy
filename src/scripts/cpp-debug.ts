import { findForSeparatorMistakes, findMissingIncludeHashes, highlightCpp } from '../lib/cpp-source.mjs';
import { findEarlierClue, findSymbolMistake, parseCppDiagnostics, sourceColumn } from '../lib/cpp-diagnostics.mjs';

const source = document.querySelector<HTMLTextAreaElement>('#cpp-source')!;
const highlight = document.querySelector<HTMLPreElement>('#cpp-highlight')!;
const lineNumbers = document.querySelector<HTMLPreElement>('#cpp-line-numbers')!;
const editor = source.closest<HTMLElement>('.cpp-editor')!;
const check = document.querySelector<HTMLButtonElement>('#cpp-check')!;
const stop = document.querySelector<HTMLButtonElement>('#cpp-stop')!;
const example = document.querySelector<HTMLButtonElement>('#cpp-example')!;
const status = document.querySelector<HTMLElement>('#cpp-status')!;
const diagnostics = document.querySelector<HTMLOListElement>('#cpp-diagnostics')!;
const raw = document.querySelector<HTMLDetailsElement>('#cpp-raw')!;
const log = document.querySelector<HTMLElement>('#cpp-log')!;
const workerUrl = source.closest<HTMLElement>('[data-worker]')!.dataset.worker!;

const hints: [RegExp, string][] = [
  [/expected ';'/i, '檢查這一行或上一行的指令結尾，看看是否少了半形分號。'],
  [/missing terminating.*character/i, '檢查這行的引號是否成對。字串用一對半形雙引號，單一字元用一對半形單引號。'],
  [/unterminated.*comment/i, '這段註解用 /* 開始，請用 */ 結束。'],
  [/function definition is not allowed here/i, '這裡像是在另一個函式裡寫了函式。先往上檢查前一個函式是否已用 } 結束。'],
  [/undeclared identifier '(?:cin|cout|endl)'/i, '先確認檔案開頭有 #include <iostream>，並在 main 函式前寫上 using namespace std;。'],
  [/undeclared identifier/i, '這個名稱在這裡找不到。確認拼法、大小寫，並檢查是否已在使用前宣告。'],
  [/redefinition of/i, '這個名稱已經定義過。檢查同一個區塊裡是否重複宣告了它。'],
  [/file not found/i, '找不到這個標頭檔。請檢查 #include 的拼法，或確認它是這個工具提供的標準標頭檔。'],
  [/expected ['"][})\]]['"]/i, '檢查括號是否成對，從這一行往前找還沒關閉的括號。'],
  [/expected expression/i, '這個位置需要一個值或運算式。看看等號、運算子或括號旁邊是否少了一段。'],
  [/no matching function/i, '找不到符合這次呼叫的函式。對照函式宣告，檢查傳入的資料個數和型態。'],
  [/excess elements in array initializer/i, '陣列大小比大括號裡的資料筆數少。對照中括號裡的大小和實際填入的筆數。'],
  [/array index .* (?:past the end|before the beginning)/i, '陣列索引從 0 開始。如果陣列有 n 格，最後一格的索引是 n - 1。'],
  [/case value is not a constant expression/i, "case 後面要放編譯時就能確定的值，例如整數 1 或字元 'A'。"],
  [/case statement not in switch statement|default statement not in switch statement/i, 'case 和 default 要放在 switch 的大括號內。先往上看看 switch 的區塊是否提前結束。'],
  [/break statement not in loop or switch|continue statement not in loop/i, '檢查這行是否仍在迴圈的大括號內。break 也可以放在 switch 裡。'],
  [/incompatible|cannot (?:initialize|convert)|invalid operands/i, '這裡使用的資料型態和指令需要的型態不合。先看看參與運算或指定的資料各是什麼型態。'],
  [/assignment as a condition|assignment used as a condition|assignment within a condition/i, '這個條件裡的 = 會改變變數。要比較兩個值是否相等時，請用 ==。'],
  [/unused variable/i, '這個變數有宣告，但目前沒有用到。'],
  [/undefined symbol:.*\b(?:main|__main_argc_argv)\b/i, '找不到程式入口。確認有寫完整的 int main()，而且 main 的拼法正確。'],
  [/undefined symbol/i, '找到了宣告，但組合程式時找不到實作。檢查函式是否有寫出內容，宣告和定義的參數型態是否一致。'],
];

let worker: Worker | undefined;
let timeout: number | undefined;

function syncEditorScroll() {
  highlight.style.transform = `translate(${-source.scrollLeft}px, ${-source.scrollTop}px)`;
  lineNumbers.style.transform = `translateY(${-source.scrollTop}px)`;
}

function updateEditor() {
  const enabled = source.value.length <= 100_000;
  if (enabled) highlight.innerHTML = highlightCpp(source.value);
  else highlight.replaceChildren();
  editor.classList.toggle('is-highlighted', enabled);
  const count = source.value.split('\n').length;
  lineNumbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
  editor.style.setProperty('--cpp-gutter-width', `${1.6 + String(count).length * 0.6}rem`);
  syncEditorScroll();
}

function clearResult() {
  diagnostics.replaceChildren();
  diagnostics.hidden = true;
  raw.hidden = true;
  raw.open = false;
  log.textContent = '';
}

function setBusy(busy: boolean) {
  source.readOnly = busy;
  check.disabled = busy;
  example.disabled = busy;
  stop.hidden = !busy;
  if (!busy) window.clearTimeout(timeout);
}

function resetWorker(message: string) {
  worker?.terminate();
  worker = undefined;
  setBusy(false);
  status.textContent = message;
}

function renderDiagnostics(output: string) {
  const lines = source.value.split('\n');
  const entries = parseCppDiagnostics(output).map((entry) => ({
    ...entry,
    symbol: findSymbolMistake(entry, lines),
    clue: findEarlierClue(entry),
    missingQuote: /missing terminating.*character/i.test(entry.message),
  }));
  const priority = (entry: typeof entries[number]) => {
    if (entry.missingQuote || (entry.symbol && entry.severity !== 'warning')) return 0;
    return entry.severity === 'warning' ? 2 : 1;
  };
  entries.sort((a, b) => priority(a) - priority(b));

  const offsets = [0];
  for (const text of lines) offsets.push(offsets[offsets.length - 1] + text.length + 1);
  function lineButton(line: number, column?: number, length = 0, label = '') {
    const jump = document.createElement('button');
    jump.type = 'button';
    jump.textContent = `${label}第 ${line} 行`;
    jump.addEventListener('click', () => {
      const text = lines[line - 1];
      const start = offsets[line - 1] + (column === undefined ? 0 : sourceColumn(text, column));
      source.focus();
      source.setSelectionRange(start, start + (column === undefined ? text.length : length));
    });
    return jump;
  }

  const sourceErrors = new Set(entries.filter(({ file, severity }) =>
    file === 'main.cpp' && severity !== 'warning'
  ).map(({ line }) => line));
  const includeHints = findMissingIncludeHashes(source.value, sourceErrors);
  for (const suggestion of includeHints) {
    const item = document.createElement('li');
    item.append(lineButton(suggestion.line), '這行的 include 前面少了半形「#」。請把它寫成 #include，編譯器才會讀入標頭檔。');
    const corrected = document.createElement('samp');
    corrected.textContent = suggestion.corrected;
    item.append(corrected);
    diagnostics.append(item);
  }
  const separatorErrors = new Set(entries.filter(({ file, message }) =>
    file === 'main.cpp' && /expected ';' in 'for' statement specifier/.test(message)
  ).map(({ line }) => line));
  for (const suggestion of findForSeparatorMistakes(source.value, separatorErrors)) {
    const item = document.createElement('li');
    item.append(lineButton(suggestion.line), '可能把逗號當成分號了。for 的小括號裡，用兩個半形分號分開「起始設定」、「繼續條件」和「每圈結束後的動作」。可以先試試這個寫法。');
    const corrected = document.createElement('samp');
    corrected.textContent = suggestion.corrected;
    item.append(corrected);
    diagnostics.append(item);
  }

  for (const entry of entries) {
    if (entry.file === 'main.cpp' && entry.severity !== 'warning' &&
      includeHints.some(({ line }) => line === entry.line)) continue;
    if (!entry.symbol && entries.some((candidate) =>
      candidate.symbol && candidate.file === entry.file &&
      candidate.line === entry.line && candidate.column === entry.column
    )) continue;
    const item = document.createElement('li');
    const kind = entry.severity === 'warning' ? '警告' : '錯誤';
    if (entry.file === 'main.cpp' && entry.line > 0 && entry.line <= lines.length) {
      item.append(entry.symbol
        ? lineButton(entry.line, entry.column, entry.symbol.length)
        : lineButton(entry.line, undefined, 0, entry.clue ? '報在' : ''));
    } else if (entry.file) {
      item.append(`${entry.file}:${entry.line}:${entry.column}　`);
    }
    let hint = hints.find(([pattern]) => pattern.test(entry.message))?.[1];
    if (entry.symbol) {
      const { symbol, replacement, fullwidth } = entry.symbol;
      const name = replacement === ' ' ? '空格' : `「${symbol}」`;
      const target = replacement === ' ' ? '一般半形空格' : `半形「${replacement}」`;
      hint = `這裡用了${fullwidth ? '全形' : '特殊'}${name}，請改成${target}。`;
    }
    item.append(`${kind}。${hint ?? '請從標示的位置和下方的原始訊息開始檢查。'}`);
    const clue = entry.symbol ? undefined : entry.clue;
    if (clue && clue.line > 0 && clue.line <= lines.length) {
      const detail = document.createElement('small');
      detail.append(lineButton(clue.line, clue.column, clue.kind === 'insert' ? 0 : 1, '先看'));
      if (clue.kind === 'insert') {
        detail.append(`編譯器建議在游標所指的位置補上半形「${clue.text}」。`);
      } else if (clue.kind === 'opening') {
        detail.append(`這裡的「${clue.text}」需要對應的右括號。`);
      } else {
        detail.append('這裡已有同名的宣告或定義，可以和報錯處對照。');
      }
      item.append(detail);
    }
    const original = document.createElement('small');
    original.textContent = entry.message;
    item.append(original);
    diagnostics.append(item);
  }
  diagnostics.hidden = entries.length === 0;
  return entries.length;
}

check.addEventListener('click', () => {
  clearResult();
  if (!source.value.trim()) {
    status.textContent = '請先貼上 C++ 程式碼。';
    source.focus();
    return;
  }
  if (source.value.length > 100_000) {
    status.textContent = '這份程式太長，請縮到 10 萬字元以內再檢查。';
    return;
  }
  setBusy(true);
  status.textContent = '正在準備編譯器…';
  try {
    worker ??= new Worker(workerUrl);
    worker.onerror = () => resetWorker('編譯工具載入失敗，請再試一次。');
    worker.onmessage = ({ data }) => {
      if (data.type === 'phase') {
        status.textContent = data.phase === 'link' ? '正在組合程式…' : '正在檢查 C++ 程式…';
        return;
      }
      if (data.type === 'error') {
        resetWorker('檢查工具遇到問題，請再試一次。');
        log.textContent = data.message;
        raw.hidden = false;
        return;
      }
      setBusy(false);
      log.textContent = data.log.trim();
      raw.hidden = !log.textContent;
      const count = renderDiagnostics(data.log);
      if (data.ok) {
        status.textContent = count ? '編譯與連結成功，下面有幾項警告可參考。' : '編譯與連結成功。';
      } else {
        status.textContent = data.phase === 'link'
          ? '編譯通過，但組合程式時遇到錯誤。'
          : '編譯失敗。可以先修正第一項提示再檢查一次，後續錯誤有時會一起消失。';
      }
    };
    timeout = window.setTimeout(() => resetWorker('檢查逾時。請確認網路，或試著縮小程式再檢查。'), 120_000);
    worker.postMessage(source.value);
  } catch {
    resetWorker('無法啟動編譯工具，請重新整理後再試。');
  }
});

stop.addEventListener('click', () => {
  resetWorker('已停止檢查。');
  check.focus();
});
source.addEventListener('input', () => {
  updateEditor();
  clearResult();
  status.textContent = '按「檢查程式」查看這份程式的結果。';
});
example.addEventListener('click', () => {
  source.value = source.defaultValue;
  updateEditor();
  clearResult();
  status.textContent = '已載入範例。按「檢查程式」找找看錯誤。';
  source.focus();
});
source.addEventListener('scroll', syncEditorScroll);
try {
  const fromSandbox = sessionStorage.getItem('academy-cpp-sandbox-source');
  if (fromSandbox !== null) {
    source.value = fromSandbox;
    sessionStorage.removeItem('academy-cpp-sandbox-source');
  }
} catch {
  // The debugger remains usable when storage is disabled.
}
updateEditor();
