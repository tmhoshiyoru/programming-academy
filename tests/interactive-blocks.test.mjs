import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile, readdir } from 'node:fs/promises';
import { createMarkdownProcessor, parseFrontmatter } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import remarkCodeLanguage from '../src/lib/remark-code-language.mjs';
import remarkInteractiveBlocks from '../src/lib/remark-interactive-blocks.mjs';
import { createPreviewDocument } from '../src/lib/preview-document.mjs';

const processor = await createMarkdownProcessor({
  syntaxHighlight: false,
  remarkPlugins: [remarkCodeLanguage, remarkInteractiveBlocks],
});
const render = (body, type = 'interactive') => processor.render(body, { frontmatter: { type } });

function block(title, message) {
  return [
    `:::interactive ${title}`,
    '', '```game-html', `<button id="shared">${message}</button>`, '```',
    '', '```game-css', `body { color: ${message === 'first' ? 'green' : 'blue'}; }`, '```',
    '', '```game-js', `const sameName = ${JSON.stringify(message)};`, '```',
    '', ':::',
  ].join('\n');
}

function collectFrames(html) {
  const tree = rehypeRaw()({ type: 'root', children: [{ type: 'raw', value: html }] });
  const frames = [];
  function visit(node) {
    if (node.tagName === 'iframe') frames.push(node);
    node.children?.forEach(visit);
  }
  visit(tree);
  return frames;
}

test('multiple games stay between Markdown sections in isolated iframe documents', async () => {
  const { code } = await render(['## Before', block('One', 'first'), '## Between', block('Two', 'second'), '## After'].join('\n\n'));
  const frames = collectFrames(code);
  assert.equal(frames.length, 2);
  assert.ok(code.indexOf('Before') < code.indexOf('<iframe'));
  assert.ok(code.indexOf('Between') > code.indexOf('</iframe>'));
  assert.ok(code.indexOf('Between') < code.lastIndexOf('<iframe'));
  assert.ok(code.indexOf('After') > code.lastIndexOf('</iframe>'));
  for (const [index, frame] of frames.entries()) {
    assert.deepEqual(frame.properties.sandbox, ['allow-scripts']);
    assert.equal(frame.properties.title, index === 0 ? 'One' : 'Two');
    const source = frame.properties.dataPreviewDocument;
    assert.ok(source.includes('id="shared"'));
    assert.ok(source.includes(`const sameName = "${index === 0 ? 'first' : 'second'}";`));
    assert.ok(!source.includes(`const sameName = "${index === 0 ? 'second' : 'first'}";`));
    assert.ok(source.includes("connect-src 'none'"));
    assert.ok(source.includes("frame-src 'none'"));
  }
  const host = rehypeRaw()({ type: 'root', children: [{ type: 'raw', value: code }] });
  const hostTags = [];
  function collectHostTags(node) {
    if (node.tagName) hostTags.push(node.tagName);
    node.children?.forEach(collectHostTags);
  }
  collectHostTags(host);
  assert.ok(!hostTags.includes('style'));
  assert.ok(!hostTags.includes('script'));
  assert.ok(!code.includes('language-game-js'));
});

test('existing lesson types and code samples are not turned into embeds', async () => {
  const { code } = await render(block('Example', 'first'), 'knowledge');
  assert.equal(collectFrames(code).length, 0);
  const sample = await render('````markdown\n:::interactive\n```game-js\nconsole.log(1);\n```\n:::\n````');
  assert.equal(collectFrames(sample.code).length, 0);
});

test('a marker inside a JS fence is treated as JavaScript text', async () => {
  const text = block('Example', 'first').replace('const sameName = "first";', 'const marker = `\n:::\n`;');
  const { code } = await render(text);
  assert.equal(collectFrames(code).length, 1);
  assert.ok(collectFrames(code)[0].properties.dataPreviewDocument.includes('const marker = `\n:::\n`;'));
});

test('malformed groups stop the build with actionable errors', async t => {
  t.mock.method(console, 'error', () => {});
  await assert.rejects(render(block('Broken', 'first').replace(/\n:::\s*$/, '')), /缺少結束標記/);
  await assert.rejects(render(block('Broken', 'first').replace('game-css', 'game-js')), /重複/);
  await assert.rejects(render(block('Broken', 'first').replace(/```game-css[\s\S]*?```/, '')), /缺少 game-css/);
  await assert.rejects(render(block('Broken', 'first').replace('```game-css', '正文不應放在這裡。\n\n```game-css')), /Markdown 說明放在/);
});

test('quotes in names cannot become iframe attributes, and raw-text closing tags stay inside code', async () => {
  const { code } = await render(block('" onload="alert(1)', 'first'));
  const frame = collectFrames(code)[0];
  assert.equal(frame.properties.onLoad, undefined);
  const source = createPreviewDocument({ 'game-html': '', 'game-css': '/* </style> */', 'game-js': 'const tag = "</script>";' });
  assert.equal((source.match(/<\/script>/g) ?? []).length, 1);
  assert.equal((source.match(/<\/style>/g) ?? []).length, 1);
  new vm.Script(source.match(/<script>([\s\S]*?)<\/script>/)[1]);
});

test('C++ lessons render their embeds with valid scripts and consistent teaching terminology', async () => {
  const directory = new URL('../src/content/courses/C++程式設計/', import.meta.url);
  async function markdownFiles(folder) {
    const files = [];
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = new URL(encodeURIComponent(entry.name), folder);
      if (entry.isDirectory()) files.push(...await markdownFiles(new URL(file.href + '/')));
      else if (entry.name.endsWith('.md')) files.push(file);
    }
    return files;
  }
  const files = await markdownFiles(directory);
  assert.ok(files.length > 0);
  for (const file of files) {
    const name = decodeURIComponent(file.pathname);
    const source = await readFile(file, 'utf8');
    const { content, frontmatter } = parseFrontmatter(source);
    assert.equal(frontmatter.type, 'interactive');
    assert.equal(frontmatter.summary, undefined, name);
    const { code } = await processor.render(content, { frontmatter });
    const frames = collectFrames(code);
    assert.ok(frames.length > 0, name);
    for (const frame of frames) {
      const script = frame.properties.dataPreviewDocument.match(/<script>([\s\S]*?)<\/script>/)[1];
      new vm.Script(script, { filename: name });
    }
    assert.ok(source.includes('using namespace std;'), name);
    assert.ok(!source.includes('std::cout'), name);
    assert.ok(!/印出|列印/.test(source), name);
  }
});
