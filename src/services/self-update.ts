import pc from 'picocolors'
import { spawn } from 'node:child_process'
import * as p from '@clack/prompts'
import { checkForUpdates, UPDATE_COMMAND } from './update-check.js'
import { VERSION } from '../config/constants.js'

// NOTE: this module is an unreferenced duplicate of
// src/apps/shared/self-update.ts (which is what src/cli/update.ts actually
// imports). Kept in sync so it does not become a trap; see that file for the
// full explanation of why npm is spawned by bare name through the shell.
const INSTALL_ARGS = ['install', '-g', 'anygate@latest'] as const

function resolveNpmSpawn(): { bin: string; shell: boolean } {
  return { bin: 'npm', shell: process.platform === 'win32' }
}

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

  p.log.step(`Running ${pc.bold(`${npmBin} ${INSTALL_ARGS.join(' ')}`)}...`)

  return new Promise(resolve => {
    const child = spawn(npmBin, [...INSTALL_ARGS], {
      stdio: 'inherit',
      shell,
    })

    // Node emits both 'error' and 'exit' when a spawn fails to start. The guard
    // must cover the logging, not just resolve(): otherwise one failure prints
    // "Could not start npm: … ENOENT" followed by a meaningless exit code.
    let settled = false

    child.on('exit', code => {
      if (settled) return
      settled = true
      if (code === 0) {
        p.log.success(`Updated successfully to v${update.latestVersion}! 🎉`)
        resolve(0)
      } else {
        p.log.error(`Update failed with exit code ${code}. Try running: ${UPDATE_COMMAND}`)
        resolve(code ?? 1)
      }
    })

    child.on('error', err => {
      if (settled) return
      settled = true
      p.log.error(`Could not start npm: ${err.message}`)
      p.log.info(`Try running manually: ${UPDATE_COMMAND}`)
      resolve(1)
    })
  })
}
