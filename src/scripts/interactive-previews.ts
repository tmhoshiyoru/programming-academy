import { loadSandboxedPreview } from '../lib/sandboxed-preview';

document.querySelectorAll<HTMLIFrameElement>('.interactive-preview').forEach(frame => {
  loadSandboxedPreview(frame, frame.dataset.previewDocument ?? '', import.meta.env.BASE_URL, { autoHeight: true });
});
