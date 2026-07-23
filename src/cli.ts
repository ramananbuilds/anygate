// src/cli.ts
import pc from 'picocolors';
import { printAsciiBanner, fmtEnabledStar, fmtModel, providerSelectOption, gateIntro, gateOutro } from './agents/shared/ui.js';
import { favoriteProviderDisplayName } from './agents/claude/favorites-provider-display.js';
import * as p from '@clack/prompts';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { checkForUpdates, formatUpdateNotification } from './agents/shared/update-check.js';
import type { ParsedArgs } from './core/types.js';
import { refreshModelsDevCacheAsync } from './registry/models-dev.js';
import { generateAiDoc, installAiDoc, printAiInstallResult } from './agents/shared/ai-doc.js';
import { dispatchCommand } from './commands/index.js';
import { VERSION, MAX_MODEL_CATALOG } from './core/constants.js';
import { codexHelpText } from './agents/codex/cli.js';
import { geminiHelpText } from './agents/gemini/cli.js';
import { codexAppHelpText } from './agents/codex/app.js';
import { claudeAppHelpText } from './agents/claude/desktop.js';

const STARTER_CLAUDE_FLAGS = new Set(['--dry-run', '--setup', '--trace', '--help', '-h', '--version', '-v']);
const GATEWAY_LAUNCH_FLAGS = new Set(['--provider', '--model']);

function parseGatewayLaunchFlag(
  arg: string,
  rest: string[],
  index: number,
  parsed: ParsedArgs,
): number | 'error' {
  if (arg === '--provider' || arg === '--model') {
    const value = rest[index + 1];
    if (!value || value.startsWith('-')) {
      parsed.error = `Missing value for ${arg}`;
      return 'error';
    }
    if (arg === '--provider') parsed.launchProvider = value;
    else parsed.launchModel = value;
    return index + 1;
  }
  if (arg.startsWith('--provider=')) {
    parsed.launchProvider = arg.slice('--provider='.length);
    return index;
  }
  if (arg.startsWith('--model=')) {
    parsed.launchModel = arg.slice('--model='.length);
    return index;
  }
  return index;
}

function tryConsumeGatewayLaunchFlag(
  arg: string,
  rest: string[],
  index: number,
  parsed: ParsedArgs,
): { next: number } | { error: true } | null {
  if (!GATEWAY_LAUNCH_FLAGS.has(arg) && !arg.startsWith('--provider=') && !arg.startsWith('--model=')) {
    return null;
  }
  const next = parseGatewayLaunchFlag(arg, rest, index, parsed);
  if (next === 'error') return { error: true };
  return { next };
}

function consumeServerOptionValue(
  arg: string,
  rest: string[],
  index: number,
  flag: string,
  parsed: ParsedArgs,
): { value: string; next: number } | null {
  if (arg.startsWith(`${flag}=`)) {
    return { value: arg.slice(flag.length + 1), next: index };
  }
  if (arg !== flag) return null;
  const value = rest[index + 1];
  if (!value || value.startsWith('--')) {
    parsed.error = `Missing value for ${flag}`;
    return null;
  }
  return { value, next: index + 1 };
}

function applyServerProvidersOption(value: string, parsed: ParsedArgs): void {
  const trimmed = value.trim();
  if (trimmed === 'all') {
    parsed.serverProvidersMode = 'all';
    parsed.serverProviderIds = undefined;
    return;
  }
  if (trimmed === 'favorites') {
    parsed.serverProvidersMode = 'favorites';
    parsed.serverProviderIds = undefined;
    return;
  }

  const ids = trimmed.split(',').map(id => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    parsed.error = 'Missing provider ids for --providers';
    return;
  }
  parsed.serverProvidersMode = 'specific';
  parsed.serverProviderIds = ids;
}

function emptyParsed(command: ParsedArgs['command']): ParsedArgs {
  return {
    command,
    showHelp: false,
    showVersion: false,
    dryRun: false,
    setup: false,
    trace: false,
    vertex: false,
    claudeArgs: [],
  };
}

