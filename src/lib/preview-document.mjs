const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'";

/** A fresh document for each sandboxed game, including games inside an article. */
export function createPreviewDocument(blocks) {
  const css = (blocks['game-css'] ?? '').replace(/<\/style/gi, '<\\/style');
  const js = (blocks['game-js'] ?? '').replace(/<\/script/gi, '<\\/script');
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>${css}</style></head><body>${blocks['game-html'] ?? ''}<script>${js}</script></body></html>`;
}

export function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#39;');
}
