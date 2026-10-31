import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCodeLanguage from './src/lib/remark-code-language.mjs';
import remarkInteractiveBlocks from './src/lib/remark-interactive-blocks.mjs';
import rehypeSitePaths from './src/lib/rehype-site-paths.mjs';
import rehypeExternalLinks from './src/lib/rehype-external-links.mjs';

const base = process.env.SITE_BASE || '/';
const site = process.env.SITE_URL || 'https://tmhoshiyoru.github.io';

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      wrap: true,
      langAlias: { 'game-html': 'html', 'game-css': 'css', 'game-js': 'javascript' },
    },
    processor: unified({
      remarkPlugins: [remarkCodeLanguage, remarkMath, remarkInteractiveBlocks],
      rehypePlugins: [rehypeKatex, [rehypeSitePaths, { base }], [rehypeExternalLinks, { site }]],
    }),
  },
});
