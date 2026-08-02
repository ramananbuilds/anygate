import { appendFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { getAppHome } from '../config/paths.js'

const LOG_DIR = join(getAppHome(), 'logs')

export function appendStorageLog(module: string, message: string): void {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
  const file = join(LOG_DIR, `${module}.log`)
  appendFileSync(file, `[${new Date().toISOString()}] ${message}\n`, 'utf8')
}
