import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCodeLanguage from '../src/lib/remark-code-language.mjs';
import rehypeSitePaths from '../src/lib/rehype-site-paths.mjs';
import { withBase, withBaseSrcset, withBaseStyle } from '../src/lib/site-path.mjs';

test('deployment prefix preserves external, relative, fragment and already prefixed URLs', () => {
  const base = '/programming-academy/';
  assert.equal(withBase('/', base), base);
  assert.equal(withBase('/images/機器人專題/ESP32 installation.png?x=1#圖', base), `${base}images/機器人專題/ESP32 installation.png?x=1#圖`);
  assert.equal(withBase('/courses/', '/'), '/courses/');
  for (const url of ['https://example.com/a', '//example.com/a', 'mailto:a@example.com', 'data:image/png;base64,AAAA', '#section', './picture.png', '?page=2', '/programming-academy/a', '/programming-academy', '/programming-academy?x=1']) {
    assert.equal(withBase(url, base), url);
  }
  assert.equal(withBase('/programming-academy-other/a', base), `${base}programming-academy-other/a`);
});

test('responsive images and CSS background images keep their URL syntax', () => {
  assert.equal(withBaseSrcset('/images/a.png 1x, /images/b.png 2x', '/repo/'), '/repo/images/a.png 1x, /repo/images/b.png 2x');
  assert.equal(withBaseSrcset('https://example.com/a 1x, //example.com/b 2x', '/repo/'), 'https://example.com/a 1x, //example.com/b 2x');
  assert.equal(withBaseStyle('background:url("/images/a.png")', '/repo/'), 'background:url("/repo/images/a.png")');
});

for (const base of ['/', '/programming-academy/']) {
  test(`Markdown and literal HTML work under ${base} without modifying code examples`, async () => {
    const processor = await createMarkdownProcessor({
      shikiConfig: { wrap: true },
      remarkPlugins: [remarkCodeLanguage, remarkMath],
      rehypePlugins: [rehypeKatex, [rehypeSitePaths, { base }]],
    });
    const result = await processor.render([
      '![接線圖](/images/courses/機器人專題/ultrawave.jpg)',
      '[章節](/courses/機器人專題/) [外站](https://example.com/) [位置](#here)',
      '<img src="/images/courses/機器人專題/ESP32 installation.png" width="600" alt="開發板">',
      '<a href="/simulator/">模擬器</a>',
      '- [ ] 待確認',
      '$x^2 + y^2$',
      '```cpp=',
      'const char* path = "/images/example.png";',
      '',
      'int main() { return 0; }',
      '```',
    ].join('\n\n'));
    assert.ok(decodeURI(result.code).includes(`src="${base}images/courses/機器人專題/ultrawave.jpg"`));
    assert.ok(result.code.includes(`src="${base}images/courses/機器人專題/ESP32 installation.png"`));
    assert.ok(decodeURI(result.code).includes(`href="${base}courses/機器人專題/"`));
    assert.ok(result.code.includes(`href="${base}simulator/"`));
    assert.ok(result.code.includes('href="https://example.com/"'));
    assert.ok(result.code.includes('href="#here"'));
    assert.ok(result.code.includes('type="checkbox"'));
    assert.ok(result.code.includes('class="katex"'));
    assert.ok(result.code.includes('data-language="cpp"'));
    assert.ok(result.code.includes('/images/example.png'));
    assert.ok(!result.code.includes(`${base === '/' ? '/never/' : base}images/example.png`));
  });
}
