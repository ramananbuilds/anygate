// src/cli/update.ts — anygate update command
import type { ParsedArgs } from '../types/index.js'
import { runUpdateCommand } from '../apps/shared/self-update.js'

export async function handleUpdateCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../config/constants.js')
    console.log(VERSION)
    return 0
  }
  if (parsed.showHelp) {
    console.log(`
anygate update — Interactively upgrade anygate to the latest published version

Usage:
  anygate update [--dry-run] [--help] [--version]

Options:
  --dry-run  Check for updates without installing
  --help, -h Show this help
  -v, --version  Show version
`)
    return 0
  }
  return runUpdateCommand(Boolean(parsed.dryRun))
}
