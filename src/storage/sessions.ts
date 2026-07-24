import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getAppHome } from '../config/paths.js';

const SESSIONS_DIR = join(getAppHome(), 'sessions');

export interface SessionRecord {
  id: string;
  createdAt: number;
  agent: string;
  provider: string;
  model: string;
}

export function saveSessionRecord(session: SessionRecord): void {
  if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });
  const file = join(SESSIONS_DIR, `${session.id}.json`);
  writeFileSync(file, JSON.stringify(session, null, 2), 'utf8');
}
