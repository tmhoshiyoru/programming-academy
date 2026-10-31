import { createPreviewDocument, escapeAttribute } from './preview-document.mjs';

const languages = ['game-html', 'game-css', 'game-js'];

function paragraphText(node) {
  if (node.type !== 'paragraph' || !node.children.every(child => child.type === 'text')) return null;
  return node.children.map(child => child.value).join('').trim();
}

/** Group three fenced blocks at their original position, without parsing code as Markdown. */
export default function remarkInteractiveBlocks() {
  return (tree, file) => {
    if (file.data.astro?.frontmatter?.type !== 'interactive') return;
    const result = [];
    let count = 0;
    for (let index = 0; index < tree.children.length; index++) {
      const node = tree.children[index];
      const opener = paragraphText(node)?.match(/^:::interactive(?:[ \t]+(.+))?$/);
      if (!opener) { result.push(node); continue; }
      const blocks = {};
      let closed = false;
      for (index++; index < tree.children.length; index++) {
        const child = tree.children[index];
        if (paragraphText(child) === ':::') { closed = true; break; }
        if (child.type !== 'code' || !languages.includes(child.lang)) {
          file.fail('互動區塊內只能放 game-html、game-css、game-js 三個程式碼區塊；請將 Markdown 說明放在 ::: 標記外。', child);
        }
        if (Object.hasOwn(blocks, child.lang)) file.fail(`互動區塊內的 ${child.lang} 重複了。`, child);
        blocks[child.lang] = child.value;
      }
      if (!closed) file.fail('互動區塊缺少結束標記 :::。', node);
      for (const language of languages) {
        if (!Object.hasOwn(blocks, language)) file.fail(`互動區塊缺少 ${language} 程式碼區塊；不需要內容時仍請保留空白區塊。`, node);
      }
      count++;
      const title = opener[1]?.trim() || `互動區塊 ${count}`;
      const html = createPreviewDocument(blocks);
      result.push({
        type: 'html',
        value: `<div class="interactive-block"><iframe class="interactive-preview" title="${escapeAttribute(title)}" sandbox="allow-scripts" data-preview-document="${escapeAttribute(html)}"></iframe></div>`,
      });
    }
    tree.children = result;
  };
}
