// src/apps/shared/self-update.ts
import pc from 'picocolors'
import { spawn } from 'node:child_process'
import * as p from '@clack/prompts'
import { checkForUpdates, UPDATE_COMMAND } from './update-check.js'
import { VERSION } from '../../../src/config/constants.js'

/** Arguments for the global install. Fixed literals — nothing interpolated. */
const INSTALL_ARGS = ['install', '-g', 'anygate@latest'] as const

/**
 * How to invoke npm on this platform.
 *
 * Windows previously resolved an absolute path via `where npm`, which was wrong
 * three times over:
 *
 *  1. `where npm` lists the extensionless Unix shell script (`…\nodejs\npm`)
 *     *before* `npm.cmd`, and the old predicate accepted anything ending in
 *     "npm" — so it picked the one file CreateProcess cannot execute, failing
 *     with `spawn …\nodejs\npm ENOENT`.
 *  2. Since Node 18.20.2 / 20.12.2 / 21.7.3 (the CVE-2024-27980 fix), spawning
 *     a `.cmd` or `.bat` requires `shell: true`. Even resolving `npm.cmd`
 *     correctly would have failed with EINVAL without it.
 *  3. With `shell: true`, an absolute path containing a space — the default
 *     `C:\Program Files\nodejs\npm.cmd` — needs quoting, or cmd.exe treats
 *     `C:\Program` as the command.
 *
 * Passing the bare name `npm` through the shell sidesteps all three: cmd.exe
 * expands it via PATHEXT to `npm.cmd`, and with no absolute path there is no
 * space to quote. On POSIX, spawn already resolves `npm` from PATH.
 *
 * `shell: true` is safe here because INSTALL_ARGS are compile-time constants;
 * no user input reaches the command line.
 */
function resolveNpmSpawn(): { bin: string; shell: boolean } {
  return { bin: 'npm', shell: process.platform === 'win32' }
}

/**
 * Run `anygate update` — interactive self-upgrade.
 * Reuses checkForUpdates() + UPDATE_COMMAND. Respects --dry-run (prints the
 * command it would run but never spawns npm).
 */
export async function runUpdateCommand(dryRun: boolean): Promise<number> {
  const update = await checkForUpdates()

  if (!update.updateAvailable || !update.latestVersion) {
    p.log.success(`anygate is up to date (v${VERSION}).`)
    return 0
  }

  p.log.info(
    `Update available: ${pc.cyan(`v${update.currentVersion}`)} → ${pc.green(`v${update.latestVersion}`)}`
  )

  const { bin: npmBin, shell } = resolveNpmSpawn()

  if (dryRun) {
    p.log.step(`Would run: ${pc.bold(`${npmBin} ${INSTALL_ARGS.join(' ')}`)}`)
    p.log.warn('Dry run — no changes made.')
    return 0
  }

  const confirmed = await p.confirm({
    message: `Install anygate@${update.latestVersion} now?`,
    initialValue: false,
  })

  if (p.isCancel(confirmed) || !confirmed) {
    p.log.info(`Update skipped. Run ${pc.cyan(UPDATE_COMMAND)} later if you change your mind.`)
    return 0
  }

  p.log.info(`Running ${pc.cyan(`${npmBin} ${INSTALL_ARGS.join(' ')}`)}...`)

  const child = spawn(npmBin, [...INSTALL_ARGS], {
    stdio: 'inherit',
    shell,
    windowsHide: true,
  })

  return new Promise<number>(resolve => {
    // Node emits BOTH 'error' and 'close' when a spawn fails to start, so
    // without this guard one failure printed two messages ("Could not start
    // npm: … ENOENT" followed by "Update failed (exit -4058)", -4058 being the
    // numeric ENOENT). The guard must gate each handler's log side-effects, not
    // just resolve() — otherwise both messages still print. Report the first
    // outcome only.
    let settled = false
    const settle = (code: number): void => {
      settled = true
      resolve(code)
    }

    child.on('error', err => {
      if (settled) return
      const msg = err instanceof Error ? err.message : String(err)
      p.log.error(`Could not start npm: ${msg}`)
      p.log.info(`Update anygate manually with: ${pc.cyan(UPDATE_COMMAND)}`)
      settle(1)
    })
    child.on('close', code => {
      if (settled) return
      if (code === 0) {
        p.log.success(
          'anygate updated. Restart your shell or re-run anygate to use the new version.'
        )
      } else {
        p.log.error(`Update failed (exit ${code}). Try ${pc.cyan(UPDATE_COMMAND)} manually.`)
      }
      settle(code ?? 1)
    })
  })
}
