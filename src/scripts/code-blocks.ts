document.querySelectorAll<HTMLElement>('.article pre').forEach(pre => {
  const code = pre.querySelector('code');
  if (!code || pre.querySelector('.copy-code-button')) return;
  const button = document.createElement('button');
  const heading = pre.previousElementSibling?.matches('h2, h3, h4')
    ? pre.previousElementSibling.textContent?.trim()
    : undefined;
  let resetTimer: number | undefined;
  button.type = 'button';
  button.className = 'copy-code-button';
  button.textContent = '複製';
  button.setAttribute('aria-label', heading ? `複製${heading}的程式碼` : '複製整段程式碼');
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', async () => {
    // Read only the code node: line numbers are CSS counters and the button is a sibling.
    const value = code.textContent ?? '';
    try {
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); copied = true; }
      } catch { copied = false; }
      if (!copied) {
        const helper = document.createElement('textarea');
        helper.value = value;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        helper.tabIndex = -1;
        helper.setAttribute('aria-hidden', 'true');
        document.body.append(helper);
        try { helper.select(); copied = document.execCommand('copy'); }
        finally { helper.remove(); button.focus({ preventScroll: true }); }
      }
      if (!copied) throw new Error('Clipboard unavailable');
      button.textContent = '已複製';
    } catch {
      button.textContent = '複製失敗';
    }
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => { button.textContent = '複製'; }, 1800);
  });
  pre.append(button);
});
