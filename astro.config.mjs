// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
// Deploys to Cloudflare Workers (static assets + server routes). Site lives at the URL root.
export default defineConfig({

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});