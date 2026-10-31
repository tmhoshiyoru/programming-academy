export default function rehypeExternalLinks({ site } = {}) {
  const siteOrigin = site ? new URL(site).origin : null;
  return tree => {
    function visit(node) {
      if (node.type === 'element' && node.tagName === 'a') {
        const properties = node.properties ??= {};
        const href = properties.href;
        if (typeof href === 'string' && /^(?:https?:\/\/|\/\/)/i.test(href.trim())) {
          let url;
          try { url = new URL(href, site ?? 'https://example.invalid'); } catch { /* Preserve malformed author input. */ }
          if (url && url.origin !== siteOrigin) {
            properties.target = '_blank';
            const existing = Array.isArray(properties.rel) ? properties.rel : String(properties.rel ?? '').split(/\s+/);
            const rel = new Set(existing.filter(value => value && value.toLowerCase() !== 'opener').map(value => value.toLowerCase()));
            rel.add('noopener');
            rel.add('noreferrer');
            properties.rel = [...rel];
          }
        }
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
