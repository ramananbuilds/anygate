import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function ensureFileDirectory(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function writeJsonFileSync(filePath: string, data: unknown): void {
  ensureFileDirectory(filePath);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
