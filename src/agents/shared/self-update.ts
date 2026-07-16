// src/agents/shared/self-update.ts
import pc from 'picocolors';
import { spawn, execFileSync } from 'node:child_process';
import * as p from '@clack/prompts';
import { checkForUpdates, UPDATE_COMMAND } from './update-check.js';
import { VERSION } from '../../../src/core/constants.js';

/** Resolve the npm binary, accounting for Windows (npm.cmd). */
function resolveNpmBin(): string {
  if (process.platform === 'win32') {
    try {
      const found = execFileSync('where', ['npm'], { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .split(/\r?\n/)
        .map(s => s.trim())
        .find(s => s.toLowerCase().endsWith('.cmd') || s.toLowerCase().endsWith('npm'));
      if (found) return found;
    } catch {
      // fall through to default
    }
    return 'npm.cmd';
  }
  return 'npm';
}

/**
 * Run `anygate update` — interactive self-upgrade.
 * Reuses checkForUpdates() + UPDATE_COMMAND. Respects --dry-run (prints the
 * command it would run but never spawns npm).
 */
export async function runUpdateCommand(dryRun: boolean): Promise<number> {
  const update = await checkForUpdates();

  if (!update.updateAvailable || !update.latestVersion) {
    p.log.success(`anygate is up to date (v${VERSION}).`);
    return 0;
  }

  p.log.info(
    `Update available: ${pc.cyan(`v${update.currentVersion}`)} → ${pc.green(`v${update.latestVersion}`)}`,
  );

  const npmBin = resolveNpmBin();

  if (dryRun) {
    p.log.step(`Would run: ${pc.bold(`${npmBin} install -g anygate@latest`)}`);
    p.log.warn('Dry run — no changes made.');
    return 0;
  }

  const confirmed = await p.confirm({
    message: `Install anygate@${update.latestVersion} now?`,
    initialValue: false,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.log.info(`Update skipped. Run ${pc.cyan(UPDATE_COMMAND)} later if you change your mind.`);
    return 0;
  }

  p.log.info(`Running ${pc.cyan(`${npmBin} install -g anygate@latest`)}...`);

  const child = spawn(npmBin, ['install', '-g', 'anygate@latest'], {
    stdio: 'inherit',
    windowsHide: true,
  });

  return new Promise<number>((resolve) => {
    child.on('error', (err) => {
      p.log.error(`Failed to start npm: ${err instanceof Error ? err.message : String(err)}`);
      resolve(1);
    });
    child.on('close', (code) => {
      if (code === 0) {
        p.log.success('anygate updated. Restart your shell or re-run anygate to use the new version.');
      } else {
        p.log.error(`Update failed (exit ${code}). Try ${pc.cyan(UPDATE_COMMAND)} manually.`);
      }
      resolve(code ?? 1);
    });
  });
}
