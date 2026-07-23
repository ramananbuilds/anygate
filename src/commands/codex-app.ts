// src/commands/codex-app.ts — anygate codex-app / chatgpt command
import type { ParsedArgs } from '../core/types.js';
import { runCodexAppCommand } from '../agents/codex/app.js';

export async function handleCodexAppCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(`
anygate codex-app — Launch ChatGPT Desktop (Codex mode) with registry providers

Usage:
  anygate codex-app [options]
  anygate codex-app --help
  anygate codex-app --version

Options:
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --vertex           Use Vertex AI backend
  --help, -h         Show this help
  -v, --version      Show version

This command launches the ChatGPT Desktop app with anygate's provider registry.
`);
    return 0;
  }
  return runCodexAppCommand(parsed.claudeArgs ?? [], {
    vertex: parsed.vertex,
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel
  });
}