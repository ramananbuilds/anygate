// src/commands/completions.ts — anygate completions command
import type { ParsedArgs } from '../core/types.js';
import { runCompletionsCommand } from '../agents/shared/completions.js';

export async function handleCompletionsCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(`
anygate completions — Print a shell completion script for anygate

Usage:
  anygate completions [bash|zsh|fish|powershell] [--shell <shell>]

Options:
  --shell <shell>  Shell type (bash, zsh, fish, powershell)
  --help, -h       Show this help
  -v, --version    Show version

Examples:
  anygate completions bash > ~/.bash_completion.d/anygate
  anygate completions zsh > ~/.zsh/completions/_anygate
`);
    return 0;
  }
  return runCompletionsCommand(parsed.completionsShell);
}