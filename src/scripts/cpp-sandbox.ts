import { createSandbox, displaySandboxValue, parseSandboxInput, readPreparedSandboxInput } from '../lib/cpp-sandbox.mjs';
import { buildSandboxMap } from '../lib/cpp-sandbox-map.mjs';
import { highlightCpp } from '../lib/cpp-source.mjs';
import { createScene, type BitwiseStep, type BoxValue, type Calculation } from './cpp-sandbox-scene';

const root = document.querySelector<HTMLElement>('[data-cpp-sandbox]')!;
const get = <T extends HTMLElement>(id: string) => root.querySelector<T>('#sandbox-' + id)!;
const code = get<HTMLTextAreaElement>('code');
const editor = get('editor');
const highlighted = get('highlight');
const input = get<HTMLTextAreaElement>('input');
const inputPreview = get('input-preview');
const reading = get('reading');
const start = get<HTMLButtonElement>('start');
const edit = get<HTMLButtonElement>('edit');
const back = get<HTMLButtonElement>('back');
const next = get<HTMLButtonElement>('next');
const play = get<HTMLButtonElement>('play');
const speed = get<HTMLSelectElement>('speed');
const boxArea = get('boxes');
const backpack = get('backpack');
const packTabs = get('pack-tabs');
const packPrev = get<HTMLButtonElement>('pack-prev');
const packNext = get<HTMLButtonElement>('pack-next');
const packPage = get('pack-page');
const roadWorld = get('road-world');
const routeMap = get('road-map');
const routeViewport = get('road-viewport');
const playControls = get('play-controls');
const enterMap = get<HTMLButtonElement>('enter-map');
const status = get('status');
const output = get('output');
const debug = get<HTMLAnchorElement>('debug');
const dialog = get<HTMLDialogElement>('dialog');
const token = get<HTMLInputElement>('token');
const boxElements = new Map<string, HTMLElement>();
const scene = createScene(root);

interface Frame {
  range: { start: number; end: number } | null;
  action: string;
  message: string;
  target: string | null;
  output: string;
  boxes: { id: string; name: string; type: string; value: BoxValue }[];
  inputType?: string;
  inputName?: string;
  inputMode?: string;
  inputToken?: string;
  inputPosition?: { row: number; column: number };
  spoken?: string;
  calculation?: Calculation;
  bitwise?: BitwiseStep;
}

interface RouteNode {
  id: string;
  kind: string;
  title: string;
  line: number | null;
  range: { start: number; end: number } | null;
  details: { label?: string; condition?: string; yes?: RouteNode[]; no?: RouteNode[]; hasElse?: boolean; body?: RouteNode[] };
}

let worker: Worker | undefined;
let compileTimer: number | undefined;
let trace: Generator<Frame, void, string | undefined> | undefined;
let frames: Frame[] = [];
let cursor = 0;
let playing = false;
let playTimer: number | undefined;
let animationTime = 0;
let runSource = '';
let runMarkup = '';
let storedLayout = '';
let routeNodes: RouteNode[] = [];
let selectedPackType = 'int';
let selectedPackPage = 0;
const packTypes = ['short', 'int', 'long', 'long long', 'bool', 'char', 'float', 'double', 'string'];

function showPreparedInput(position: Frame['inputPosition'] = { row: 0, column: 0 }, slide = false) {
  const lines = input.value.split('\n');
  const line = lines[position?.row ?? 0];
  const text = line === undefined ? '等候輸入' : line.slice(position?.column ?? 0).trimStart() || '（空白行）';
  const previous = inputPreview.lastElementChild;
  if (text === previous?.textContent && !slide) return;
  const nextLine = document.createElement('span');
  nextLine.textContent = text;
  inputPreview.replaceChildren(nextLine);
  if (slide && previous && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    previous.setAttribute('aria-hidden', 'true');
    inputPreview.prepend(previous);
    previous.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
      { duration: 320, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => previous.remove();
    nextLine.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
      { duration: 320, easing: 'ease-in-out' });
  }
}

function syncEditorScroll() {
  highlighted.style.transform = 'translate(' + -code.scrollLeft + 'px, ' + -code.scrollTop + 'px)';
}

function highlightEditor() {
  const enabled = code.value.length <= 20_000;
  highlighted.innerHTML = enabled ? highlightCpp(code.value) : '';
  editor.classList.toggle('has-highlight', enabled);
  syncEditorScroll();
}

