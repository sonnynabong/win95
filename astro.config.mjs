// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    base: './',
  },

  integrations: [react()],
  
  // Static site generation for Vercel
  output: 'static',
  
  // Build configuration
  build: {
    format: 'file',
    assets: 'assets',
    assetsPrefix: '.',
  },
  
  // Site configuration
  site: 'https://win95-os.vercel.app',
  
  // Dev server configuration
  server: {
    port: 3000,
    host: true,
  },
});
