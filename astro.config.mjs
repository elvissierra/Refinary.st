// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Deploys to GitHub Pages as a project site, so `base` must match the repo name.
export default defineConfig({
  site: 'https://elvissierra.github.io',
  base: '/Refinary.st',
  vite: {
    plugins: [tailwindcss()]
  }
});