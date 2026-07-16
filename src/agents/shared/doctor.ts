// src/agents/shared/doctor.ts
import pc from 'picocolors';
import { createServer } from 'node:net';
import { GATEWAY_PORT, CONFLICTING_ENV_VARS } from '../../../src/core/constants.js';
import {
  detectConflicts,
  isSecretServiceAvailable,
  readFromCredentialStore,
} from '../../../src/core/env.js';
import { gateIntro, gateOutro, printPanel } from './ui.js';

interface CheckResult {
  label: string;
  ok: boolean;
  detail: string;
  /** A failed critical check flips the overall exit code to 1. */
  critical: boolean;
}

function nodeMajor(): number {
  const raw = process.versions.node.split('.')[0] ?? '0';
  return Number.parseInt(raw, 10) || 0;
}

function checkPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    // Safety net if close never fires.
    const timer = setTimeout(() => resolve(true), 1500);
    if (typeof timer.unref === 'function') timer.unref();
  });
}

function line(ok: boolean, label: string, detail = ''): string {
  const mark = ok ? pc.green('✓') : pc.red('✗');
  const text = detail ? `${label} ${pc.dim(`— ${detail}`)}` : label;
  return `  ${mark}  ${text}`;
}

export async function runDoctorCommand(_dryRun: boolean): Promise<number> {
  gateIntro('Doctor');

  const checks: CheckResult[] = [];

  // 1. Node version
  const major = nodeMajor();
  checks.push({
    label: 'Node.js version',
    ok: major >= 18,
    detail: `v${process.versions.node} (requires ≥ 18)`,
    critical: true,
  });

  // 2. OS secure credential store
  let keyringOk = false;
  let keyringDetail = '';
  try {
    keyringOk = await isSecretServiceAvailable();
    keyringDetail = keyringOk ? 'credential store reachable' : 'not available on this system';
  } catch (err) {
    keyringDetail = err instanceof Error ? err.message : String(err);
  }
  checks.push({
    label: 'Secure credential store',
    ok: keyringOk,
    detail: keyringDetail,
    critical: false,
  });

  // 3. OpenCode API key present (env → keyring)
  let keyPresent = false;
  let keyDetail = '';
  try {
    const key = await readFromCredentialStore();
    keyPresent = Boolean(key?.trim());
    keyDetail = keyPresent ? 'OPENCODE_API_KEY found' : 'not set (get one at https://opencode.ai/auth)';
  } catch (err) {
    keyDetail = err instanceof Error ? err.message : String(err);
  }
  checks.push({
    label: 'OpenCode API key',
    ok: keyPresent,
    detail: keyDetail,
    critical: false,
  });

  // 4. Gateway port free
  const portFree = await checkPortFree(GATEWAY_PORT);
  checks.push({
    label: `Gateway port ${GATEWAY_PORT}`,
    ok: portFree,
    detail: portFree ? 'available' : 'in use — `anygate server` will fail to bind',
    critical: false,
  });

  // 5. Conflicting env vars
  const conflicts = detectConflicts();
  checks.push({
    label: 'Conflicting env vars',
    ok: conflicts.length === 0,
    detail: conflicts.length === 0
      ? `none of the ${CONFLICTING_ENV_VARS.length} known conflicts set`
      : `${conflicts.length} set: ${conflicts.map(c => c.name).join(', ')}`,
    critical: false,
  });

  const failedCritical = checks.filter(c => !c.ok && c.critical);
  const failedNonCritical = checks.filter(c => !c.ok && !c.critical);

  const reportLines = checks.map(c => line(c.ok, c.label, c.detail));
  reportLines.push('');
  reportLines.push(
    pc.dim('Antigravity note: macOS-only today. Windows/Linux app launches are') +
    pc.dim(' best-effort — see help for each agy/antigravity command.'),
  );

  printPanel('Environment check', reportLines);

  if (failedCritical.length > 0) {
    gateOutro('Problems found', pc.red(`${failedCritical.length} critical check(s) failed`));
    return 1;
  }

  if (failedNonCritical.length > 0) {
    gateOutro('Mostly OK', pc.yellow(`${failedNonCritical.length} non-critical warning(s)`));
    return 0;
  }

  gateOutro('All checks passed');
  return 0;
}
