// src/commands/gemini.ts — anygate gemini command
import type { ParsedArgs } from '../core/types.js';
import { runGeminiCommand, geminiHelpText } from '../agents/gemini/cli.js';

export async function handleGeminiCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(geminiHelpText());
    return 0;
  }
  return runGeminiCommand(parsed.claudeArgs ?? [], parsed.trace ?? false, {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
  });
}