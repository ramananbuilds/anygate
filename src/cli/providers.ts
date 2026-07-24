// src/cli/providers.ts — anygate providers command
import type { ParsedArgs } from '../types/index.js';
import { runProvidersCommand, providersHelpText } from './providers-command.js';

export async function handleProvidersCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../config/constants.js');
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