export function parseArgs(args: string[]): ParsedArgs {
  if (args.includes('--ai')) {
    return {
      ...emptyParsed('root'),
      showAi: true,
      aiInstall: args.includes('--install'),
      aiInstallForce: args.includes('--force'),
    };
  }

  if (args.length === 0) return { ...emptyParsed('root'), showHelp: true };

  const [first, ...rest] = args;

  if (first === '--help' || first === '-h') {
    return { ...emptyParsed('root'), showHelp: true };
  }
  if (first === '--version' || first === '-v') {
    return { ...emptyParsed('root'), showVersion: true };
  }

  if (first === 'server') {
    const parsed = emptyParsed('server');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else if (arg === '--vertex') parsed.vertex = true;
      else if (arg === '--quick' || arg === '--saved') parsed.serverQuick = true;
      else if (arg === '--free-only') parsed.serverFreeOnly = true;
      else if (arg === '--no-free-only') parsed.serverFreeOnly = false;
      else if (arg === '--mask-gateway-ids') parsed.serverMaskGatewayIds = true;
      else if (arg === '--no-mask-gateway-ids') parsed.serverMaskGatewayIds = false;
      else if (arg === '--listen' || arg.startsWith('--listen=')) {
        const consumed = consumeServerOptionValue(arg, rest, i, '--listen', parsed);
        if (!consumed) return parsed;
        if (consumed.value !== 'local' && consumed.value !== 'network') {
          parsed.error = '--listen must be "local" or "network"';
          return parsed;
        }
        parsed.serverListenMode = consumed.value;
        i = consumed.next;
      }
      else if (arg === '--providers' || arg.startsWith('--providers=')) {
        const consumed = consumeServerOptionValue(arg, rest, i, '--providers', parsed);
        if (!consumed) return parsed;
        applyServerProvidersOption(consumed.value, parsed);
        if (parsed.error) return parsed;
        i = consumed.next;
      }
      else if (arg === '--password' || arg.startsWith('--password=')) {
        const consumed = consumeServerOptionValue(arg, rest, i, '--password', parsed);
        if (!consumed) return parsed;
        parsed.serverPassword = consumed.value;
        i = consumed.next;
      }
      else if (!parsed.error) parsed.error = `Unknown server option: ${arg}`;
    }
    return parsed;
  }

  if (first === 'models' || first === 'favorites') {
    const parsed = emptyParsed('models');
    for (const arg of rest) {
      if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else if (arg === '--agy') parsed.favoritesAgy = true;
      else if (!parsed.error) parsed.error = `Unknown models option: ${arg}`;
    }
    return parsed;
  }

  if (first === 'providers') {
    const parsed = emptyParsed('providers');
    parsed.claudeArgs = [];
    for (const arg of rest) {
      if (arg === '--trace') parsed.trace = true;
      else if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'ui') {
    const parsed = emptyParsed('ui');
    for (const arg of rest) {
      if (arg === '--trace') parsed.trace = true;
      else if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else if (!parsed.error) parsed.error = `Unknown ui option: ${arg}`;
    }
    return parsed;
  }

  if (first === 'codex-app' || first === 'chatgpt') {
    const parsed = emptyParsed('codex-app');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--help' || arg === '-h') { parsed.showHelp = true; continue; }
      if (arg === '--version' || arg === '-v') { parsed.showVersion = true; continue; }
      if (arg === '--vertex') { parsed.vertex = true; continue; }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'claude-app') {
    const parsed = emptyParsed('claude-app');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--help' || arg === '-h') { parsed.showHelp = true; continue; }
      if (arg === '--version' || arg === '-v') { parsed.showVersion = true; continue; }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'codex') {
    const parsed = emptyParsed('codex');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--trace') {
        parsed.trace = true;
        continue;
      }
      if (arg === '--vertex') {
        parsed.vertex = true;
        continue;
      }
      if (arg === '--help' || arg === '-h') {
        parsed.showHelp = true;
        continue;
      }
      if (arg === '--version' || arg === '-v') {
        parsed.showVersion = true;
        continue;
      }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'gemini') {
    const parsed = emptyParsed('gemini');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--trace') {
        parsed.trace = true;
        continue;
      }
      if (arg === '--help' || arg === '-h') {
        parsed.showHelp = true;
        continue;
      }
      if (arg === '--version' || arg === '-v') {
        parsed.showVersion = true;
        continue;
      }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'agy') {
    const parsed = emptyParsed('agy');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--') {
        parsed.claudeArgs.push(...rest.slice(i + 1));
        break;
      }
      if (arg === '--trace') {
        parsed.trace = true;
        continue;
      }
      if (arg === '--help' || arg === '-h') {
        parsed.showHelp = true;
        continue;
      }
      if (arg === '--version' || arg === '-v') {
        parsed.showVersion = true;
        continue;
      }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'antigravity' || first === 'antigravity-ide') {
    const parsed = emptyParsed(first);
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--') {
        parsed.claudeArgs.push(...rest.slice(i + 1));
        break;
      }
      if (arg === '--trace') {
        parsed.trace = true;
        continue;
      }
      if (arg === '--help' || arg === '-h') {
        parsed.showHelp = true;
        continue;
      }
      if (arg === '--version' || arg === '-v') {
        parsed.showVersion = true;
        continue;
      }
      const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
      if (consumed !== null) {
        if ('error' in consumed) return parsed;
        i = consumed.next;
        continue;
      }
      parsed.claudeArgs.push(arg);
    }
    return parsed;
  }

  if (first === 'doctor') {
    const parsed = emptyParsed('doctor');
    for (const arg of rest) {
      if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else if (!parsed.error) parsed.error = `Unknown doctor option: ${arg}`;
    }
    return parsed;
  }

  if (first === 'completions') {
    const parsed = emptyParsed('completions');
    for (let i = 0; i < rest.length; i += 1) {
      const arg = rest[i]!;
      if (arg === '--help' || arg === '-h') { parsed.showHelp = true; continue; }
      if (arg === '--version' || arg === '-v') { parsed.showVersion = true; continue; }
      if (arg.startsWith('--shell=')) {
        parsed.completionsShell = arg.slice('--shell='.length);
        continue;
      }
      if (arg === '--shell') {
        const value = rest[i + 1];
        if (!value || value.startsWith('-')) {
          parsed.error = 'Missing value for --shell';
          return parsed;
        }
        parsed.completionsShell = value;
        i += 1;
        continue;
      }
      if (!parsed.error) parsed.error = `Unknown completions option: ${arg}`;
    }
    return parsed;
  }

  if (first === 'update') {
    const parsed = emptyParsed('update');
    for (const arg of rest) {
      if (arg === '--help' || arg === '-h') parsed.showHelp = true;
      else if (arg === '--version' || arg === '-v') parsed.showVersion = true;
      else if (arg === '--dry-run') parsed.dryRun = true;
      else if (!parsed.error) parsed.error = `Unknown update option: ${arg}`;
    }
    return parsed;
  }

  if (first !== 'claude') {
    return {
      ...emptyParsed('root'),
      error: first.startsWith('-') ? `Unknown root option: ${first}` : `Unknown command: ${first}`,
    };
  }

  const parsed = emptyParsed('claude');
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i]!;
    if (arg === '--') {
      parsed.claudeArgs.push(...rest.slice(i + 1));
      break;
    }

    const consumed = tryConsumeGatewayLaunchFlag(arg, rest, i, parsed);
    if (consumed !== null) {
      if ('error' in consumed) return parsed;
      i = consumed.next;
      continue;
    }

    if (!STARTER_CLAUDE_FLAGS.has(arg)) {
      parsed.claudeArgs.push(arg);
      continue;
    }

    if (arg === '--dry-run') parsed.dryRun = true;
    if (arg === '--setup') parsed.setup = true;
    if (arg === '--trace') parsed.trace = true;
    if (arg === '--help' || arg === '-h') parsed.showHelp = true;
    if (arg === '--version' || arg === '-v') parsed.showVersion = true;
  }

  return parsed;
}

