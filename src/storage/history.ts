import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getAppHome } from '../config/paths.js'

export interface CommandHistoryEntry {
  timestamp: number
  command: string
  args: string[]
}

const HISTORY_FILE = join(getAppHome(), 'command-history.json')

export function loadCommandHistory(): CommandHistoryEntry[] {
  if (!existsSync(HISTORY_FILE)) return []
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, 'utf8'))
  } catch {
    return []
  }
}

export function saveCommandHistory(entries: CommandHistoryEntry[]): void {
  writeFileSync(HISTORY_FILE, JSON.stringify(entries.slice(-500), null, 2), 'utf8')
}
