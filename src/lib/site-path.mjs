/** Add the deployment directory to root-relative URLs, exactly once. */
export function withBase(url, base = '/') {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return url;
  const prefix = `/${base.split('/').filter(Boolean).join('/')}`;
  if (prefix === '/' || url === prefix || url.startsWith(`${prefix}/`) || url.startsWith(`${prefix}?`) || url.startsWith(`${prefix}#`)) return url;
  return prefix + url;
}

export function withBaseSrcset(value, base) {
  return value.replace(/(^|,\s*)(\/(?!\/)[^\s,]+)/g, (_, separator, url) => separator + withBase(url, base));
}

export function withBaseStyle(value, base) {
  return value.replace(/url\(\s*(['"]?)(\/(?!\/)[^)'"\s]+)\1\s*\)/gi, (_, quote, url) => `url(${quote}${withBase(url, base)}${quote})`);
}
