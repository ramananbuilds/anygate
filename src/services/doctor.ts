import pc from 'picocolors'
import { createServer } from 'node:net'
import { GATEWAY_PORT } from '../config/constants.js'
import {
  detectConflicts,
  isSecretServiceAvailable,
  readFromCredentialStore,
} from '../config/env.js'
import { gateIntro, gateOutro, printPanel } from '../apps/shared/ui.js'

interface CheckResult {
  /** Stable machine-readable key so the UI can render per-check without parsing labels. */
  id: DoctorCheckId
  label: string
  ok: boolean
  detail: string
  /** A failed critical check flips the overall exit code to 1. */
  critical: boolean
}

export type DoctorCheckId = 'node' | 'keychain' | 'opencode-key' | 'env-conflicts' | 'gateway-port'

export interface DoctorReport {
  /** False when any critical check failed. */
  ok: boolean
  checks: CheckResult[]
  nodeVersion: string
  keychain: { available: boolean; note: string }
  /** Names only — values are secrets and must never leave the process. */
  conflictingEnvVars: string[]
  gatewayPort: number
  gatewayPortAvailable: boolean
  /** True when the gateway port is busy because *our* gateway is running. */
  gatewayPortOwnedByAnygate: boolean
}

function nodeMajor(): number {
  const raw = process.versions.node.split('.')[0] ?? '0'
  return Number.parseInt(raw, 10) || 0
}

function checkPortFree(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.listen(port, () => {
      server.close(() => resolve(true))
    })
    const timer = setTimeout(() => resolve(true), 1500)
    if (typeof timer.unref === 'function') timer.unref()
  })
}

function line(ok: boolean, label: string, detail = ''): string {
  const mark = ok ? pc.green('✓') : pc.red('✗')
  const text = detail ? `${label} ${pc.dim(`— ${detail}`)}` : label
  return `  ${mark}  ${text}`
}

/**
 * Run every diagnostic and return structured results. Contains no terminal
 * output so it can back both `anygate doctor` and `GET /api/health`.
 *
 * @param opts.gatewayRunning Whether anygate's own gateway currently holds
 * GATEWAY_PORT. A busy port is only a problem when we aren't the owner, so the
 * caller passes what it knows rather than this module guessing.
 */
export async function collectDoctorReport(
  opts: { gatewayRunning?: boolean } = {}
): Promise<DoctorReport> {
  const checks: CheckResult[] = []

  const major = nodeMajor()
  checks.push({
    id: 'node',
    label: 'Node.js version',
    ok: major >= 18,
    detail: `v${process.versions.node} (requires ≥ 18)`,
    critical: true,
  })

  let keyringOk = false
  let keyringDetail = ''
  const platform = process.platform
  if (platform === 'darwin') {
    keyringOk = true
    keyringDetail = 'macOS Keychain Service'
  } else if (platform === 'win32') {
    keyringOk = true
    keyringDetail = 'Windows Credential Manager'
  } else if (platform === 'linux') {
    keyringOk = await isSecretServiceAvailable()
    keyringDetail = keyringOk
      ? 'Secret Service (GNOME Keyring / KWallet)'
      : 'Secret Service daemon unreachable'
  } else {
    keyringDetail = `Unsupported platform (${platform})`
  }

  checks.push({
    id: 'keychain',
    label: 'Secure credential storage',
    ok: keyringOk,
    detail: keyringDetail,
    critical: false,
  })

  const storedKey = await readFromCredentialStore()
  checks.push({
    id: 'opencode-key',
    label: 'OpenCode API key',
    ok: Boolean(storedKey || process.env['OPENCODE_API_KEY']),
    detail: storedKey
      ? 'Configured in secure store'
      : process.env['OPENCODE_API_KEY']
        ? 'Configured via process environment'
        : 'Not set (run `anygate --setup`)',
    critical: false,
  })

  const conflicts = detectConflicts()
  const conflictNames = conflicts.map(c => c.name)
  checks.push({
    id: 'env-conflicts',
    label: 'Environment variable conflicts',
    ok: conflicts.length === 0,
    detail:
      conflicts.length === 0
        ? 'Clean'
        : `Found ${conflicts.length} conflicting var(s): ${conflictNames.join(', ')}`,
    critical: false,
  })

  const portFree = await checkPortFree(GATEWAY_PORT)
  // Our own running gateway holding the port is the expected healthy state,
  // not a conflict — only an unrelated process squatting on it is a problem.
  const ownedByUs = !portFree && Boolean(opts.gatewayRunning)
  checks.push({
    id: 'gateway-port',
    label: `Local gateway port (${GATEWAY_PORT})`,
    ok: portFree || ownedByUs,
    detail: portFree
      ? 'Available'
      : ownedByUs
        ? 'In use by the anygate gateway'
        : 'In use by another process',
    critical: false,
  })

  return {
    ok: !checks.some(c => c.critical && !c.ok),
    checks,
    nodeVersion: process.versions.node,
    keychain: { available: keyringOk, note: keyringDetail },
    conflictingEnvVars: conflictNames,
    gatewayPort: GATEWAY_PORT,
    gatewayPortAvailable: portFree,
    gatewayPortOwnedByAnygate: ownedByUs,
  }
}

export async function runDoctorCommand(_dryRun: boolean): Promise<number> {
  gateIntro('Doctor')

  const report = await collectDoctorReport()

  const lines = report.checks.map(c => line(c.ok, c.label, c.detail))
  printPanel('System Diagnostic', lines)

  if (!report.ok) {
    gateOutro('One or more critical checks failed.')
    return 1
  }

  gateOutro('All checks completed successfully.')
  return 0
}
