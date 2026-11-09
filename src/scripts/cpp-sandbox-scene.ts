export type BoxValue = number | bigint | boolean | string | null;
export type Calculation = { expression: string; result: string };
export type BitwiseStep = {
  operator: string;
  left: string;
  right: string | null;
  leftBits: string;
  rightBits: string | null;
  result: string;
  resultBits: string;
  width: number;
};
type Point = { x: number; y: number };
type SceneStep = {
  action?: string;
  box?: HTMLElement;
  value?: BoxValue;
  before?: BoxValue;
  type?: string;
  inputToken?: string;
  destination?: HTMLElement;
  spoken: string;
  calculation?: Calculation;
  bitwise?: BitwiseStep;
};

export function createScene(root: HTMLElement) {
  const get = <T extends Element>(id: string) => root.querySelector<T>('#sandbox-' + id)!;
  const field = get<HTMLElement>('field');
  const backpack = get<HTMLElement>('backpack');
  const explorer = get<HTMLElement>('explorer');
  const sprite = explorer.querySelector<SVGSVGElement>('svg')!;
  const belt = get<HTMLElement>('belt');
  const spur = get<HTMLElement>('belt-spur');
  const door = get<HTMLElement>('door');
  const cargo = get<HTMLElement>('cargo');
  const parcel = get<HTMLElement>('parcel');
  const bubble = get<HTMLElement>('bubble');
  const thought = get<HTMLElement>('thought');
  const expression = get<HTMLElement>('thought-expression');
  const result = get<HTMLElement>('thought-result');
  const bitwork = get<HTMLElement>('bitwork');
  const cube = get<HTMLTemplateElement>('cube');
  const balloon = get<HTMLTemplateElement>('balloon');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations: Animation[] = [];
  let explorerDestination: HTMLElement | null = null;

  function atElement(element: Element) {
    const area = field.getBoundingClientRect();
    const { left, top, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2 - area.left - field.clientLeft,
      y: top + height / 2 - area.top - field.clientTop,
    };
  }

  function dock() {
    const point = atElement(door);
    return { x: point.x, y: point.y + 83 };
  }

  function translate({ x, y }: Point) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  }

  function animate(element: Element, keyframes: Keyframe[], duration: number) {
    const animation = element.animate(keyframes, { duration, easing: 'linear' });
    animations.push(animation);
    return animation;
  }

  function setCubeValue(element: Element, value: BoxValue, type: string) {
    const exact = displaySandboxValue(value, type);
    const compactInteger = (integer: bigint) => {
      const sign = integer < 0n ? '-' : '';
      const digits = (integer < 0n ? -integer : integer).toString();
      return sign + digits[0] + '.' + (digits.slice(1, 3) || '0').padEnd(2, '0') + 'e+' + (digits.length - 1);
    };
    const text = value === null ? '—' : typeof value === 'bigint' && exact.length > 6
      ? compactInteger(value)
      : typeof value === 'string' && exact.length > 8
      ? exact.slice(0, 7) + '…'
      : type !== 'char' && typeof value === 'number' && Number.isFinite(value) && exact.length > 6
        ? (Math.abs(value) >= 100_000 || (Math.abs(value) < .001 && value !== 0)
          ? value.toExponential(2).replace(/(?:\.0+|(\.\d*?)0+)e/, '$1e')
          : String(Number(value.toPrecision(5))))
        : exact;
    const label = element.querySelector<SVGTextElement>('.cube-value')!;
    label.textContent = text;
    label.style.fontSize = text.length > 6 ? '8px' : '11px';
    element.setAttribute('aria-label', exact);
    element.setAttribute('role', 'img');
    let title = element.querySelector('title');
    if (!title) {
      title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      element.prepend(title);
    }
    title.textContent = exact;
  }

  function makeCube(value: BoxValue, type: string) {
    const element = cube.content.firstElementChild!.cloneNode(true) as SVGSVGElement;
    setCubeValue(element, value, type);
    return element;
  }

  function prepareCargo(content: Node, type: string) {
    cargo.className = 'cargo type-' + type;
    cargo.replaceChildren(content);
    cargo.hidden = false;
  }

  function drawBits(id: string, bits: string) {
    const row = get<HTMLElement>(id);
    row.replaceChildren(...bits.replaceAll(' ', '').split('').map((bit) => {
      const cell = document.createElement('span');
      cell.className = 'bit-cell';
      cell.dataset.bit = bit;
      cell.textContent = bit;
      return cell;
    }));
  }

  function showBitwise(step?: BitwiseStep) {
    bitwork.hidden = !step;
    if (!step) return;
    get<HTMLElement>('bit-title').textContent = step.operator === '~'
      ? 'NOT：逐格反轉 ' + step.width + ' 個位元'
      : step.operator === '<<' || step.operator === '>>'
        ? '位移：' + step.operator + ' ' + step.width + ' 個位元'
        : '逐格執行「' + step.operator + '」運算（' + step.width + ' 位）';
    get<HTMLElement>('bit-left-label').textContent = 'A = ' + step.left;
    drawBits('bit-left', step.leftBits);
    const rightRow = get<HTMLElement>('bit-right-row');
    rightRow.hidden = step.rightBits === null;
    if (step.right !== null && step.rightBits !== null) {
      get<HTMLElement>('bit-right-label').textContent = step.operator === '<<' || step.operator === '>>'
        ? '位移格數 = ' + step.right : 'B = ' + step.right;
      drawBits('bit-right', step.rightBits);
    }
    get<HTMLElement>('bit-result-label').textContent = '結果 = ' + step.result;
    drawBits('bit-result', step.resultBits);
    get<HTMLElement>('bit-decimal').textContent = step.operator === '~'
      ? '每個 0 變成 1，每個 1 變成 0。'
      : step.operator === '&' ? '兩格都是 1，結果才是 1。'
        : step.operator === '|' ? '兩格至少有一個 1，結果就是 1。'
          : step.operator === '^' ? '兩格不同，結果是 1；相同則是 0。'
            : step.operator === '<<' ? '整排向左移動指定格數，右側補 0。'
              : '整排向右移動指定格數，左側補上符號位。';
  }

  function draw(step: SceneStep, forward: boolean, pace: number) {
    for (const animation of animations) animation.cancel();
    animations = [];
    cargo.hidden = true;
    parcel.hidden = true;
    spur.hidden = true;
    belt.removeAttribute('data-running');
    const home = dock();
    const openBackpack = ['declare', 'input', 'receive', 'update', 'access'].includes(step.action ?? '');
    backpack.dataset.open = String(openBackpack);
    const from = explorerDestination ? atElement(explorerDestination) : home;
    if (step.destination) explorerDestination = step.destination;
    const destination = explorerDestination ? atElement(explorerDestination) : home;
    explorer.style.transform = translate(from);
    let walkDuration = 0;
    if (step.destination && forward && !reducedMotion.matches) {
      const distance = Math.hypot(destination.x - from.x, destination.y - from.y);
      walkDuration = Math.max(320, Math.min(1250, distance * 2.8)) * Math.max(.58, Math.min(1.22, pace / 650));
      animate(explorer, [
        { transform: translate(from), offset: 0 },
        { transform: translate({ x: (from.x + destination.x) / 2, y: Math.min(from.y, destination.y) - 12 }), offset: .5 },
        { transform: translate(destination), offset: 1 },
      ], walkDuration);
      animate(sprite, [
        { transform: 'translateY(0) rotate(0)', offset: 0 },
        { transform: 'translateY(-5px) rotate(-4deg)', offset: .5 },
        { transform: 'translateY(0) rotate(0)', offset: 1 },
      ], walkDuration / 2);
      animations.at(-1)!.effect?.updateTiming({ iterations: 2 });
    } else {
      explorer.style.transform = translate(destination);
    }
    bubble.textContent = step.spoken.length > 180 ? step.spoken.slice(0, 177) + '…' : step.spoken;
    bubble.hidden = !step.spoken.trim();
    const calculation = step.calculation;
    showBitwise(step.bitwise);
    thought.hidden = !calculation;
    if (calculation) {
      expression.textContent = calculation.expression && calculation.expression !== calculation.result
        ? calculation.expression : '準備存入';
      result.textContent = '= ' + calculation.result;
    }

    if (step.action === 'output' && calculation && forward && !reducedMotion.matches) {
      const duration = 1200 * Math.max(.58, Math.min(1.22, pace / 650));
      animate(thought, [
        { opacity: 0, transform: 'translateY(5px) scale(.96)' },
        { opacity: 1, transform: 'translateY(0) scale(1)', offset: .28 },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ], duration);
      animate(result, [
        { opacity: 0, transform: 'translateY(4px)' },
        { opacity: 0, transform: 'translateY(4px)', offset: .42 },
        { opacity: 1, transform: 'translateY(0)' },
      ], duration);
      return Math.max(duration, walkDuration);
    }
    if (step.action === 'bitwise' && step.bitwise && forward && !reducedMotion.matches) {
      const duration = 1150 * Math.max(.58, Math.min(1.22, pace / 650));
      animate(bitwork, [
        { opacity: 0, transform: 'translate(-50%, -50%) scale(.94)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      ], duration);
      return Math.max(duration, walkDuration);
    }

    const box = step.box;
    const shape = box?.querySelector('svg');
    if (!forward || reducedMotion.matches || !shape || !box || !step.type) return walkDuration;
    const slot = atElement(shape);
    const scale = Math.max(.58, Math.min(1.22, pace / 650));

    if (step.action === 'update' || step.action === 'receive') {
      const receiving = step.action === 'receive';
      const duration = (receiving ? 2350 : 2250) * scale;
      const work = atElement(door);
      const track = { x: slot.x, y: work.y };
      const slotTransform = translate(slot) + (box.closest('.basket') ? ' scale(.48)' : '');
      const type = step.type;
      const movingBox = makeCube(step.before ?? null, type);
      prepareCargo(movingBox, type);
      belt.dataset.running = 'true';
      spur.style.left = slot.x + 'px';
      spur.style.top = slot.y + 'px';
      spur.style.height = (work.y - slot.y) + 'px';
      spur.hidden = false;
      animate(shape, [
        { opacity: 0, offset: 0 }, { opacity: 0, offset: .98 }, { opacity: 1, offset: 1 },
      ], duration);
      animate(cargo, [
        { transform: slotTransform, offset: 0 },
        { transform: translate(track), offset: .16 },
        { transform: translate(work), offset: .34 },
        { transform: translate(work), offset: .73 },
        { transform: translate(track), offset: .84 },
        { transform: slotTransform, offset: 1 },
      ], duration).onfinish = () => {
        cargo.hidden = true;
        parcel.hidden = true;
        spur.hidden = true;
        belt.removeAttribute('data-running');
      };

      if (receiving) {
        const letter = balloon.content.firstElementChild!.cloneNode(true) as HTMLElement;
        letter.querySelector('.input-token')!.textContent = step.inputToken ?? '';
        const landing = { x: home.x + 38, y: home.y - 40 };
        parcel.replaceChildren(letter);
        parcel.hidden = false;
        animate(parcel, [
          { transform: translate({ x: landing.x - 12, y: 18 }), opacity: 0, offset: 0 },
          { transform: translate({ x: landing.x + 8, y: (landing.y + 18) / 2 }), opacity: 1, offset: .27 },
          { transform: translate(landing), opacity: 1, offset: .52 },
          { transform: translate(work), opacity: 1, offset: .67 },
          { transform: translate(work), opacity: 0, offset: .70 },
          { transform: translate(work), opacity: 0, offset: 1 },
        ], duration);
        animate(letter.querySelector('svg')!, [
          { opacity: 1, offset: 0 }, { opacity: 1, offset: .52 },
          { opacity: 0, offset: .58 }, { opacity: 0, offset: 1 },
        ], duration);
      } else if (calculation) {
        animate(thought, [
          { opacity: 0, offset: 0 }, { opacity: 0, offset: .29 },
          { opacity: 1, offset: .34 }, { opacity: 1, offset: 1 },
        ], duration);
        animate(result, [
          { opacity: 0, offset: 0 }, { opacity: 0, offset: .43 },
          { opacity: 1, offset: .5 }, { opacity: 1, offset: 1 },
        ], duration);
        const answer = document.createElement('span');
        answer.className = 'input-token';
        answer.textContent = calculation.result;
        const from = atElement(result);
        parcel.replaceChildren(answer);
        parcel.hidden = false;
        animate(parcel, [
          { transform: translate(from), opacity: 0, offset: 0 },
          { transform: translate(from), opacity: 0, offset: .53 },
          { transform: translate(from), opacity: 1, offset: .56 },
          { transform: translate(work), opacity: 1, offset: .67 },
          { transform: translate(work), opacity: 0, offset: .70 },
          { transform: translate(work), opacity: 0, offset: 1 },
        ], duration);
      }

      const edit = animate(movingBox.querySelector('.cube-lid')!, [
        { transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }, { transform: 'translateY(0)' },
      ], duration * .12);
      edit.effect?.updateTiming({ delay: duration * .56 });
      edit.onfinish = () => setCubeValue(movingBox, step.value ?? null, type);
      animate(sprite.querySelector('.hamster-paws')!, [
        { transform: 'translateY(0)', offset: 0 }, { transform: 'translateY(0)', offset: .51 },
        { transform: 'translateY(-15px)', offset: .62 }, { transform: 'translateY(0)', offset: .73 },
        { transform: 'translateY(0)', offset: 1 },
      ], duration);
      return Math.max(duration, walkDuration);
    }

    if (step.action === 'declare') {
      const duration = 480 * scale;
      animate(shape, [
        { transform: 'translateY(-35px)', opacity: 0 },
        { transform: 'translateY(2px)', opacity: 1, offset: .82 },
        { transform: 'translateY(0)', opacity: 1 },
      ], duration);
      return Math.max(duration, walkDuration);
    }

    return walkDuration;
  }

  function reset() {
    for (const animation of animations) animation.cancel();
    animations = [];
    explorerDestination = null;
    explorer.style.transform = translate(dock());
    backpack.dataset.open = 'false';
    cargo.hidden = true;
    parcel.hidden = true;
    spur.hidden = true;
    belt.removeAttribute('data-running');
    bubble.hidden = true;
    thought.hidden = true;
    bitwork.hidden = true;
  }

  new ResizeObserver(() => {
    explorer.style.transform = translate(explorerDestination ? atElement(explorerDestination) : dock());
  }).observe(field);
  return { draw, reset, makeCube, setCubeValue };
}

import { displaySandboxValue } from '../lib/cpp-sandbox.mjs';