function showCode(range: Frame['range']) {
  const oldTop = reading.scrollTop;
  const oldLeft = reading.scrollLeft;
  reading.innerHTML = runMarkup;
  let mark: HTMLElement | undefined;
  if (range) {
    const walker = document.createTreeWalker(reading, NodeFilter.SHOW_TEXT);
    const selection = document.createRange();
    let startFound = false;
    let offset = 0;
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const end = offset + text.textContent!.length;
      if (!startFound && range.start < end) {
        selection.setStart(text, range.start - offset);
        startFound = true;
      }
      if (startFound && range.end <= end) {
        selection.setEnd(text, range.end - offset);
        mark = document.createElement('mark');
        mark.append(selection.extractContents());
        selection.insertNode(mark);
        break;
      }
      offset = end;
    }
  }
  reading.scrollTop = oldTop;
  reading.scrollLeft = oldLeft;
  if (mark) {
    const area = reading.getBoundingClientRect();
    const active = mark.getClientRects()[0];
    if (active && (active.top < area.top || active.bottom > area.bottom)) {
      reading.scrollTop += active.top - area.top - area.height / 3;
    }
    if (active && (active.left < area.left || active.left >= area.right)) {
      reading.scrollLeft += active.left - area.left - 12;
    }
  }
}

const roadSymbols: Record<string, string> = {
  loop: '↻',
};

function branchConditionText(condition: string | undefined, branch: 'yes' | 'no', hasElse: boolean) {
  const text = condition?.trim();
  if (!text) return branch === 'yes' ? '條件成立' : '其他情況';
  if (branch === 'yes') return text;
  const opposite: Record<string, string> = { '>=': '<', '<=': '>', '==': '!=', '!=': '==', '>': '<=', '<': '>=' };
  const operator = text.match(/>=|<=|==|!=|>|</)?.[0];
  if (operator) return text.replace(operator, opposite[operator]);
  return hasElse ? '不符合 (' + text + ')' : '!(' + text + ')';
}

function makeRoadNode(node: RouteNode): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'road-node' + (node.kind === 'path' ? ' road-path' : '');
  wrapper.dataset.kind = node.kind;
  wrapper.dataset.routeId = node.id;
  if (node.range) {
    wrapper.dataset.rangeStart = String(node.range.start);
    wrapper.dataset.rangeEnd = String(node.range.end);
  }
  const step = document.createElement('div');
  step.className = 'road-step';
  const cell = document.createElement('div');
  cell.className = 'road-cell';
  cell.dataset.kind = node.kind;
  cell.textContent = roadSymbols[node.kind] ?? '';
  cell.setAttribute('aria-label', node.kind === 'path' ? '道路' : node.title);
  step.append(cell);
  wrapper.append(step);

  if (node.kind === 'branch') {
    const fork = document.createElement('div');
    fork.className = 'road-fork';
    for (const [route, entries] of [['yes', node.details.yes ?? []], ['no', node.details.no ?? []]] as const) {
      const lane = document.createElement('div');
      lane.className = 'road-lane';
      lane.dataset.route = route;
      const laneLabel = document.createElement('span');
      laneLabel.className = 'road-lane-label';
      laneLabel.textContent = branchConditionText(node.details.condition, route, Boolean(node.details.hasElse));
      lane.append(laneLabel, makeRoadSequence(entries));
      if (!entries.length) {
        const skipped = document.createElement('div');
        skipped.className = 'road-cell road-skip';
        skipped.setAttribute('aria-label', '此分支直接接回主路');
        lane.append(skipped);
      }
      fork.append(lane);
    }
    wrapper.append(fork);
    const merge = document.createElement('div');
    merge.className = 'road-merge';
    merge.setAttribute('aria-label', '兩條路接回主路');
    wrapper.append(merge);
  } else if (node.kind === 'loop') {
    const loop = document.createElement('div');
    loop.className = 'road-loop';
    const condition = document.createElement('code');
    condition.className = 'road-sign';
    condition.textContent = node.details.condition ? '每次經過都檢查：' + node.details.condition : '沿環道重複前進';
    loop.append(condition, makeRoadSequence(node.details.body ?? []));
    wrapper.append(loop);
  }
  return wrapper;
}

function makeRoadSequence(nodes: RouteNode[]) {
  const sequence = document.createElement('div');
  sequence.className = 'road-sequence';
  simplify(nodes).forEach((node, index) => {
    if (index) {
      const link = document.createElement('div');
      link.className = 'road-link';
      link.setAttribute('aria-hidden', 'true');
      sequence.append(link);
    }
    sequence.append(makeRoadNode(node));
  });
  return sequence;
}

