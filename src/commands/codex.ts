// src/commands/codex.ts — anygate codex command
import type { ParsedArgs } from '../core/types.js';
import { runCodexCommand, codexHelpText } from '../agents/codex/cli.js';

export async function handleCodexCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(codexHelpText());
    return 0;
  }
  return runCodexCommand(parsed.claudeArgs ?? [], parsed.trace ?? false, {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
    vertex: parsed.vertex,
  });
}