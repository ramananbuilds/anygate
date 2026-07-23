// src/commands/antigravity.ts — anygate agy / antigravity / antigravity-ide commands
import type { ParsedArgs } from '../core/types.js';
import { runAgyCommand, runAntigravityAppCommand, runAntigravityIdeCommand } from '../agents/gemini/antigravity.js';

const AGY_HELP_TEXT = `
anygate agy — Antigravity CLI

Usage:
  anygate agy [options] [agy-flags]
  anygate agy --help
  anygate agy --version

Options:
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

How it works:
  Starts a local Cloud Code gateway, points agy at it via CLOUD_CODE_URL,
  and injects anygate models into Antigravity's native model picker.
  All Cloud Code traffic routes through anygate — no Google Cloud Code upstream.

Examples:
  anygate agy
  anygate agy --provider zen --model deepseek-v4-flash-free
  anygate agy -p "fix this bug"
`;

const ANTIGRAVITY_APP_HELP_TEXT = `
anygate antigravity — Antigravity app

Usage:
  anygate antigravity [options]
  anygate antigravity --help
  anygate antigravity --version

Options:
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

How it works:
  Creates an isolated anygate-managed Antigravity profile, starts a local Cloud
  Code gateway, and injects anygate models into Antigravity's native picker.
  The normal Antigravity profile is never modified.

Favorites:
  Uses the same Antigravity favorites list as anygate favorites --agy:
  up to six saved favorites plus the selected launch model.

Platform:
  macOS (Apple Silicon) — other platforms coming after testing.

Examples:
  anygate antigravity
  anygate antigravity --provider zen --model deepseek-v4-flash-free
`;

const ANTIGRAVITY_IDE_HELP_TEXT = `
anygate antigravity-ide — Antigravity IDE

Usage:
  anygate antigravity-ide [options]
  anygate antigravity-ide --help
  anygate antigravity-ide --version

Options:
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

How it works:
  Creates an isolated anygate-managed IDE profile, starts a local Cloud Code
  gateway, and injects anygate models into Antigravity's native picker.
  The normal IDE profile is never modified.

Platform:
  macOS (Apple Silicon) — other platforms coming after testing.

Examples:
  anygate antigravity-ide
  anygate antigravity-ide --provider zen --model deepseek-v4-flash-free
`;

export async function handleAgyCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(AGY_HELP_TEXT);
    return 0;
  }
  return runAgyCommand(parsed.claudeArgs ?? [], parsed.trace ?? false, {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
  });
}

export async function handleAntigravityAppCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(ANTIGRAVITY_APP_HELP_TEXT);
    return 0;
  }
  return runAntigravityAppCommand(parsed.claudeArgs ?? [], parsed.trace ?? false, {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
  });
}

export async function handleAntigravityIdeCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(ANTIGRAVITY_IDE_HELP_TEXT);
    return 0;
  }
  return runAntigravityIdeCommand(parsed.claudeArgs ?? [], parsed.trace ?? false, {
    launchProvider: parsed.launchProvider,
    launchModel: parsed.launchModel,
  });
}