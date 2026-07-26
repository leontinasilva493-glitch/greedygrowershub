// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://greedygrowerhub.wiki',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !['/privacy/', '/disclaimer/', '/contact/'].some((route) => page.endsWith(route)) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