export function printHelp(text: string): void {
  console.log(`\n${text}\n`);
}

// Help text functions - exported for use by command handlers
export function rootHelpText(): string {
  return `${pc.bold('anygate')} v${VERSION}
Launch AI coding tools with OpenCode Zen / Go or local providers (Groq, Mistral,
OpenAI, Gemini, Ollama, and more).

${pc.bold('Usage:')}
  anygate claude [options] [claude-flags]
  anygate claude-app [options]
  anygate codex [options] [codex-flags]
  anygate codex-app [options]
  anygate chatgpt [options]
  anygate gemini [options] [gemini-flags]
  anygate agy [options] [agy-flags]
  anygate antigravity [options]
  anygate antigravity-ide [options]
  anygate server [options]
  anygate ui
  anygate models
  anygate favorites
  anygate providers
  anygate doctor
  anygate completions <bash|zsh|fish|powershell>
  anygate update
  anygate --help
  anygate --version
  anygate --ai              Full reference for AI agents (run this when unsure)
  anygate --ai --install    Install or upgrade agent skill when version changed
  anygate --ai --install --force  Reinstall skill even if already current

${pc.bold('Root options:')}
  -h, --help       Show this help
  -v, --version    Show version
  --ai             Print the full reference for AI agents
  --ai --install   Install or upgrade the anygate agent skill
  --force          Reinstall the agent skill when used with --ai --install

${pc.bold('Commands:')}
  claude      Launch Claude Code — pick a provider from your registry
  models      Manage favorite models for mid-session /model switching (max ${MAX_MODEL_CATALOG})
  favorites   Alias for models
  providers   Add, import, and manage your AI providers
  server      Run a foreground API gateway (OpenCode Zen / Go and local providers)
  codex       Launch OpenAI Codex CLI with registry providers
  gemini      Launch Google Gemini CLI with registry providers
  agy         Launch Antigravity CLI with registry providers
  antigravity Launch Antigravity app with registry providers (macOS)
  antigravity-ide  Launch Antigravity IDE with registry providers (macOS)
  codex-app   Launch ChatGPT desktop app (Codex mode) with registry providers (macOS + Windows)
  chatgpt     Alias for codex-app
  claude-app  Launch Claude Desktop app with registry providers (macOS + Windows)
  doctor      Run an environment diagnostic (Node, keyring, key, port, env conflicts)
  completions Print a shell completion script for anygate
  update      Interactively upgrade anygate to the latest published version

${pc.bold('Antigravity favorites:')}
  agy, antigravity, and antigravity-ide share up to six Antigravity favorites
  from anygate favorites --agy, plus the selected launch model.

${pc.bold('Upgradeion:')}
  Bare anygate prints this help instead of launching Claude Code.
  Use anygate claude for the wizard and launcher.

${pc.bold('Examples:')}
  anygate claude
  anygate models
  anygate providers
  anygate codex
  anygate gemini
  anygate agy
  anygate antigravity
  anygate antigravity-ide
  anygate codex-app
  anygate claude-app
  anygate server
  anygate claude -c
  anygate claude --resume abc-123
  anygate claude -- --print "hello"`;
}