function simplify(nodes: RouteNode[]): RouteNode[] {
  const sequence: RouteNode[] = [];
  let linear: RouteNode[] = [];
  const flush = () => {
    if (!linear.length) return;
    const ranges = linear.flatMap((node) => node.range ? [node.range] : []);
    sequence.push({
      id: 'road-segment-' + linear[0].id,
      kind: 'path', title: '道路', line: linear[0].line,
      range: ranges.length ? { start: Math.min(...ranges.map((range) => range.start)), end: Math.max(...ranges.map((range) => range.end)) } : null,
      details: {},
    });
    linear = [];
  };
  for (const node of nodes) {
    if (node.kind === 'branch' || node.kind === 'loop') {
      flush();
      const details = { ...node.details };
      if (details.yes) details.yes = simplify(details.yes);
      if (details.no) details.no = simplify(details.no);
      if (details.body) details.body = simplify(details.body);
      sequence.push({ ...node, details });
    } else linear.push(node);
  }
  flush();
  return sequence;
}

function makeEndpoint(kind: 'road-start' | 'road-goal', title: string, symbol: string) {
  const endpoint = document.createElement('div');
  endpoint.className = 'road-node ' + kind;
  const step = document.createElement('div');
  step.className = 'road-step';
  const cell = document.createElement('div');
  cell.className = 'road-cell';
  if (kind === 'road-goal') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('class', 'goal-icon');
    svg.setAttribute('aria-hidden', 'true');
    const pole = document.createElementNS(svg.namespaceURI, 'path');
    pole.setAttribute('d', 'M10 42V6');
    pole.setAttribute('stroke', '#68472d');
    pole.setAttribute('stroke-width', '4');
    pole.setAttribute('stroke-linecap', 'round');
    pole.setAttribute('fill', 'none');
    const flag = document.createElementNS(svg.namespaceURI, 'path');
    flag.setAttribute('d', 'M13 8h27L34 17l6 9H13z');
    flag.setAttribute('fill', '#fff8df');
    flag.setAttribute('stroke', '#68472d');
    flag.setAttribute('stroke-width', '2.5');
    flag.setAttribute('stroke-linejoin', 'round');
    const square = (x: number, y: number, fill: string) => {
      const rect = document.createElementNS(svg.namespaceURI, 'rect');
      rect.setAttribute('x', String(x)); rect.setAttribute('y', String(y));
      rect.setAttribute('width', '6'); rect.setAttribute('height', '6'); rect.setAttribute('fill', fill);
      return rect;
    };
    svg.append(pole, flag, square(17, 11, '#73523a'), square(29, 11, '#73523a'), square(23, 17, '#73523a'));
    cell.append(svg);
    cell.setAttribute('aria-label', '終點旗');
  } else {
    cell.textContent = symbol;
  }
  const label = document.createElement('span');
  label.className = 'road-label';
  label.textContent = title;
  step.append(cell, label);
  endpoint.append(step);
  return endpoint;
}

function showRouteMap(nodes: RouteNode[]) {
  const startLink = document.createElement('div');
  startLink.className = 'road-link';
  const finishLink = document.createElement('div');
  finishLink.className = 'road-link';
  routeMap.replaceChildren(
    makeEndpoint('road-start', '出發', '🚩'), startLink,
    makeRoadSequence(nodes), finishLink, makeEndpoint('road-goal', '終點', '🏁'),
  );
}

function followRoute(range: Frame['range'], shouldScroll: boolean, branchChoice?: 'yes' | 'no') {
  routeMap.querySelector('.is-active')?.classList.remove('is-active');
  if (!range) return null;
  const candidates = [...routeMap.querySelectorAll<HTMLElement>('[data-range-start][data-range-end]')]
    .filter((element) => Number(element.dataset.rangeStart) <= range.start && Number(element.dataset.rangeEnd) >= range.start)
    .sort((a, b) => (Number(a.dataset.rangeEnd) - Number(a.dataset.rangeStart)) - (Number(b.dataset.rangeEnd) - Number(b.dataset.rangeStart)));
  const node = candidates[0];
  if (!node) return null;
  node.classList.add('is-active');
  if (node.dataset.kind === 'branch' && branchChoice) {
    node.querySelector<HTMLElement>('.road-lane[data-route="' + branchChoice + '"]')?.classList.add('is-chosen');
  }
  const cell = node.querySelector<HTMLElement>(':scope > .road-step .road-cell');
  if (shouldScroll && cell) {
    const viewport = routeViewport.getBoundingClientRect();
    const active = cell.getBoundingClientRect();
    if (active.top < viewport.top || active.bottom > viewport.bottom) {
      routeViewport.scrollTop += active.top - viewport.top - viewport.height / 2;
    }
  }
  return cell;
}

