// Keep local development at /, while producing the GitHub Pages project URL.
process.env.SITE_BASE ||= '/programming-academy/';
process.env.SITE_URL ||= 'https://tmhoshiyoru.github.io';
const { build } = await import('astro');
await build({});
