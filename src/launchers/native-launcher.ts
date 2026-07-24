import { chmodSync, existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAppPathOverride } from '../storage/config.js';
import { findBinaryOnPath } from '../apps/shared/binary-lookup.js';
import { findClaudeApp } from '../apps/claude/desktop-launch.js';
import { findCodexApp } from '../apps/codex/app-launch.js';

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

export interface AppInfo {
  id: string;
  name: string;
  type: 'cli' | 'app';
  installed: boolean;
  path: string | null;
  pathSource: 'auto' | 'override' | null;
  gatewayCommand: string;
  launchCommand: string | null;
  /** Shell command to install this app (CLIs). Absent for desktop apps. */
  installHint?: string;
  /** Vendor download page for desktop apps. Absent for CLIs. */
  installUrl?: string;
}

export interface GatewayLaunchOptions {
  providerId?: string;
  modelId?: string;
  favorites?: boolean;
  /** Launch the full favorites catalog (emits bare --favorites) instead of resolving to the first favorite. */
  favoritesCatalog?: boolean;
  cwd?: string;
  trace?: boolean;
}

interface SupportedAppDefinition {
  id: string;
  name: string;
  type: 'cli' | 'app';
  detectId: string;
  gatewayCommand: string;
  /** Shell command to install this app (CLIs). */
  installHint?: string;
  /** Vendor download page for desktop apps. */
  installUrl?: string;
}

const SUPPORTED_APPS: SupportedAppDefinition[] = [
  { id: 'claude', name: 'Claude Code CLI', type: 'cli', detectId: 'claude', gatewayCommand: 'claude', installHint: 'npm install -g @anthropic-ai/claude-code' },
  { id: 'codex', name: 'Codex CLI', type: 'cli', detectId: 'codex', gatewayCommand: 'codex', installHint: 'npm install -g @openai/codex' },
  { id: 'gemini', name: 'Gemini CLI', type: 'cli', detectId: 'gemini', gatewayCommand: 'gemini', installHint: 'npm install -g @google/gemini-cli' },
  { id: 'agy', name: 'Antigravity CLI', type: 'cli', detectId: 'agy', gatewayCommand: 'agy', installHint: 'npm install -g @google/antigravity-cli' },
  {
    id: 'antigravity',
    name: 'Antigravity (App)',
    type: 'app',
    detectId: 'antigravity',
    gatewayCommand: 'antigravity',
    installUrl: 'https://antigravity.google.com',
  },
  {
    id: 'claude-app',
    name: 'Claude Desktop',
    type: 'app',
    detectId: 'claude-app',
    gatewayCommand: 'claude-app',
    installUrl: 'https://claude.ai/download',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Desktop',
    type: 'app',
    detectId: 'codex-app',
    gatewayCommand: 'chatgpt',
    installUrl: 'https://chatgpt.com/download',
  },
];

const CLI_FALLBACK_PATHS: Record<string, string[]> = {
  claude: isWindows
    ? [
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'claude.cmd'),
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'claude'),
        join(homedir(), 'AppData', 'Roaming', 'npm', 'claude.cmd'),
      ]
    : [
        join(homedir(), '.local', 'bin', 'claude'),
        join(homedir(), '.npm', 'bin', 'claude'),
        '/usr/local/bin/claude',
        '/opt/homebrew/bin/claude',
      ],
  codex: isWindows
    ? [
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'codex.cmd'),
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'codex'),
        join(homedir(), 'AppData', 'Roaming', 'npm', 'codex.cmd'),
      ]
    : [
        join(homedir(), '.local', 'bin', 'codex'),
        join(homedir(), '.npm', 'bin', 'codex'),
        '/usr/local/bin/codex',
        '/opt/homebrew/bin/codex',
      ],
  gemini: isWindows
    ? [
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'gemini.cmd'),
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'gemini'),
        join(homedir(), 'AppData', 'Roaming', 'npm', 'gemini.cmd'),
      ]
    : [
        join(homedir(), '.local', 'bin', 'gemini'),
        join(homedir(), '.npm', 'bin', 'gemini'),
        '/usr/local/bin/gemini',
        '/opt/homebrew/bin/gemini',
      ],
  agy: isWindows
    ? [
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'agy.cmd'),
        join(process.env['APPDATA'] ?? homedir(), 'npm', 'agy'),
        join(homedir(), 'AppData', 'Roaming', 'npm', 'agy.cmd'),
      ]
    : [
        join(homedir(), '.local', 'bin', 'agy'),
        join(homedir(), '.npm', 'bin', 'agy'),
        '/usr/local/bin/agy',
        '/opt/homebrew/bin/agy',
      ],
};

const DARWIN_APP_FALLBACKS: Record<string, string[]> = {
  antigravity: [
    '/Applications/Antigravity.app',
    join(homedir(), 'Applications', 'Antigravity.app'),
  ],
  'claude-app': [
    '/Applications/Claude.app',
    join(homedir(), 'Applications', 'Claude.app'),
  ],
  'codex-app': [
    '/Applications/ChatGPT.app',
    '/Applications/Codex.app',
    join(homedir(), 'Applications', 'ChatGPT.app'),
    join(homedir(), 'Applications', 'Codex.app'),
  ],
};

