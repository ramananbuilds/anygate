// src/commands/update.ts — anygate update command
import type { ParsedArgs } from '../core/types.js';
import { runUpdateCommand } from '../agents/shared/self-update.js';

export async function handleUpdateCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
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
`);
    return 0;
  }
  return runUpdateCommand(parsed.dryRun);
}