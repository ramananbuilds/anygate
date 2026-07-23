// src/commands/claude-app.ts — anygate claude-app command
import type { ParsedArgs } from '../core/types.js';
import { runClaudeAppCommand } from '../agents/claude/desktop.js';

export async function handleClaudeAppCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(`
anygate claude-app — Launch Claude Desktop app with registry providers

Usage:
  anygate claude-app [options]
  anygate claude-app --help
  anygate claude-app --version

Options:
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --help, -h         Show this help
  -v, --version      Show version

This command launches the Claude Desktop app with anygate's provider registry.
`);
    return 0;
  }
  return runClaudeAppCommand(parsed.claudeArgs ?? [], {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
  });
}