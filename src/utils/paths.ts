import { normalize, resolve } from 'node:path';

export function normalizePath(pathStr: string): string {
  return normalize(pathStr);
}

export function resolveAbsolutePath(...paths: string[]): string {
  return resolve(...paths);
}
