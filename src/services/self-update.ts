import pc from 'picocolors'
import { spawn, execFileSync } from 'node:child_process'
import * as p from '@clack/prompts'
import { checkForUpdates, UPDATE_COMMAND } from './update-check.js'
import { VERSION } from '../config/constants.js'

function resolveNpmBin(): string {
  if (process.platform === 'win32') {
    try {
      const found = execFileSync('where', ['npm'], { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .split(/\r?\n/)
        .map(s => s.trim())
        .find(s => s.toLowerCase().endsWith('.cmd') || s.toLowerCase().endsWith('npm'))
      if (found) return found
    } catch {
      // fall through to default
    }
    return 'npm.cmd'
  }
  return 'npm'
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

  const npmBin = resolveNpmBin()

  if (dryRun) {
    p.log.step(`Would run: ${pc.bold(`${npmBin} install -g anygate@latest`)}`)
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

  p.log.step(`Running ${pc.bold(`${npmBin} install -g anygate@latest`)}...`)

  return new Promise(resolve => {
    const child = spawn(npmBin, ['install', '-g', 'anygate@latest'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('exit', code => {
      if (code === 0) {
        p.log.success(`Updated successfully to v${update.latestVersion}! 🎉`)
        resolve(0)
      } else {
        p.log.error(`Update failed with exit code ${code}. Try running: ${UPDATE_COMMAND}`)
        resolve(code ?? 1)
      }
    })

    child.on('error', err => {
      p.log.error(`Failed to spawn npm: ${err.message}`)
      p.log.info(`Try running manually: ${UPDATE_COMMAND}`)
      resolve(1)
    })
  })
}
