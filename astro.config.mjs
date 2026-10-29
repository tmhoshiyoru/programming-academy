import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCodeLanguage from './src/lib/remark-code-language.mjs';
import rehypeSitePaths from './src/lib/rehype-site-paths.mjs';

const base = process.env.SITE_BASE || '/';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://tmhoshiyoru.github.io',
  base,
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      wrap: true,
      langAlias: { 'game-html': 'html', 'game-css': 'css', 'game-js': 'javascript' },
    },
    processor: unified({
      remarkPlugins: [remarkCodeLanguage, remarkMath],
      rehypePlugins: [rehypeKatex, [rehypeSitePaths, { base }]],
    }),
  },
});
