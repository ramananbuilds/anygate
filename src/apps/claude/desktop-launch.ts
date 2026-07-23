// Find, open, quit, and restart the Claude Desktop app (macOS + Windows).
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { AppLauncher } from '../shared/app-launcher.js';
import * as p from '@clack/prompts';

const CLAUDE_BUNDLE_ID = 'com.anthropic.claudefordesktop';

export class ClaudeAppLauncher extends AppLauncher {
  readonly appName = 'Claude Desktop';
  readonly bundleId = CLAUDE_BUNDLE_ID;
  readonly darwinAppNames = ['Claude'];
  readonly winAppNames = ['Claude'];
  readonly winInstallBases = ['Claude'];
  readonly darwinAppBundleNames = ['Claude.app'];
  readonly winExeNames = ['Claude.exe'];
  readonly configOverrideKey = 'claude-app';

  protected findDarwinAppExtra(): string | null {
    try {
      const out = this.run(`mdfind "kMDItemCFBundleIdentifier == '${CLAUDE_BUNDLE_ID}'"`);
      const first = out.split('\n').map(l => l.trim()).find(Boolean);
      return first && existsSync(first) ? first : null;
    } catch {
      return null;
    }
  }

  /** Search for UWP/Windows Store version via Get-StartApps */
  protected findWinAppExtra(): string | null {
    try {
      const appId = this.runPowerShell(
        `(Get-StartApps | Where-Object { $_.Name -eq 'Claude' -or $_.Name -like 'Claude*' } | Select-Object -First 1 -ExpandProperty AppID)`
      );
      if (appId) return `shell:AppsFolder\\${appId}`;
    } catch { /* ignore */ }
    return null;
  }

  getInstallHint(): string {
    return 'Claude Desktop App not found. Please install it first.';
  }
}

// Backwards-compatible function exports
const launcher = new ClaudeAppLauncher();

export function claudeAppSupported(): void {
  if (process.platform !== 'darwin' && process.platform !== 'win32') {
    throw new Error('Claude Desktop launch is supported on macOS and Windows only.');
  }
}

import { getAppPathOverride } from '../../core/config.js';

export function findClaudeApp(): string | null {
  const override = getAppPathOverride('claude-app');
  if (override && existsSync(override)) return override;

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
      const out = execSync(`mdfind "kMDItemCFBundleIdentifier == '${CLAUDE_BUNDLE_ID}'"`, {
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

export async function findClaudeAppAsync(): Promise<string | null> {
  return launcher.findApp();
}

export function isClaudeAppRunning(): boolean {
  return launcher.isRunning();
}

export function quitClaudeAppGracefully(): void {
  launcher.quitGracefully();
}

export async function waitForQuit(timeoutMs: number): Promise<boolean> {
  return launcher.waitForQuit(timeoutMs);
}

export async function openClaudeApp(): Promise<void> {
  const appPath = await launcher.findApp();
  if (!appPath) throw new Error(launcher.getInstallHint());
  launcher.openApp(appPath);
}

export async function launchOrRestartClaudeApp(
  prompt = 'Restart Claude Desktop to apply anygate settings?',
): Promise<void> {
  return launcher.launchOrRestart(prompt);
}