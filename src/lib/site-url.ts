import { withBase } from './site-path.mjs';

export function siteUrl(path: string): string {
  return withBase(path, import.meta.env.BASE_URL);
}
