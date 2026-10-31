import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeSitePaths from '../src/lib/rehype-site-paths.mjs';
import rehypeExternalLinks from '../src/lib/rehype-external-links.mjs';

test('external Markdown and HTML links open new tabs while internal links and code remain intact', async () => {
  const processor = await createMarkdownProcessor({
    syntaxHighlight: false,
    rehypePlugins: [[rehypeSitePaths, { base: '/programming-academy/' }], [rehypeExternalLinks, { site: 'https://tmhoshiyoru.github.io' }]],
  });
  const { code } = await processor.render([
    '[GCC](https://gcc.gnu.org/onlinedocs/gcc/Case-Ranges.html)',
    '<a href="//example.com/a" target="_self" rel="nofollow opener">HTML</a>',
    '[站內](/courses/example/) [相對](../other/) [章節](#section)',
    '[完整站內網址](https://tmhoshiyoru.github.io/programming-academy/courses/)',
    '[郵件](mailto:example@example.com)',
    '```html\n<a href="https://example.com/">程式碼</a>\n```',
  ].join('\n\n'));
  assert.match(code, /href="https:\/\/gcc\.gnu\.org[^\"]+" target="_blank" rel="noopener noreferrer"/);
  assert.match(code, /href="\/\/example\.com\/a" target="_blank" rel="nofollow noopener noreferrer"/);
  assert.match(code, /<a href="\/programming-academy\/courses\/example\/">/);
  assert.match(code, /<a href="\.\.\/other\/">/);
  assert.match(code, /<a href="#section">/);
  assert.match(code, /<a href="https:\/\/tmhoshiyoru\.github\.io\/programming-academy\/courses\/">/);
  assert.match(code, /<a href="mailto:example@example\.com">/);
  assert.equal((code.match(/target="_blank"/g) ?? []).length, 2);
});