function updateControls() {
  back.disabled = cursor <= 0;
  next.disabled = !(cursor + 1 < frames.length || trace);
  play.disabled = next.disabled;
  play.textContent = playing ? '暫停' : '播放';
}

function arrangeBoxes(boxes: Frame['boxes'], target?: string | null) {
  const selected = boxes.find(({ id }) => id === target);
  if (selected) {
    selectedPackType = selected.type;
    const typedIndex = boxes.filter(({ type }) => type === selected.type).findIndex(({ id }) => id === selected.id);
    selectedPackPage = Math.floor(typedIndex / 30);
  }
  const availableTypes = packTypes.filter((type) => boxes.some((box) => box.type === type));
  if (!availableTypes.includes(selectedPackType) && availableTypes.length) {
    selectedPackType = availableTypes[0];
    selectedPackPage = 0;
  }
  packTabs.replaceChildren(...packTypes.map((type) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.role = 'tab';
    tab.setAttribute('aria-selected', String(selectedPackType === type));
    tab.textContent = type;
    tab.addEventListener('click', () => {
      selectedPackType = type;
      selectedPackPage = 0;
      arrangeBoxes(boxes);
    });
    return tab;
  }));
  const typedBoxes = boxes.filter(({ type }) => type === selectedPackType);
  const pageCount = Math.max(1, Math.ceil(typedBoxes.length / 30));
  selectedPackPage = Math.min(selectedPackPage, pageCount - 1);
  const visible = typedBoxes.slice(selectedPackPage * 30, (selectedPackPage + 1) * 30)
    .map(({ id }) => boxElements.get(id)!).filter(Boolean);
  const empty = Array.from({ length: 30 - visible.length }, () => {
    const slot = document.createElement('span');
    slot.className = 'empty-slot';
    slot.setAttribute('aria-hidden', 'true');
    return slot;
  });
  boxArea.replaceChildren(...visible, ...empty);
  packPage.textContent = '第 ' + (selectedPackPage + 1) + ' / ' + pageCount + ' 頁';
  packPrev.disabled = selectedPackPage === 0;
  packNext.disabled = selectedPackPage >= pageCount - 1;
}

function render(forward = false) {
  const frame = frames[cursor];
  const prior = frames[cursor - 1];
  const keep = new Set(frame?.boxes.map((box) => box.id));
  for (const [id, element] of boxElements) {
    if (!keep.has(id)) {
      element.remove();
      boxElements.delete(id);
    }
  }
  for (const box of frame?.boxes ?? []) {
    let element = boxElements.get(box.id);
    if (!element) {
      element = document.createElement('div');
      element.className = 'box type-' + box.type;
      element.append(scene.makeCube(box.value, box.type));
      for (const [className, value] of [['box-type', box.type], ['box-name', box.name]]) {
        const text = document.createElement('span');
        text.className = className;
        text.textContent = value;
        element.append(text);
      }
      boxElements.set(box.id, element);
    }
    scene.setCubeValue(element.querySelector('svg')!, box.value, box.type);
    element.title = box.name + ' · ' + displaySandboxValue(box.value, box.type);
    element.classList.toggle('active', frame?.target === box.id);
  }
  arrangeBoxes(frame?.boxes ?? [], frame?.target);
  let spoken = frame?.spoken ?? '';
  if (frame && ['return', 'done'].includes(frame.action)) {
    for (let i = cursor - 1; i >= 0; i--) {
      if (frames[i].spoken !== undefined) {
        spoken = frames[i].spoken!;
        break;
      }
    }
  }
  const position = frame?.inputPosition ?? { row: 0, column: 0 };
  const previousPosition = prior?.inputPosition ?? { row: 0, column: 0 };
  showPreparedInput(position, forward && position.row > previousPosition.row);
  const target = frame?.target;
  const targetBox = frame?.boxes.find((box) => box.id === target);
  const branchChoice = frame?.message.includes('條件不成立') ? 'no'
    : frame?.message.includes('條件成立') ? 'yes' : undefined;
  const activeRoadCell = followRoute(frame?.range ?? null, forward, branchChoice);
  const startRoadCell = routeMap.querySelector<HTMLElement>('.road-start .road-cell');
  const finishRoadCell = routeMap.querySelector<HTMLElement>('.road-goal .road-cell');
  animationTime = scene.draw({
    action: frame?.action,
    destination: activeRoadCell ?? (frame?.action === 'ready' ? startRoadCell ?? undefined
      : frame?.action === 'done' ? finishRoadCell ?? undefined : undefined),
    box: target ? boxElements.get(target) : undefined,
    before: prior?.boxes.find((box) => box.id === target)?.value,
    value: targetBox?.value,
    type: targetBox?.type,
    inputToken: frame?.inputToken,
    spoken,
    calculation: frame?.calculation,
    bitwise: frame?.bitwise,
  }, forward, Number(speed.value));
  output.textContent = frame?.output ?? '';
  get('step').textContent = '第 ' + cursor + ' 步';
  if (frame) status.textContent = frame.message;

  if (!reading.hidden) showCode(frame?.range ?? null);
  updateControls();
}

