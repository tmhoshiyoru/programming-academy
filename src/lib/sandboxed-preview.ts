interface PreviewOptions { autoHeight?: boolean; }

const previewCleanups = new WeakMap<HTMLIFrameElement, () => void>();

export function loadSandboxedPreview(frame: HTMLIFrameElement, html: string, baseUrl: string, options: PreviewOptions = {}) {
  previewCleanups.get(frame)?.();
  const requestId = crypto.randomUUID();
  const render = () => {
    frame.contentWindow?.postMessage({ type: 'simulator:render', html, requestId, autoHeight: options.autoHeight === true }, '*');
  };
  const resize = (event: MessageEvent) => {
    const message = event.data;
    if (event.source !== frame.contentWindow || message?.type !== 'preview:height' || message.requestId !== requestId) return;
    if (typeof message.height !== 'number' || !Number.isFinite(message.height) || message.height < 0) return;
    const height = `${Math.max(1, Math.min(100_000, Math.ceil(message.height)))}px`;
    if (frame.style.height !== height) frame.style.height = height;
  };
  if (options.autoHeight) window.addEventListener('message', resize);
  frame.addEventListener('load', render, { once: true });
  previewCleanups.set(frame, () => {
    frame.removeEventListener('load', render);
    window.removeEventListener('message', resize);
  });
  frame.src = `${baseUrl}simulator-runner.html?run=${requestId}`;
}
