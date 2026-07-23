// src/commands/index.ts — Command registry and dispatch

import type { ParsedArgs } from '../core/types.js';

export type CommandHandler = (parsed: ParsedArgs) => Promise<number>;

export const commands: Record<string, CommandHandler> = {};

export function registerCommand(name: string, handler: CommandHandler): void {
  commands[name] = handler;
}

export async function dispatchCommand(parsed: ParsedArgs): Promise<number> {
  const handler = commands[parsed.command];
  if (!handler) {
    console.error(`Unknown command: ${parsed.command}`);
    console.error('Run "anygate --help" for a list of commands.');
    return 1;
  }
  return handler(parsed);
}

// Re-export parseArgs from cli.ts
export { parseArgs } from '../cli.js';

// Register all command handlers
import { handleClaudeCommand } from './claude.js';
import { handleCodexCommand } from './codex.js';
import { handleCodexAppCommand } from './codex-app.js';
import { handleClaudeAppCommand } from './claude-app.js';
import { handleGeminiCommand } from './gemini.js';
import { handleAgyCommand, handleAntigravityAppCommand, handleAntigravityIdeCommand } from './antigravity.js';
import { handleServerCommand } from './server.js';
import { handleUiCommand } from './ui.js';
import { runModelsCommand } from './models.js';
import { handleProvidersCommand } from './providers.js';
import { handleDoctorCommand } from './doctor.js';
import { handleCompletionsCommand } from './completions.js';
import { handleUpdateCommand } from './update.js';

registerCommand('claude', handleClaudeCommand);
registerCommand('codex', handleCodexCommand);
registerCommand('codex-app', handleCodexAppCommand);
registerCommand('chatgpt', handleCodexAppCommand); // alias
registerCommand('gemini', handleGeminiCommand);
registerCommand('claude-app', handleClaudeAppCommand);
registerCommand('agy', handleAgyCommand);
registerCommand('antigravity', handleAntigravityAppCommand);
registerCommand('antigravity-ide', handleAntigravityIdeCommand);
registerCommand('server', handleServerCommand);
registerCommand('ui', handleUiCommand);
registerCommand('models', runModelsCommand);
registerCommand('favorites', runModelsCommand); // alias
registerCommand('providers', handleProvidersCommand);
registerCommand('doctor', handleDoctorCommand);
registerCommand('completions', handleCompletionsCommand);
registerCommand('update', handleUpdateCommand);