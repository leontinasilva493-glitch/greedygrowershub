// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://greedygrowerhub.wiki',
  trailingSlash: 'always',

  redirects: {
    '/calculator': '/',
  },

  integrations: [sitemap({ filter: (page) => !['/privacy/', '/disclaimer/', '/contact/', '/calculator/', '/seeds/', '/seeds/best-seeds/'].some((route) => page.endsWith(route)) })],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});