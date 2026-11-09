import { highlightCpp } from '../lib/cpp-source.mjs';

const source = document.querySelector<HTMLTextAreaElement>('#indent-source')!;
const editor = document.querySelector<HTMLElement>('#indent-editor')!;
const highlight = document.querySelector<HTMLPreElement>('#indent-highlight')!;
const lineNumbers = document.querySelector<HTMLPreElement>('#indent-line-numbers')!;
const run = document.querySelector<HTMLButtonElement>('#indent-run')!;
const stop = document.querySelector<HTMLButtonElement>('#indent-stop')!;
const example = document.querySelector<HTMLButtonElement>('#indent-example')!;
const status = document.querySelector<HTMLElement>('#indent-status')!;
const output = document.querySelector<HTMLElement>('#indent-output')!;
const outputLines = document.querySelector<HTMLPreElement>('#indent-output-lines')!;
const outputCode = document.querySelector<HTMLElement>('#indent-output-code')!;
const copy = document.querySelector<HTMLButtonElement>('#indent-copy')!;
const errors = document.querySelector<HTMLDetailsElement>('#indent-errors')!;
const errorLog = document.querySelector<HTMLElement>('#indent-error-log')!;
const workerUrl = editor.closest<HTMLElement>('[data-worker]')!.dataset.worker!;

let worker: Worker | undefined;
let timeout: number | undefined;
let formatted = '';

function syncScroll() {
  highlight.style.transform = `translate(${-source.scrollLeft}px, ${-source.scrollTop}px)`;
  lineNumbers.style.transform = `translateY(${-source.scrollTop}px)`;
}

function updateEditor() {
  const count = source.value.split('\n').length;
  const enabled = source.value.length <= 100_000;
  if (enabled) highlight.innerHTML = highlightCpp(source.value);
  else highlight.replaceChildren();
  editor.classList.toggle('is-highlighted', enabled);
  lineNumbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join('\n');
  editor.style.setProperty('--gutter-width', `${1.8 + String(count).length * 0.6}rem`);
  syncScroll();
}

function clearOutput() {
  output.hidden = true;
  copy.hidden = true;
  errors.hidden = true;
  errors.open = false;
  errorLog.textContent = '';
  outputCode.textContent = '';
  outputLines.textContent = '';
  formatted = '';
}

function setBusy(busy: boolean) {
  source.readOnly = busy;
  run.disabled = busy;
  example.disabled = busy;
  stop.hidden = !busy;
  if (!busy) window.clearTimeout(timeout);
}

function finish(message: string) {
  worker?.terminate();
  worker = undefined;
  setBusy(false);
  status.textContent = message;
}

/** Formats block indentation while ignoring braces inside comments and literals. */
function formatCpp(input: string): string {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const result: string[] = [];
  let depth = 0;
  let inBlockComment = false;
  let quote: '"' | "'" | undefined;
  let escaped = false;
  let rawEnd = '';

  for (const original of lines) {
    const line = original.trim();
    if (!line) {
      result.push('');
      continue;
    }
    if (/^#/.test(line) && !inBlockComment && !quote && !rawEnd) {
      result.push(line);
    } else {
      const leadingClosers = /^\}+/u.exec(line)?.[0].length ?? 0;
      const isLabel = /^(?:case\b.*|default)\s*:/u.test(line);
      const indent = Math.max(0, depth - leadingClosers - (isLabel ? 1 : 0));
      result.push(`${'    '.repeat(indent)}${line}`);
    }

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (rawEnd) {
        if (line.startsWith(rawEnd, i)) {
          i += rawEnd.length - 1;
          rawEnd = '';
        }
        continue;
      }
      if (inBlockComment) {
        if (ch === '*' && next === '/') { inBlockComment = false; i++; }
        continue;
      }
      if (quote) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === quote) quote = undefined;
        continue;
      }
      if (ch === '/' && next === '/') break;
      if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
      if (ch === 'R' && next === '"') {
        const open = line.indexOf('(', i + 2);
        if (open !== -1 && open - (i + 2) <= 16) {
          rawEnd = `)${line.slice(i + 2, open)}"`;
          i = open;
          continue;
        }
      }
      if (ch === '"' || ch === "'") { quote = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') depth = Math.max(0, depth - 1);
    }
  }
  return result.join('\n');
}

run.addEventListener('click', () => {
  clearOutput();
  if (!source.value.trim()) {
    status.textContent = '請先貼上 C++ 程式碼。';
    source.focus();
    return;
  }
  if (source.value.length > 100_000) {
    status.textContent = '這份程式太長，請縮到 10 萬字元以內再整理。';
    return;
  }
  setBusy(true);
  status.textContent = '正在檢查 C++ 語法…';
  try {
    worker ??= new Worker(workerUrl);
    worker.onerror = () => finish('編譯工具載入失敗，請重新整理後再試。');
    worker.onmessage = ({ data }) => {
      if (data.type === 'phase') {
        status.textContent = data.phase === 'compile' ? '正在檢查 C++ 語法…' : '正在整理程式…';
        return;
      }
      if (data.type === 'error') {
        finish('檢查工具遇到問題，請重新整理後再試。');
        errorLog.textContent = data.message;
        errors.hidden = false;
        return;
      }
      setBusy(false);
      if (!data.ok) {
        status.textContent = data.phase === 'compile'
          ? '程式有語法錯誤，請先檢查程式碼，再重新整理縮排。'
          : '語法檢查沒有完成，請確認程式內容後再試一次。';
        errorLog.textContent = data.log || '編譯器沒有提供詳細訊息。';
        errors.hidden = false;
        return;
      }
      formatted = formatCpp(source.value);
      outputLines.textContent = Array.from({ length: formatted.split('\n').length }, (_, i) => i + 1).join('\n');
      outputCode.innerHTML = highlightCpp(formatted);
      output.hidden = false;
      copy.hidden = false;
      status.textContent = data.log.trim()
        ? '語法檢查通過，已整理縮排。另有編譯器提醒可參考下方訊息。'
        : '語法檢查通過，已整理縮排。';
      if (data.log.trim()) {
        errorLog.textContent = data.log.trim();
        errors.hidden = false;
      }
    };
    timeout = window.setTimeout(() => finish('檢查逾時，請確認網路或縮短程式後再試。'), 120_000);
    worker.postMessage({ type: 'syntax', source: source.value });
  } catch {
    finish('無法啟動編譯工具，請重新整理後再試。');
  }
});

stop.addEventListener('click', () => finish('已停止檢查。'));
source.addEventListener('input', () => {
  clearOutput();
  updateEditor();
  status.textContent = '貼上程式碼後，按「檢查語法並整理縮排」。';
});
source.addEventListener('scroll', syncScroll);
example.addEventListener('click', () => {
  source.value = source.defaultValue;
  clearOutput();
  updateEditor();
  status.textContent = '已載入範例。';
  source.focus();
});
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(formatted);
    copy.textContent = '已複製';
    window.setTimeout(() => { copy.textContent = '複製'; }, 1400);
  } catch {
    status.textContent = '無法直接複製，請選取整理結果後手動複製。';
  }
});

updateEditor();
