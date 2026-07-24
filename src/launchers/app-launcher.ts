import { execFileSync, execSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { getAppPathOverride } from '../storage/config.js';

/**
 * Abstract base class for desktop app launchers.
 * Handles common logic: find app, check running, quit gracefully, force quit, restart.
 * Subclasses provide platform-specific details via abstract properties/methods.
 */
export abstract class AppLauncher {
  abstract readonly appName: string;
  abstract readonly bundleId: string;
  abstract readonly darwinAppNames: string[];
  abstract readonly winAppNames: string[];
  abstract readonly winInstallBases: string[];
  abstract readonly darwinAppBundleNames: string[];
  abstract readonly winExeNames: string[];
  abstract readonly configOverrideKey: string;

  protected findDarwinAppExtra(): string | null {
    return null;
  }

  protected findWinAppExtra(): string | null {
    return null;
  }

  protected darwinQuitCommand(): string {
    return `osascript -e 'tell application id "${this.bundleId}" to quit'`;
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

  protected getLaunchArgs(_profileDir: string, _extraArgs: string[]): string[] {
    return [];
  }

  protected abstract getInstallHint(): string;

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected run(cmd: string, encoding: BufferEncoding = 'utf8'): string {
    return execSync(cmd, { encoding, stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  }

  protected runPowerShell(script: string): string {
    return this.run(`powershell.exe -NoProfile -Command ${JSON.stringify(script)}`);
  }

  findApp(): string | null {
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
    const override = getAppPathOverride(this.configOverrideKey);
    return override && existsSync(override) ? override : null;
  }

  protected findDarwinApp(): string | null {
    for (const bundleName of this.darwinAppBundleNames) {
      const paths = [
        `/Applications/${bundleName}`,
        join(homedir(), 'Applications', bundleName),
      ];
      for (const path of paths) {
        if (existsSync(path)) return path;
      }
    }
    return this.findDarwinAppExtra();
  }

  protected findWinApp(): string | null {
    const localAppData = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local');

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

    return this.findWinAppExtra();
  }

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

  async waitForQuit(timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (process.platform === 'win32') {
        if (this.winMatchingPids().length === 0) return true;
      } else if (!this.darwinIsRunning()) {
        return true;
      }
      await this.sleep(200);
    }
    return process.platform === 'win32' ? this.winMatchingPids().length === 0 : !this.darwinIsRunning();
  }

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
        spawn('cmd.exe', ['/c', 'start', '', path], { stdio: 'ignore', detached: true }).unref();
      } else {
        this.runPowerShell(`Start-Process -FilePath '${path.replace(/'/g, "''")}'`);
      }
    }
  }

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
      this.openApp('');
    }
  }
}