function pause() {
  playing = false;
  window.clearTimeout(playTimer);
  updateControls();
}

function needsInput() {
  const frame = frames[cursor];
  return frame?.action === 'input' && cursor === frames.length - 1
    && !readPreparedSandboxInput(input.value, frame.inputMode ?? 'formatted-token', frame.inputPosition) && trace;
}

function askForInput() {
  pause();
  const frame = frames[cursor];
  const type = frame.inputType;
  const floating = type === 'float' || type === 'double';
  const label = frame.inputMode === 'line' ? '一整行文字（保留空格）'
    : frame.inputMode === 'raw-char' ? '一個字元（包含空白）'
    : type === 'string' ? '一個字串（讀取到空白為止）'
    : type === 'short' ? '一筆 short 範圍內的整數'
    : type === 'long' ? '一筆 long 範圍內的整數'
    : type === 'long long' ? '一筆 long long 範圍內的整數'
    : type === 'char' ? '一個可見 ASCII 字元'
    : type === 'bool' ? ' 0 或 1' : floating ? '一筆浮點數（例如 3.5 或 1e-3）' : ' int 範圍內的一筆整數';
  get('prompt').textContent = '給 ' + frame.inputName + ' 輸入' + label;
  get('input-error').textContent = '請輸入' + label + '。';
  get('input-error').hidden = true;
  token.value = '';
  token.inputMode = type === 'char' || type === 'string' ? 'text' : floating ? 'decimal' : 'numeric';
  if (!dialog.open) dialog.showModal();
  token.focus();
}

function forward(supplied?: string) {
  if (cursor + 1 < frames.length) {
    cursor++;
    render(true);
    return;
  }
  if (!trace) return;
  if (supplied === undefined && needsInput()) {
    askForInput();
    return;
  }
  try {
    const current = frames[cursor];
    const position = current?.inputPosition ?? { row: 0, column: 0 };
    const prepared = supplied === undefined && current?.action === 'input'
      ? readPreparedSandboxInput(input.value, current.inputMode ?? 'formatted-token', position) : undefined;
    const value = prepared?.value;
    const step = trace.next(supplied ?? value);
    if (step.done) {
      trace = undefined;
      pause();
      return;
    }
    frames.push({
      ...step.value,
      inputPosition: prepared?.position ?? position,
    });
    cursor++;
    if (step.value.action === 'done') {
      trace = undefined;
      pause();
    }
    render(true);
    if (needsInput()) askForInput();
  } catch (error) {
    trace = undefined;
    pause();
    status.textContent = error instanceof Error ? error.message : String(error);
  }
}

function tick() {
  if (!playing) return;
  forward();
  if (next.disabled) pause();
  else if (playing) playTimer = window.setTimeout(tick, Math.max(Number(speed.value), animationTime + 50));
}

function restoreEditor() {
  pause();
  scene.reset();
  if (dialog.open) dialog.close();
  trace = undefined;
  frames = [];
  cursor = 0;
  editor.hidden = false;
  code.readOnly = false;
  input.readOnly = false;
  reading.hidden = true;
  edit.hidden = true;
  debug.hidden = true;
  roadWorld.hidden = true;
  enterMap.hidden = true;
  playControls.hidden = true;
  start.hidden = false;
  enterMap.disabled = false;
  enterMap.textContent = '開始冒險';
  routeNodes = [];
  showPreparedInput({ row: 0, column: 0 }, false);
  render();
}

