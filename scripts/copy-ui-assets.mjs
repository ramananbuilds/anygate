// Copy src/ui/public into dist/ui/public (cross-platform, used by the build script).
import { cpSync, existsSync, mkdirSync } from 'node:fs';

const src = new URL('../src/ui/public', import.meta.url);
const dest = new URL('../dist/ui/public', import.meta.url);

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log('copied ui assets -> dist/ui/public');