function detectApp(def: SupportedAppDefinition): AppInfo {
  const override = getAppPathOverride(def.detectId);

  if (override) {
    const installed = existsSync(override);
    return {
      id: def.id,
      name: def.name,
      type: def.type,
      installed,
      path: installed ? override : null,
      pathSource: installed ? 'override' : null,
      gatewayCommand: def.gatewayCommand,
      launchCommand: installed ? buildLaunchCommand(def.gatewayCommand) : null,
      installHint: def.installHint,
      installUrl: def.installUrl,
    };
  }

  let foundPath: string | null = null;

  if (def.type === 'cli') {
    foundPath = findBinaryOnPath(def.detectId, CLI_FALLBACK_PATHS[def.detectId] ?? []);
  } else if (def.type === 'app') {
    if (def.id === 'claude-app') {
      foundPath = findClaudeApp();
    } else if (def.id === 'chatgpt') {
      foundPath = findCodexApp();
    } else if (isMac) {
      const candidates = DARWIN_APP_FALLBACKS[def.id] ?? [];
      for (const p of candidates) {
        if (existsSync(p)) {
          foundPath = p;
          break;
        }
      }
    }
  }

  const installed = foundPath !== null;

  return {
    id: def.id,
    name: def.name,
    type: def.type,
    installed,
    path: foundPath,
    pathSource: installed ? 'auto' : null,
    gatewayCommand: def.gatewayCommand,
    launchCommand: installed ? buildLaunchCommand(def.gatewayCommand) : null,
    installHint: def.installHint,
    installUrl: def.installUrl,
  };
}

export function detectInstalledApps(): AppInfo[] {
  return SUPPORTED_APPS.map(detectApp);
}

export function buildLaunchCommand(
  gatewayCommand: string,
  opts: GatewayLaunchOptions = {},
): string {
  const parts = ['anygate', gatewayCommand];

  if (opts.favoritesCatalog) {
    parts.push('--favorites');
  } else if (opts.favorites) {
    parts.push('--favorites');
  } else if (opts.providerId && opts.modelId) {
    parts.push('--provider', opts.providerId, '--model', opts.modelId);
  } else if (opts.modelId) {
    parts.push('--model', opts.modelId);
  }

  if (opts.trace) {
    parts.push('--trace');
  }

  if (opts.cwd) {
    parts.push('--cwd', opts.cwd);
  }

  return parts.join(' ');
}

export function createLauncherScript(
  gatewayCommand: string,
  opts: GatewayLaunchOptions = {},
): { scriptPath: string; cleanup: () => void } {
  const commandStr = buildLaunchCommand(gatewayCommand, opts);

  const dir = mkdtempSync(join(tmpdir(), 'anygate-launch-'));

  if (isWindows) {
    const scriptPath = join(dir, 'launch.bat');
    const content = `@echo off\ncd /d "${opts.cwd ?? process.cwd()}"\n${commandStr}\n`;
    writeFileSync(scriptPath, content, 'utf8');
    return {
      scriptPath,
      cleanup: () => {
        try {
          const { rmSync } = require('node:fs');
          rmSync(dir, { recursive: true, force: true });
        } catch { /* ignore */ }
      },
    };
  }

  const scriptPath = join(dir, 'launch.sh');
  const content = `#!/usr/bin/env bash\ncd "${opts.cwd ?? process.cwd()}"\n${commandStr}\n`;
  writeFileSync(scriptPath, content, { encoding: 'utf8', mode: 0o755 });
  chmodSync(scriptPath, 0o755);

  return {
    scriptPath,
    cleanup: () => {
      try {
        const { rmSync } = require('node:fs');
        rmSync(dir, { recursive: true, force: true });
      } catch { /* ignore */ }
    },
  };
}

export function openInTerminal(
  gatewayCommand: string,
  opts: GatewayLaunchOptions = {},
): void {
  const { execSync, spawn } = require('node:child_process');
  const { scriptPath } = createLauncherScript(gatewayCommand, opts);

  if (isMac) {
    const script = `tell application "Terminal" to do script "${scriptPath}"`;
    execSync(`osascript -e ${JSON.stringify(script)}`);
    return;
  }

  if (isWindows) {
    try {
      spawn('wt.exe', ['cmd.exe', '/c', scriptPath], { detached: true, stdio: 'ignore' }).unref();
      return;
    } catch { /* wt.exe not available, fall back to start cmd */ }

    spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/c', scriptPath], {
      detached: true,
      stdio: 'ignore',
    }).unref();
    return;
  }

  const linuxTerminals = ['gnome-terminal', 'konsole', 'xfce4-terminal', 'xterm'];
  for (const term of linuxTerminals) {
    try {
      if (term === 'gnome-terminal') {
        spawn(term, ['--', 'bash', '-c', `${scriptPath}; exec bash`], { detached: true, stdio: 'ignore' }).unref();
        return;
      }
      if (term === 'konsole') {
        spawn(term, ['-e', 'bash', '-c', `${scriptPath}; exec bash`], { detached: true, stdio: 'ignore' }).unref();
        return;
      }
      if (term === 'xfce4-terminal' || term === 'xterm') {
        spawn(term, ['-e', `bash -c "${scriptPath}; exec bash"`], { detached: true, stdio: 'ignore' }).unref();
        return;
      }
    } catch { /* try next terminal */ }
  }

  throw new Error('No supported terminal emulator found (wt.exe, gnome-terminal, konsole, xfce4-terminal, xterm)');
}
