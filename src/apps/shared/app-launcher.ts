import { execFileSync, execSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import * as p from '@clack/prompts';

/**
 * Abstract base class for desktop app launchers.
 * Handles common logic: find app, check running, quit gracefully, force quit, restart.
 * Subclasses provide platform-specific details via abstract properties/methods.
 */
export abstract class AppLauncher {
  // ========================================================================
  // Abstract properties that subclasses MUST implement
  // ========================================================================

  /** Display name for logging (e.g., "ChatGPT Desktop", "Claude Desktop", "Antigravity IDE") */
  abstract readonly appName: string;

  /** macOS bundle identifier (e.g., "com.openai.codex", "com.anthropic.claudefordesktop") */
  abstract readonly bundleId: string;

  /** App display names on macOS (e.g., ["ChatGPT", "Codex"] for pre/post rename) */
  abstract readonly darwinAppNames: string[];

  /** App display names on Windows (e.g., ["ChatGPT", "Codex"]) */
  abstract readonly winAppNames: string[];

  /** Windows install base directories to search (e.g., ["ChatGPT", "OpenAI ChatGPT"]) */
  abstract readonly winInstallBases: string[];

  /** macOS app bundle paths to check (relative to /Applications or ~/Applications) */
  abstract readonly darwinAppBundleNames: string[];

  /** Windows executable names (e.g., "ChatGPT.exe", "Codex.exe") */
  abstract readonly winExeNames: string[];

  /** Config override key for manual path override (e.g., "codex-app", "claude-app") */
  abstract readonly configOverrideKey: string;

  // ========================================================================
  // Abstract methods that subclasses MAY override
  // ========================================================================

  /** Additional macOS-specific find logic (e.g., mdfind). Return null to skip. */
  protected findDarwinAppExtra(): string | null {
    return null;
  }

  /** Additional Windows-specific find logic. Return null to skip. */
  protected findWinAppExtra(): string | null {
    return null;
  }

  /** Custom macOS quit command (default uses bundleId). Override for special cases. */
  protected darwinQuitCommand(): string {
    return `osascript -e 'tell application id "${this.bundleId}" to quit'`;
  }

  /** Custom Windows graceful quit command. Override for special cases. */
  protected winQuitGracefulCommand(): string {
    const nameFilter = this.winAppNames.map(name => `'${name}'`).join(',');
    return `Get-Process ${nameFilter} -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | ForEach-Object { [void]$_.CloseMainWindow() }`;
  }

  /** Custom Windows force quit command. Override for special cases. */
  protected winForceQuitCommand(): string {
    const pids = this.winMatchingPids();
    if (pids.length === 0) return '';
    return `Stop-Process -Id ${pids.join(',')} -Force -ErrorAction SilentlyContinue`;
  }

  /** Additional arguments to pass when launching the app (e.g., --user-data-dir). */
  protected getLaunchArgs(_profileDir: string, _extraArgs: string[]): string[] {
    return [];
  }

  /** Installation hint message when app not found. */
  protected abstract getInstallHint(): string;

  // ========================================================================
  // Shared implementation
  // ========================================================================

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected run(cmd: string, encoding: BufferEncoding = 'utf8'): string {
    return execSync(cmd, { encoding, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  }

  protected runPowerShell(script: string): string {
    return this.run(`powershell.exe -NoProfile -Command ${JSON.stringify(script)}`);
  }

  /** Find the app binary/installation path. */
  findApp(): string | null {
    // 1. Check config override first
    const override = this.getConfigOverride();
    if (override && existsSync(override)) return override;

    if (process.platform === 'darwin') {
      return this.findDarwinApp();
    }
    if (process.platform === 'win32') {
      return this.findWinApp();
    }
    return null;
  }

  protected getConfigOverride(): string | null {
    // Dynamic import to avoid circular deps
    const { getAppPathOverride } = require('../../core/config.js') as typeof import('../../core/config.js');
    const override = getAppPathOverride(this.configOverrideKey);
    return override && existsSync(override) ? override : null;
  }

  protected findDarwinApp(): string | null {
    // Check standard locations
    for (const bundleName of this.darwinAppBundleNames) {
      const paths = [
        `/Applications/${bundleName}`,
        join(homedir(), 'Applications', bundleName),
      ];
      for (const path of paths) {
        if (existsSync(path)) return path;
      }
    }
    // Try extra finder (e.g., mdfind)
    return this.findDarwinAppExtra();
  }

  protected findWinApp(): string | null {
    const localAppData = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');

    // Check known install bases
    for (const baseName of this.winInstallBases) {
      const base = join(localAppData, 'Programs', baseName);
      if (!existsSync(base)) continue;
      try {
        for (const dir of readdirSync(base)) {
          if (dir.startsWith('app-')) {
            for (const exeName of this.winExeNames) {
              const fullPath = join(base, dir, exeName);
              if (existsSync(fullPath) && statSync(fullPath).isFile()) {
                return fullPath;
              }
            }
          }
        }
      } catch { /* ignore */ }
    }

    // Check simpler paths
    for (const baseName of this.winInstallBases) {
      for (const exeName of this.winExeNames) {
        const paths = [
          join(localAppData, 'Programs', baseName, exeName),
          join(localAppData, baseName, exeName),
        ];
        for (const path of paths) {
          try {
            if (existsSync(path) && statSync(path).isFile()) return path;
          } catch { /* ignore */ }
        }
      }
    }

    // Try extra finder (e.g., Get-StartApps)
    return this.findWinAppExtra();
  }

  /** Check if the app is currently running. */
  isRunning(): boolean {
    if (process.platform === 'darwin') {
      return this.darwinIsRunning();
    }
    if (process.platform === 'win32') {
      return this.winMatchingPids().length > 0 || this.winHasWindow();
    }
    return false;
  }

  protected darwinIsRunning(): boolean {
    return this.darwinAppNames.some(name => {
      try {
        const out = this.run(`osascript -e 'tell application "System Events" to exists process "${name}"'`);
        return out.toLowerCase() === 'true';
      } catch {
        return false;
      }
    });
  }

  protected winMatchingPids(): number[] {
    try {
      const nameFilter = this.winAppNames.map(name => `Name = '${name}.exe'`).join(' OR ');
      const script = `$current = ${process.pid}; Get-CimInstance Win32_Process -Filter "${nameFilter}" | Where-Object { $_.ProcessId -ne $current } | Select-Object -ExpandProperty ProcessId`;
      const out = this.runPowerShell(script);
      return out.split(/\s+/).map(s => Number.parseInt(s, 10)).filter(n => Number.isFinite(n) && n > 0);
    } catch {
      return [];
    }
  }

  protected winHasWindow(): boolean {
    try {
      const nameFilter = this.winAppNames.map(name => `'${name}'`).join(',');
      const out = this.runPowerShell(
        `(Get-Process ${nameFilter} -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1).Id`,
      );
      return out.length > 0 && Number.isFinite(Number.parseInt(out, 10));
    } catch {
      return false;
    }
  }

  /** Quit the app gracefully (ask nicely). */
  quitGracefully(): void {
    if (process.platform === 'darwin') {
      try {
        this.run(this.darwinQuitCommand());
      } catch {
        // Ignore errors
      }
    } else if (process.platform === 'win32') {
      try {
        this.runPowerShell(this.winQuitGracefulCommand());
      } catch {
        // Ignore errors
      }
    }
  }

  /** Force-kill the app (if graceful quit didn't work). */
  forceQuit(): void {
    if (process.platform === 'win32') {
      const cmd = this.winForceQuitCommand();
      if (cmd) {
        try {
          this.runPowerShell(cmd);
        } catch {
          // Ignore errors
        }
      }
    }
  }

  /** Wait for the app to quit (checking process existence, not window). */
  async waitForQuit(timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      // Check actual process existence, not window visibility — apps that
      // minimize to the tray on close clear their window handle immediately
      // while staying alive, which would make this return early with the
      // old process (and its old config) still running.
      if (process.platform === 'win32') {
        if (this.winMatchingPids().length === 0) return true;
      } else if (!this.darwinIsRunning()) {
        return true;
      }
      await this.sleep(200);
    }
    return process.platform === 'win32' ? this.winMatchingPids().length === 0 : !this.darwinIsRunning();
  }

  /** Open the app at the given path. */
  openApp(path: string): void {
    if (process.platform === 'darwin') {
      if (path.endsWith('.app')) {
        this.run(`open ${JSON.stringify(path)}`);
      } else {
        this.run(`open -b ${this.bundleId}`);
      }
      return;
    }
    if (process.platform === 'win32') {
      if (path.startsWith('shell:AppsFolder\\')) {
        // cmd /c start avoids PowerShell backslash double-escaping issues with shell: URIs
        spawn('cmd.exe', ['/c', 'start', '', path], { stdio: 'ignore', detached: true }).unref();
      } else {
        this.runPowerShell(`Start-Process -FilePath '${path.replace(/'/g, "''")}'`);
      }
    }
  }

  /**
   * Launch or restart the app with the given prompt.
   * Template method: checks running, prompts, quits, waits, reopens.
   */
  async launchOrRestart(prompt: string): Promise<void> {
    const appPath = this.findApp();
    if (!this.isRunning()) {
      if (!appPath) {
        throw new Error(this.getInstallHint());
      }
      this.openApp(appPath);
      return;
    }

    const restart = await p.confirm({ message: prompt, initialValue: true });
    if (p.isCancel(restart) || !restart) {
      p.log.info(`Quit and reopen ${this.appName} when you are ready for the new model to take effect.`);
      return;
    }

    this.quitGracefully();

    if (!(await this.waitForQuit(5000))) {
      if (process.platform === 'win32') this.forceQuit();
      await this.waitForQuit(5000);
    }

    if (appPath) {
      this.openApp(appPath);
    } else {
      // Fallback to bundle ID / default launch
      this.openApp('');
    }
  }
}