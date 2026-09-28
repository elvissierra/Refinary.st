// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Deploys to https://elvissierra.github.io/refinery.st/ until a custom domain is attached.
// If you later add a CNAME/custom domain, remove `base` and set `site` to that domain.
export default defineConfig({
  site: 'https://elvissierra.github.io',
  base: '/refinery.st/',
  vite: {
    plugins: [tailwindcss()]
  }
});