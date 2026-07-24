import pc from 'picocolors';
import { createServer } from 'node:net';
import { GATEWAY_PORT, CONFLICTING_ENV_VARS } from '../config/constants.js';
import {
  detectConflicts,
  isSecretServiceAvailable,
  readFromCredentialStore,
} from '../config/env.js';
import { gateIntro, gateOutro, printPanel } from '../apps/shared/ui.js';

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

  const major = nodeMajor();
  checks.push({
    label: 'Node.js version',
    ok: major >= 18,
    detail: `v${process.versions.node} (requires ≥ 18)`,
    critical: true,
  });

  let keyringOk = false;
  let keyringDetail = '';
  const platform = process.platform;
  if (platform === 'darwin') {
    keyringOk = true;
    keyringDetail = 'macOS Keychain Service';
  } else if (platform === 'win32') {
    keyringOk = true;
    keyringDetail = 'Windows Credential Manager';
  } else if (platform === 'linux') {
    keyringOk = await isSecretServiceAvailable();
    keyringDetail = keyringOk ? 'Secret Service (GNOME Keyring / KWallet)' : 'Secret Service daemon unreachable';
  } else {
    keyringDetail = `Unsupported platform (${platform})`;
  }

  checks.push({
    label: 'Secure credential storage',
    ok: keyringOk,
    detail: keyringDetail,
    critical: false,
  });

  const storedKey = await readFromCredentialStore();
  checks.push({
    label: 'OpenCode API key',
    ok: Boolean(storedKey || process.env['OPENCODE_API_KEY']),
    detail: storedKey
      ? 'Configured in secure store'
      : process.env['OPENCODE_API_KEY']
      ? 'Configured via process environment'
      : 'Not set (run `anygate --setup`)',
    critical: false,
  });

  const conflicts = detectConflicts();
  checks.push({
    label: 'Environment variable conflicts',
    ok: conflicts.length === 0,
    detail:
      conflicts.length === 0
        ? 'Clean'
        : `Found ${conflicts.length} conflicting var(s): ${conflicts.join(', ')}`,
    critical: false,
  });

  const portFree = await checkPortFree(GATEWAY_PORT);
  checks.push({
    label: `Local gateway port (${GATEWAY_PORT})`,
    ok: portFree,
    detail: portFree ? 'Available' : 'In use by another process',
    critical: false,
  });

  const lines = checks.map(c => line(c.ok, c.label, c.detail));
  printPanel('System Diagnostic', lines);

  const criticalFailed = checks.some(c => c.critical && !c.ok);
  if (criticalFailed) {
    gateOutro('One or more critical checks failed.');
    return 1;
  }

  gateOutro('All checks completed successfully.');
  return 0;
}
