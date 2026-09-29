// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Deploys to the configured custom domain. Keep the site at the URL root.
export default defineConfig({
  site: 'https://refinary.st.io',
  vite: {
    plugins: [tailwindcss()]
  }
});