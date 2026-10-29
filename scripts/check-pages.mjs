import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import rehypeRaw from 'rehype-raw';

const base = process.env.SITE_BASE || '/programming-academy/';
const root = path.resolve('dist');
const origin = 'https://pages-check.invalid';
const failures = new Set();
let pages = 0;
let references = 0;
const parse = rehypeRaw();

async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

async function check(url, source) {
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return;
  const relativeSource = path.relative(root, source).split(path.sep).join('/');
  const resolved = new URL(url, `${origin}${base}${relativeSource}`);
  if (!resolved.pathname.startsWith(base)) {
    failures.add(`${relativeSource}: missing base: ${url}`);
    return;
  }
  const file = path.resolve(root, decodeURIComponent(resolved.pathname.slice(base.length)));
  if (file !== root && !file.startsWith(root + path.sep)) {
    failures.add(`${relativeSource}: path outside site: ${url}`);
    return;
  }
  references++;
  if (!(await exists(file)) && !(await exists(path.join(file, 'index.html')))) {
    failures.add(`${relativeSource}: missing file: ${url}`);
  }
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (file.endsWith('.html')) {
      pages++;
      const tree = parse({ type: 'root', children: [{ type: 'raw', value: await readFile(file, 'utf8') }] });
      const urls = [];
      function collect(node) {
        if (node.type === 'element') {
          for (const key of ['href', 'src', 'poster']) {
            const value = node.properties?.[key];
            if (typeof value === 'string') urls.push(value);
          }
        }
        for (const child of node.children ?? []) collect(child);
      }
      collect(tree);
      for (const url of urls) await check(url, file);
    } else if (file.endsWith('.css')) {
      const css = await readFile(file, 'utf8');
      for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) await check(match[1], file);
    }
  }
}

await walk(root);
if (pages === 0) failures.add('No built HTML pages found.');
if (!(await exists(path.join(root, 'simulator-runner.html')))) failures.add('Missing interactive preview runner.');
if (failures.size) {
  console.error([...failures].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages} HTML pages and ${references} local references under ${base}`);
}
