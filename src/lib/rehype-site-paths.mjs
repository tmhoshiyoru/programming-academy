import rehypeRaw from 'rehype-raw';
import { withBase, withBaseSrcset, withBaseStyle } from './site-path.mjs';

// Parse literal HTML too: authors can keep using <img src="/images/...">.
const passThrough = ['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'mdxJsxFlowElement', 'mdxJsxTextElement'];
const urlAttributes = new Set(['href', 'src', 'poster', 'action']);

export default function rehypeSitePaths({ base = '/' } = {}) {
  const parseRaw = rehypeRaw({ passThrough });
  return (tree, file) => {
    const parsed = parseRaw(tree, file);
    function rewrite(name, value) {
      if (typeof value !== 'string') return value;
      if (urlAttributes.has(name)) return withBase(value, base);
      if (name.toLowerCase() === 'srcset') return withBaseSrcset(value, base);
      if (name === 'style') return withBaseStyle(value, base);
      return value;
    }
    function visit(node) {
      if (node.type === 'element') {
        for (const [name, value] of Object.entries(node.properties ?? {})) node.properties[name] = rewrite(name, value);
      }
      for (const attribute of node.attributes ?? []) {
        if (attribute.type === 'mdxJsxAttribute') attribute.value = rewrite(attribute.name, attribute.value);
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(parsed);
    return parsed;
  };
}
