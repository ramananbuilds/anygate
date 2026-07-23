// src/commands/providers.ts — anygate providers command
import type { ParsedArgs } from '../core/types.js';
import { runProvidersCommand, providersHelpText } from '../providers/command.js';

export async function handleProvidersCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(providersHelpText());
    return 0;
  }
  if (parsed.trace) {
    process.env.ANYGATE_TRACE = '1';
  }
  return runProvidersCommand(parsed.claudeArgs ?? []);
}