import { spawn } from 'node:child_process';
import type { BaseLaunchOptions, LaunchProcessResult } from './shared.js';

export function launchLinuxApp(binPath: string, options: BaseLaunchOptions = {}): LaunchProcessResult {
  try {
    const child = spawn(binPath, options.args ?? [], {
      cwd: options.cwd ?? process.cwd(),
      env: { ...process.env, ...options.env },
      detached: options.detached ?? true,
      stdio: 'ignore',
    });
    if (options.detached) child.unref();
    return { pid: child.pid, success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
