import { splitBalls, type Ball } from '../lib/brick-breaker';

type State = 'idle' | 'countdown' | 'playing' | 'over' | 'won';
type Power = 'wide' | 'slow' | 'multi' | 'life';
type Brick = { col: number; row: number; span: number; green: boolean; alive: boolean };
type Drop = { x: number; y: number; kind: Power };

function setupWordWall(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const context = canvas.getContext('2d');
  if (!context) return;
  const ctx = context;
  const trigger = root.querySelector<HTMLButtonElement>('.word-wall-trigger')!;
  const status = root.querySelector<HTMLElement>('.game-status')!;
  const livesDisplay = root.querySelector<HTMLElement>('.lives')!;
  const scoreDisplay = root.querySelector<HTMLElement>('.game-score')!;
  const announcement = root.querySelector<HTMLElement>('.game-announcement')!;
  const help = root.querySelector<HTMLElement>('.game-help')!;
  const result = root.querySelector<HTMLElement>('.game-result')!;
  const keys = new Set<string>();
  const title = '小綠綠程式學苑';
  const glyphWidth = 24, glyphHeight = 28, glyphStride = 27;
  const gridWidth = title.length * glyphStride - 3;
  // Half of the original (3, -4.2) pixels per frame at 60 Hz, independent of display refresh rate.
  const ballSpeed = Math.hypot(3, 4.2) * 60 * .5;
  const powerRadius = 15;
  const powers: Record<Power, { icon: string; color: string; message: string }> = {
    wide: { icon: '↔', color: '#206944', message: '滑板加長 · 12 秒' },
    slow: { icon: '◷', color: '#1b6394', message: '小球減速 · 10 秒' },
    multi: { icon: '●', color: '#794c9f', message: '場上球數 ×3！' },
    life: { icon: '＋', color: '#a54050', message: '生命 +1' },
  };
  let state: State = 'idle';
  let width = 900, height = 220, paddleX = 450, paddleWidth = 112;
  let bricks: Brick[] = [], balls: Ball[] = [], drops: Drop[] = [];
  let lives = 3, score = 0, countdown = 3, clock = 0, lastFrame = 0, frameId = 0;
  let wideUntil = 0, slowUntil = 0, messageUntil = 0, hitsSinceDrop = 0, dropsSpawned = 0;

  function makeBricks() {
    const mask = document.createElement('canvas');
    mask.width = glyphWidth; mask.height = glyphHeight;
    const pen = mask.getContext('2d', { willReadFrequently: true })!;
    pen.font = '900 24px system-ui, "Noto Sans TC", sans-serif';
    pen.textBaseline = 'alphabetic';
    bricks = [];
    // The glyph is only a construction mask: every visible cell is an individual collision body.
    [...title].forEach((character, index) => {
      pen.clearRect(0, 0, glyphWidth, glyphHeight);
      pen.fillText(character, 0, 23);
      const pixels = pen.getImageData(0, 0, glyphWidth, glyphHeight).data;
      for (let y = 0; y < glyphHeight; y++) {
        let x = 0;
        while (x < glyphWidth) {
          if (pixels[(y * glyphWidth + x) * 4 + 3] < 95) { x++; continue; }
          let span = 1;
          while (span < 3 && x + span < glyphWidth && pixels[(y * glyphWidth + x + span) * 4 + 3] >= 95) span++;
          bricks.push({ col: index * glyphStride + x, row: y, span, green: index < 3, alive: true });
          x += span;
        }
      }
    });
  }
  function geometry() {
    const wallWidth = Math.min(width - 36, 1120);
    const cell = wallWidth / gridWidth;
    return { cell, x: (width - wallWidth) / 2, y: state === 'idle' ? (height - glyphHeight * cell) / 2 : 64, size: cell * .82 };
  }
  function paddleY() { return height - 36; }
  function radius() { return Math.max(4, Math.min(6, width * .008)); }
  function clampPaddle() { paddleX = Math.max(paddleWidth / 2 + 8, Math.min(width - paddleWidth / 2 - 8, paddleX)); }
  function resize() {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const oldWidth = width, oldHeight = height;
    width = box.width; height = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paddleX *= width / oldWidth;
    balls.forEach(ball => { ball.x *= width / oldWidth; ball.y *= height / oldHeight; });
    drops.forEach(drop => { drop.x *= width / oldWidth; drop.y *= height / oldHeight; });
    clampPaddle(); draw();
  }
  function updateStatus() {
    livesDisplay.querySelectorAll('span').forEach((bar, index) => bar.classList.toggle('lost', index >= lives));
    livesDisplay.setAttribute('aria-label', `剩餘 ${lives} 條生命`);
    scoreDisplay.textContent = String(score);
    scoreDisplay.setAttribute('aria-label', `得分 ${score}`);
  }
  function notify(text: string) { announcement.textContent = text; messageUntil = clock + 3; }
  function prepareBall() { balls = [{ x: paddleX, y: paddleY() - radius() - 2, vx: 90, vy: -126 }]; countdown = 3; state = 'countdown'; }
  function play() {
    root.classList.add('is-playing'); trigger.hidden = true; trigger.setAttribute('aria-expanded', 'true');
    status.hidden = false; help.hidden = false; result.hidden = true;
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', '打磚塊。用滑鼠、觸控或左右方向鍵移動滑板，接住落下的道具。');
    lives = 3; score = 0; clock = 0; wideUntil = 0; slowUntil = 0;
    announcement.textContent = ''; drops = []; hitsSinceDrop = 0; dropsSpawned = 0; paddleWidth = 112;
    paddleX = width / 2; makeBricks(); prepareBall(); updateStatus();
    canvas.focus({ preventScroll: true });
    if (frameId) cancelAnimationFrame(frameId);
    lastFrame = 0; frameId = requestAnimationFrame(frame);
  }
  function finish(won: boolean) {
    state = won ? 'won' : 'over'; keys.clear(); announcement.textContent = '';
    root.querySelector<HTMLElement>('.result-title')!.textContent = won ? '文字牆全破！' : 'Game over';
    root.querySelector<HTMLElement>('.result-score')!.textContent = `得分 ${score}`;
    result.hidden = false;
    root.querySelector<HTMLButtonElement>('.play-again')!.focus({ preventScroll: true });
  }
  function close() {
    state = 'idle'; cancelAnimationFrame(frameId); frameId = 0; keys.clear();
    root.classList.remove('is-playing'); trigger.hidden = false; trigger.setAttribute('aria-expanded', 'false');
    status.hidden = true; help.hidden = true; result.hidden = true; announcement.textContent = '';
    canvas.removeAttribute('tabindex'); canvas.setAttribute('aria-label', title);
    balls = []; drops = []; makeBricks(); draw(); trigger.focus({ preventScroll: true });
  }
  function dropPower(x: number, y: number) {
    hitsSinceDrop++;
    // Guarantee a visible first reward, then random drops with a five-hit upper bound between rewards.
    if (drops.length >= 4 || (dropsSpawned > 0 && hitsSinceDrop < 5 && Math.random() >= .28)) return;
    const choices: Power[] = lives < 3 ? ['wide', 'slow', 'multi', 'life'] : ['wide', 'slow', 'multi'];
    const kind = dropsSpawned === 0 ? 'wide' : choices[Math.floor(Math.random() * choices.length)];
    drops.push({ x, y, kind }); dropsSpawned++; hitsSinceDrop = 0;
    if (dropsSpawned === 1) notify('道具掉落：↔ 加長');
  }
  function collect(kind: Power) {
    if (kind === 'wide') wideUntil = clock + 12;
    if (kind === 'slow') slowUntil = clock + 10;
    if (kind === 'multi') balls = splitBalls(balls);
    if (kind === 'life') { lives = Math.min(3, lives + 1); updateStatus(); }
    notify(powers[kind].message);
  }
  function normalize(ball: Ball) {
    const speed = Math.hypot(ball.vx, ball.vy) || ballSpeed;
    ball.vx = ball.vx / speed * ballSpeed; ball.vy = ball.vy / speed * ballSpeed;
    if (Math.abs(ball.vy) < ballSpeed * .35) {
      ball.vy = Math.sign(ball.vy || -1) * ballSpeed * .35;
      ball.vx = Math.sign(ball.vx || 1) * Math.sqrt(ballSpeed ** 2 - ball.vy ** 2);
    }
  }
  function moveBalls(dt: number) {
    const r = radius(), g = geometry(), factor = clock < slowUntil ? .65 : 1;
    for (const ball of balls) {
      const previousX = ball.x, previousY = ball.y;
      ball.x += ball.vx * dt * factor; ball.y += ball.vy * dt * factor;
      if (ball.x < r) { ball.x = r; ball.vx = Math.abs(ball.vx); }
      if (ball.x > width - r) { ball.x = width - r; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < r) { ball.y = r; ball.vy = Math.abs(ball.vy); }
      if (ball.vy > 0 && previousY + r <= paddleY() + 2 && ball.y + r >= paddleY() && Math.abs(ball.x - paddleX) < paddleWidth / 2 + r) {
        const angle = Math.max(-1, Math.min(1, (ball.x - paddleX) / (paddleWidth / 2))) * 1.02;
        ball.x = Math.max(r, Math.min(width - r, ball.x)); ball.y = paddleY() - r;
        ball.vx = Math.sin(angle) * ballSpeed; ball.vy = -Math.cos(angle) * ballSpeed;
      }
      for (const brick of bricks) {
        if (!brick.alive) continue;
        const x = g.x + brick.col * g.cell, y = g.y + brick.row * g.cell, brickWidth = brick.span * g.cell - g.cell * .18;
        if (ball.x + r < x || ball.x - r > x + brickWidth || ball.y + r < y || ball.y - r > y + g.size) continue;
        const nearestX = Math.max(x, Math.min(x + brickWidth, ball.x));
        const nearestY = Math.max(y, Math.min(y + g.size, ball.y));
        let nx = ball.x - nearestX, ny = ball.y - nearestY;
        const distance = Math.hypot(nx, ny);
        if (distance > r) continue;
        if (distance > 0) { nx /= distance; ny /= distance; }
        else if (previousY < y) { nx = 0; ny = -1; }
        else if (previousY > y + g.size) { nx = 0; ny = 1; }
        else { nx = previousX < x ? -1 : 1; ny = 0; }
        const dot = ball.vx * nx + ball.vy * ny;
        if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; normalize(ball); }
        ball.x += nx * (r - distance + .2); ball.y += ny * (r - distance + .2);
        brick.alive = false; score += 10; updateStatus(); dropPower(x + brickWidth / 2, y + g.size / 2);
        break;
      }
    }
    balls = balls.filter(ball => ball.y < height + r * 2);
  }
  function update(dt: number) {
    clock += dt;
    if (messageUntil < clock) announcement.textContent = '';
    paddleWidth = Math.min(width * .55, clock < wideUntil ? 180 : 112);
    if (keys.has('ArrowLeft')) paddleX -= 420 * dt;
    if (keys.has('ArrowRight')) paddleX += 420 * dt;
    clampPaddle();
    if (state === 'countdown') {
      countdown -= dt; balls[0].x = paddleX; balls[0].y = paddleY() - radius() - 2;
      if (countdown <= 0) state = 'playing';
      return;
    }
    if (state !== 'playing') return;
    const steps = Math.max(1, Math.ceil(dt * 180));
    for (let i = 0; i < steps; i++) moveBalls(dt / steps);
    for (const drop of drops) {
      const oldY = drop.y; drop.y += 92 * dt;
      if (oldY - powerRadius < paddleY() + 12 && drop.y + powerRadius >= paddleY() && Math.abs(drop.x - paddleX) <= paddleWidth / 2 + powerRadius) {
        collect(drop.kind); drop.y = height + 100;
      }
    }
    drops = drops.filter(drop => drop.y < height + 24);
    if (bricks.every(brick => !brick.alive)) { finish(true); return; }
    if (!balls.length) {
      lives--; drops = []; updateStatus();
      if (lives <= 0) finish(false);
      else prepareBall();
    }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#b6c7ba'; ctx.fillRect(0, 0, width, height);
    const g = geometry();
    for (const brick of bricks) if (brick.alive) {
      const x = g.x + brick.col * g.cell, y = g.y + brick.row * g.cell, brickWidth = brick.span * g.cell - g.cell * .18;
      ctx.fillStyle = brick.green ? '#175f3d' : '#19231d';
      ctx.fillRect(x, y, brickWidth, g.size);
      if (g.size > 3) { ctx.fillStyle = brick.green ? '#42825b' : '#48594b'; ctx.fillRect(x, y, brickWidth, .65); }
    }
    if (state === 'idle') return;
    ctx.fillStyle = '#254936'; ctx.beginPath(); ctx.roundRect(paddleX - paddleWidth / 2, paddleY(), paddleWidth, 12, 5); ctx.fill();
    ctx.fillStyle = '#ec7348'; ctx.strokeStyle = '#713716'; ctx.lineWidth = 1;
    for (const ball of balls) { ctx.beginPath(); ctx.arc(ball.x, ball.y, radius(), 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    for (const drop of drops) {
      ctx.shadowColor = '#173b3340'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
      ctx.fillStyle = powers[drop.kind].color; ctx.beginPath(); ctx.arc(drop.x, drop.y, powerRadius, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.strokeStyle = '#fff8'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '700 18px system-ui'; ctx.fillText(powers[drop.kind].icon, drop.x, drop.y);
    }
    if (state === 'countdown') {
      ctx.fillStyle = '#203f3066'; ctx.beginPath(); ctx.roundRect(width / 2 - 36, height * .59 - 42, 72, 84, 14); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '800 56px system-ui'; ctx.fillText(String(Math.max(1, Math.ceil(countdown))), width / 2, height * .59);
    }
    const effects: string[] = [];
    if (clock < wideUntil) effects.push(`加長 ${Math.ceil(wideUntil - clock)}s`);
    if (clock < slowUntil) effects.push(`慢速 ${Math.ceil(slowUntil - clock)}s`);
    if (effects.length) { ctx.fillStyle = '#264b35'; ctx.font = '600 11px system-ui'; ctx.textAlign = 'left'; ctx.fillText(effects.join('  ·  '), 16, height - 12); }
  }
  function frame(now: number) {
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .04) : 0;
    lastFrame = now; update(dt); draw();
    if (state === 'playing' || state === 'countdown') frameId = requestAnimationFrame(frame);
    else frameId = 0;
  }
  function movePaddle(event: PointerEvent) { paddleX = event.clientX - canvas.getBoundingClientRect().left; clampPaddle(); }
  trigger.addEventListener('click', play);
  canvas.addEventListener('pointermove', movePaddle);
  canvas.addEventListener('pointerdown', event => { movePaddle(event); canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true }); });
  canvas.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { keys.add(event.key); event.preventDefault(); } });
  window.addEventListener('keyup', event => keys.delete(event.key));
  canvas.addEventListener('blur', () => keys.clear());
  document.addEventListener('visibilitychange', () => { lastFrame = 0; keys.clear(); });
  root.querySelector('.play-again')!.addEventListener('click', play);
  root.querySelector('.close-game')!.addEventListener('click', close);
  makeBricks(); resize();
  new ResizeObserver(resize).observe(canvas);
  document.fonts.ready.then(() => { if (state === 'idle') { makeBricks(); draw(); } });
}

document.querySelectorAll<HTMLElement>('[data-brick-word-wall]').forEach(setupWordWall);
