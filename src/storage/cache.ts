import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getAppHome } from '../config/paths.js';

const CACHE_DIR = join(getAppHome(), 'cache');

function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function getCachedItem<T>(key: string): T | null {
  ensureCacheDir();
  const filePath = join(CACHE_DIR, `${key}.json`);
  if (!existsSync(filePath)) return null;
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setCachedItem<T>(key: string, value: T): void {
  ensureCacheDir();
  const filePath = join(CACHE_DIR, `${key}.json`);
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}
