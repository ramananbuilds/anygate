// Copy the Vite-built SPA (src/ui/dist) into dist/ui/dist so it ships in the
// published package. Source of truth is the Vite build (npm run ui:build).
import { cpSync, existsSync, mkdirSync } from 'node:fs';

const src = new URL('../src/ui/dist', import.meta.url);
const dest = new URL('../dist/ui/dist', import.meta.url);

if (!existsSync(src)) {
  console.error('src/ui/dist not found — run `npm run ui:build` first');
  process.exit(1);
}
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('copied ui SPA -> dist/ui/dist');