export function claudeHelpText(): string {
  return `${pc.bold('anygate claude')} v${VERSION}
Launch Claude Code with OpenCode Zen, Go, or local providers as the API backend.

${pc.bold('Usage:')}
  anygate claude [options] [claude-flags]
  anygate claude --help
  anygate claude --version

${pc.bold('Options:')}
  --dry-run    Run the wizard but show a preview instead of launching Claude Code
  --setup      Hint: use anygate providers to add or manage providers
  --trace      Write debug logs to ~/.anygate/logs/ and show errors on exit
  --provider   Boot provider id (skip wizard when paired with --model or in print mode)
  --model      Boot model id (skip wizard when paired with --provider or in print mode)
  --help       Show this command help
  --version    Show version

${pc.bold('Providers:')}
  Cloud (Zen/Go)  Requires OPENCODE_API_KEY — get one at https://opencode.ai/auth
  Registry        Configure with anygate providers add or import (Groq, Mistral,
                  Nvidia, DeepSeek, OpenAI, custom endpoints, etc.).

${pc.bold('Model switching:')}
  Run anygate models to save favorites (max ${MAX_MODEL_CATALOG}).
  When favorites exist, launch starts a multi-route proxy and Claude Code /model
  lists your starting model plus favorites for live switching.
  With no favorites, launch uses a single model as before.

${pc.bold('Note:')}
  Claude Code may save the launched model to ~/.claude/settings.json.
  Bare claude later can still show that model — reset with claude --model sonnet.

${pc.bold('Examples:')}
  anygate claude
  anygate claude -c
  anygate claude --resume abc-123
  anygate claude abc-123
  anygate claude --dry-run -c
  anygate claude --setup
  anygate claude --trace --resume abc-123
  anygate claude --provider groq --model llama-3.3-70b-versatile
  anygate claude --provider groq --model llama-3.3-70b-versatile -p "review this file"
  anygate claude -- --print "hello"
  anygate claude -- --dangerously-skip-permissions`;
}