function completeCheck() {
  window.clearTimeout(compileTimer);
  start.disabled = false;
}

function failCheck(message: string, canDebug = false) {
  completeCheck();
  restoreEditor();
  status.textContent = message;
  debug.hidden = !canDebug;
}

start.addEventListener('click', () => {
  restoreEditor();
  runSource = code.value;
  if (!runSource.trim() || runSource.length > 20_000) {
    status.textContent = '請貼上 2 萬字元以內的 C++ 程式。';
    return;
  }
  start.disabled = true;
  code.readOnly = true;
  input.readOnly = true;
  status.textContent = '正在準備編譯器…';
  try {
    worker ??= new Worker(root.dataset.worker!);
    worker.onerror = () => {
      worker?.terminate();
      worker = undefined;
      failCheck('編譯工具載入失敗，請再試一次。');
    };
    worker.onmessage = ({ data }) => {
      if (data.type === 'phase') {
        status.textContent = data.phase === 'trace' ? '正在讀取程式的執行結構…' : '正在檢查程式…';
      } else if (data.type === 'result') {
        failCheck('程式有編譯或連結錯誤。請用 Debug 工具查看位置與提示。', true);
      } else if (data.type === 'error') {
        failCheck(data.message);
      } else if (data.type === 'trace') {
        completeCheck();
        try {
          trace = createSandbox(data.ast, runSource);
          routeNodes = buildSandboxMap(data.ast, runSource) as RouteNode[];
          showRouteMap(routeNodes);
          frames = [{ range: null, action: 'ready', message: '冒險地圖已經鋪好，按「開始冒險」讓倉鼠出發。', target: null, output: '', boxes: [], inputPosition: { row: 0, column: 0 } }];
          runMarkup = highlightCpp(runSource);
          editor.hidden = true;
          reading.hidden = false;
          edit.hidden = false;
          start.hidden = true;
          roadWorld.hidden = false;
          enterMap.hidden = false;
          playControls.hidden = true;
          render();
        } catch (error) {
          failCheck(error instanceof Error ? error.message : String(error));
        }
      }
    };
    compileTimer = window.setTimeout(() => {
      worker?.terminate();
      worker = undefined;
      failCheck('檢查逾時，請用較短的程式再試。');
    }, 120_000);
    worker.postMessage({ type: 'trace', source: runSource });
  } catch {
    failCheck('無法啟動編譯工具，請重新整理後再試。');
  }
});

edit.addEventListener('click', () => {
  restoreEditor();
  status.textContent = '修改程式後，再按「模擬」。';
  code.focus();
});
enterMap.addEventListener('click', () => {
  playControls.hidden = false;
  enterMap.hidden = true;
  enterMap.disabled = true;
  status.textContent = '倉鼠出發了，正在莓果田探索。';
  forward();
});
next.addEventListener('click', () => { pause(); forward(); });
back.addEventListener('click', () => { pause(); cursor--; render(); });
packPrev.addEventListener('click', () => {
  selectedPackPage = Math.max(0, selectedPackPage - 1);
  arrangeBoxes(frames[cursor]?.boxes ?? []);
});
packNext.addEventListener('click', () => {
  selectedPackPage++;
  arrangeBoxes(frames[cursor]?.boxes ?? []);
});
play.addEventListener('click', () => {
  if (playing) pause();
  else {
    playing = true;
    updateControls();
    tick();
  }
});
get('cancel-input').addEventListener('click', () => dialog.close());
get<HTMLFormElement>('input-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const frame = frames[cursor];
  const value = frame?.inputMode === 'raw-char' ? token.value : frame?.inputMode === 'line' ? token.value : token.value.trim();
  const valid = frame?.inputMode === 'raw-char'
    ? [...value].length === 1 && value.codePointAt(0)! <= 127
    : frame?.inputMode === 'line' ? true : parseSandboxInput(frame?.inputType ?? '', value) !== undefined;
  if (!valid) {
    get('input-error').hidden = false;
    return;
  }
  dialog.close();
  forward(value);
});
debug.addEventListener('click', () => {
  try {
    sessionStorage.setItem('academy-cpp-sandbox-source', runSource);
  } catch {
    // Navigation still works when storage is disabled.
  }
});
code.addEventListener('input', highlightEditor);
code.addEventListener('scroll', syncEditorScroll);
input.addEventListener('input', () => {
  showPreparedInput({ row: 0, column: 0 }, false);
});
showPreparedInput({ row: 0, column: 0 }, false);
highlightEditor();
