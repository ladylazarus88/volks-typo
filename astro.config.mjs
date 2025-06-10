// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jdrhyne.github.io',
  base: '/volks-typo',
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
});