export function serverHelpText(): string {
  return `${pc.bold('anygate server')} v${VERSION}
Run a foreground API gateway for registry providers, Zen/Go, or Vertex AI.

${pc.bold('Usage:')}
  anygate server
  anygate server --quick
  anygate server --listen network --password <password>
  anygate server --vertex
  anygate server --help
  anygate server --version

${pc.bold('Options:')}
  --quick, --saved             Start immediately from saved/default settings
  --listen local|network       One-run listen mode override
  --providers all|favorites|id1,id2
                               One-run provider catalog override
  --free-only, --no-free-only  One-run free-model filter override
  --mask-gateway-ids           Mask provider names in Anthropic model ids
  --no-mask-gateway-ids        Keep provider names in Anthropic model ids
  --password <value>           One-run network-mode server password
  --vertex                     Use Claude on Google Vertex AI

${pc.bold('Behavior:')}
  Default: interactive wizard for exposed providers, discovery id masking (for
  Claude Desktop / Cowork), optional favorites-only catalog, then listen mode.
  Quick mode skips prompts and uses saved settings. Any one-run option also
  starts without prompts. Non-interactive stdin uses quick mode automatically.
  Network quick mode requires a saved password or --password.
  --vertex: Anthropic-compatible gateway to Claude on Google Vertex AI using
  local gcloud Application Default Credentials (no OpenCode API key).
  Binds to port 17645. Network mode asks for a server password.

${pc.bold('Vertex env:')}
  ANTHROPIC_VERTEX_PROJECT_ID or GOOGLE_CLOUD_PROJECT — your GCP project
  GOOGLE_CLOUD_LOCATION or CLOUD_ML_REGION — region (default: global)
  Optional catalog: ~/.anygate/vertex-models.json (see assets/vertex-models.example.json)

${pc.bold('Endpoints:')}
  Anthropic-compatible:  ANTHROPIC_BASE_URL=http://127.0.0.1:17645/anthropic
  OpenAI-compatible:     OPENAI_BASE_URL=http://127.0.0.1:17645/openai/v1
  API key: use anything locally; use the server password in network mode.`;
}

export function modelsHelpText(): string {
  return `${pc.bold('anygate favorites')} v${VERSION}
Manage favorite models for mid-session switching.

${pc.bold('Usage:')}
  anygate favorites
  anygate favorites --agy
  anygate models
  anygate favorites --help
  anygate favorites --version

${pc.bold('Behavior:')}
  Opens an interactive manager to add or remove favorites.
  Search all providers at once (paginated results) or browse one provider at a time.
  Pick from Zen, Go, or any provider in your registry.
  Global favorites are saved to ~/.anygate/config.json (max ${MAX_MODEL_CATALOG}).
  --agy manages Antigravity CLI favorites only (max 6).

${pc.bold('How it works:')}
  Claude/Codex/Gemini/server use the global favorites list.
  Favorites appear in supported /model switch menus.
  anygate agy, antigravity, and antigravity-ide use the Antigravity favorites
  list so the limited native switch slots stay predictable: one selected launch
  model plus up to six Antigravity favorites.

${pc.bold('Examples:')}
  anygate favorites
  anygate favorites --agy
  anygate claude    # switch menu active when favorites are set`;
}

export function antigravityCliHelpText(): string {
  return `${pc.bold('anygate agy')} v${VERSION}
Launch Antigravity CLI with anygate provider registry.

${pc.bold('Usage:')}
  anygate agy [options] [agy-flags]
  anygate agy --help
  anygate agy --version

${pc.bold('Options:')}
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

${pc.bold('How it works:')}
  Starts a local Cloud Code gateway, points agy at it via CLOUD_CODE_URL,
  and injects anygate models into Antigravity's native model picker.
  All Cloud Code traffic routes through anygate — no Google Cloud Code upstream.

${pc.bold('Examples:')}
  anygate agy
  anygate agy --provider zen --model deepseek-v4-flash-free
  anygate agy -p "fix this bug"`;
}

