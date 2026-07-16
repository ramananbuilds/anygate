import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pkgRaw = readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8').replace(/^﻿/, '');
const pkg = JSON.parse(pkgRaw);

export default defineConfig({
  root: '.',
  plugins: [svelte(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    extensions: ['.svelte.ts', '.ts', '.js', '.svelte', '.json'],
  },
  build: {
    outDir: '../src/ui/dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:17645',
      '/oauth': 'http://127.0.0.1:17645',
    },
  },
});
