// src/commands/ui.ts — anygate ui command
import type { ParsedArgs } from '../core/types.js';
import { VERSION } from '../core/constants.js';

export async function handleUiCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(`
anygate ui — Open the settings UI in your browser

Usage:
  anygate ui [--trace]

Options:
  --trace     Enable trace logging
  --help, -h  Show this help
  -v, --version  Show version
`);
    return 0;
  }
  const { runUiCommand } = await import('../ui/command.js');
  return runUiCommand({ trace: parsed.trace });
}