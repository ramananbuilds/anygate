// Find, open, quit, and restart the ChatGPT desktop app / Codex mode (macOS + Windows).
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { AppLauncher } from '../shared/app-launcher.js';
import * as p from '@clack/prompts';

const CODEX_BUNDLE_ID = 'com.openai.codex';
// OpenAI merged the Codex desktop app into the ChatGPT desktop app (2026-07-09).
// The bundle id is unchanged, but the app is now named "ChatGPT" on disk and
// as a running process. Check both names — some users may still be on the
// pre-merge "Codex" build until they update.
const DARWIN_APP_NAMES = ['ChatGPT', 'Codex'];
// Confirmed on macOS only (see DARWIN_APP_NAMES above); the Windows renamed
// exe/process name is not yet verified against a real install. Mirrors the
// confirmed macOS rename (Codex -> ChatGPT, same install-folder convention)
// as a best-effort guess until confirmed on a real Windows install.
const WIN_APP_NAMES = ['ChatGPT', 'Codex'];

export class CodexAppLauncher extends AppLauncher {
  readonly appName = 'ChatGPT Desktop';
  readonly bundleId = CODEX_BUNDLE_ID;
  readonly darwinAppNames = DARWIN_APP_NAMES;
  readonly winAppNames = WIN_APP_NAMES;
  readonly winInstallBases = ['ChatGPT', 'Codex', 'OpenAI ChatGPT', 'OpenAI Codex', 'OpenAI'];
  readonly darwinAppBundleNames = ['ChatGPT.app', 'Codex.app'];
  readonly winExeNames = ['ChatGPT.exe', 'Codex.exe'];
  readonly configOverrideKey = 'codex-app';

  protected findDarwinAppExtra(): string | null {
    try {
      const out = this.run(`mdfind "kMDItemCFBundleIdentifier == '${CODEX_BUNDLE_ID}'"`);
      const first = out.split('\n').map(l => l.trim()).find(Boolean);
      return first && existsSync(first) ? first : null;
    } catch {
      return null;
    }
  }

  protected winQuitGracefulCommand(): string {
    const nameFilter = this.winAppNames.map(name => `'${name}'`).join(',');
    return `Get-Process ${nameFilter} -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | ForEach-Object { [void]$_.CloseMainWindow() }`;
  }

  protected winForceQuitCommand(): string {
    const pids = this.winMatchingPids();
    if (pids.length === 0) return '';
    return `Stop-Process -Id ${pids.join(',')} -Force -ErrorAction SilentlyContinue`;
  }

  getInstallHint(): string {
    return 'ChatGPT Desktop app not found. Install from https://developers.openai.com/codex/app then run anygate codex-app again.';
  }
}

// Backwards-compatible function exports
const launcher = new CodexAppLauncher();

export function codexAppSupported(): void {
  if (process.platform !== 'darwin' && process.platform !== 'win32') {
    throw new Error('Codex App launch is supported on macOS and Windows only.');
  }
}

export function findCodexApp(): string | null {
  // Sync version for backward compatibility (e.g., native-launcher.ts)
  // Note: config override is handled by the async findApp() method
  if (process.platform === 'darwin') {
    for (const bundleName of launcher.darwinAppBundleNames) {
      const paths = [
        `/Applications/${bundleName}`,
        join(homedir(), 'Applications', bundleName),
      ];
      for (const path of paths) {
        if (existsSync(path)) return path;
      }
    }
    // mdfind fallback
    try {
      const out = execSync(`mdfind "kMDItemCFBundleIdentifier == '${CODEX_BUNDLE_ID}'"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      const first = out.split('\n').map(l => l.trim()).find(Boolean);
      if (first && existsSync(first)) return first;
    } catch { /* ignore */ }
  }
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');
    for (const base of launcher.winInstallBases) {
      for (const exe of launcher.winExeNames) {
        const paths = [
          join(localAppData, 'Programs', base, exe),
          join(localAppData, base, exe),
        ];
        for (const path of paths) {
          try {
            if (existsSync(path)) return path;
          } catch { /* ignore */ }
        }
      }
    }
  }
  return null;
}

export async function findCodexAppAsync(): Promise<string | null> {
  return launcher.findApp();
}

export function isCodexAppRunning(): boolean {
  return launcher.isRunning();
}

export function quitCodexAppGracefully(): void {
  launcher.quitGracefully();
}

export async function waitForQuit(timeoutMs: number): Promise<boolean> {
  return launcher.waitForQuit(timeoutMs);
}

export async function openCodexApp(): Promise<void> {
  const appPath = await launcher.findApp();
  if (!appPath) throw new Error(launcher.getInstallHint());
  launcher.openApp(appPath);
}

export async function launchOrRestartCodexApp(
  prompt = 'Restart ChatGPT Desktop to apply anygate settings?',
): Promise<void> {
  return launcher.launchOrRestart(prompt);
}

export function codexAppInstallHint(): string {
  return launcher.getInstallHint();
}