export function antigravityIdeHelpText(): string {
  return `${pc.bold('anygate antigravity-ide')} v${VERSION}
Launch Antigravity IDE with anygate provider registry.

${pc.bold('Usage:')}
  anygate antigravity-ide [options]
  anygate antigravity-ide --help
  anygate antigravity-ide --version

${pc.bold('Options:')}
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

${pc.bold('How it works:')}
  Creates an isolated anygate-managed IDE profile, starts a local Cloud Code
  gateway, and injects anygate models into Antigravity's native picker.
  The normal IDE profile is never modified.

${pc.bold('Platform:')}
  macOS (Apple Silicon) — other platforms coming after testing.

${pc.bold('Examples:')}
  anygate antigravity-ide
  anygate antigravity-ide --provider zen --model deepseek-v4-flash-free`;
}

export function antigravityAppHelpText(): string {
  return `${pc.bold('anygate antigravity')} v${VERSION}
Launch Antigravity with anygate provider registry.

${pc.bold('Usage:')}
  anygate antigravity [options]
  anygate antigravity --help
  anygate antigravity --version

${pc.bold('Options:')}
  --provider <id>    Use a specific provider (skip picker)
  --model <id>       Use a specific model (skip picker)
  --trace            Write debug log to /tmp/anygate-debug.log
  -h, --help         Show this help
  -v, --version      Show version

${pc.bold('How it works:')}
  Creates an isolated anygate-managed Antigravity profile, starts a local Cloud
  Code gateway, and injects anygate models into Antigravity's native picker.
  The normal Antigravity profile is never modified.

${pc.bold('Favorites:')}
  Uses the same Antigravity favorites list as anygate favorites --agy:
  up to six saved favorites plus the selected launch model.

${pc.bold('Platform:')}
  macOS (Apple Silicon) — other platforms coming after testing.

${pc.bold('Examples:')}
  anygate antigravity
  anygate antigravity --provider zen --model deepseek-v4-flash-free`;
}

export async function main(args: string[] = process.argv.slice(2)): Promise<number> {
  const parsed = parseArgs(args);

  if (process.stdout.isTTY) {
    printAsciiBanner();
  }

  // Always surface an update signal for lower-version users, regardless of TTY.
  // When output is piped/non-interactive we write to stderr so we don't corrupt
  // any machine-readable stdout the caller may be parsing.
  const update = await checkForUpdates();
  if (update.updateAvailable && update.latestVersion) {
    const notice = `\n${formatUpdateNotification(update.currentVersion, update.latestVersion)}\n`;
    if (process.stdout.isTTY) console.log(notice);
    else console.error(notice);
  }

  if (parsed.error) {
    console.error(pc.red(`\nError: ${parsed.error}\n`));
    printHelp(rootHelpText());
    return 1;
  }

  if (!parsed.showVersion && !parsed.showAi) {
    refreshModelsDevCacheAsync();
  }

  if (parsed.command === 'root') {
    if (parsed.showAi) {
      if (parsed.aiInstall) {
        return printAiInstallResult(installAiDoc({ force: parsed.aiInstallForce }));
      }
      console.log(generateAiDoc());
      return 0;
    }
    if (parsed.showVersion) {
      console.log(VERSION);
    } else {
      printHelp(rootHelpText());
    }
    return 0;
  }

  if (parsed.showVersion) {
    console.log(VERSION);
    return 0;
  }

  if (parsed.showHelp) {
    // Print help based on command
    const helpTexts: Record<string, () => string> = {
      claude: claudeHelpText,
      server: serverHelpText,
      models: modelsHelpText,
      agy: antigravityCliHelpText,
      'antigravity-ide': antigravityIdeHelpText,
      antigravity: antigravityAppHelpText,
      'codex-app': codexAppHelpText,
      chatgpt: codexAppHelpText,
      'claude-app': claudeAppHelpText,
    };
    const helpFn = helpTexts[parsed.command];
    if (helpFn) {
      printHelp(helpFn());
    } else if (parsed.command === 'codex') {
      console.log(codexHelpText());
    } else if (parsed.command === 'gemini') {
      console.log(geminiHelpText());
    } else {
      printHelp(rootHelpText());
    }
    return 0;
  }

  // Dispatch to command handlers
  return dispatchCommand(parsed);
}

function isCliEntryPoint(): boolean {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
}

if (isCliEntryPoint()) {
  main().then((exitCode) => {
    process.exit(exitCode);
  }).catch((err: unknown) => {
    if (err === Symbol.for('clack:cancel')) {
      process.exit(0);
    }
    console.error(pc.red('\nUnexpected error:'), err);
    process.exit(1);
  });
}