// Find, open, quit, and restart the Claude Desktop app (macOS + Windows).
import { existsSync } from 'node:fs'
import { AppLauncher } from '../shared/app-launcher.js'

const CLAUDE_BUNDLE_ID = 'com.anthropic.claudefordesktop'

export class ClaudeAppLauncher extends AppLauncher {
  readonly appName = 'Claude Desktop'
  readonly bundleId = CLAUDE_BUNDLE_ID
  readonly darwinAppNames = ['Claude']
  readonly winAppNames = ['Claude']
  readonly winInstallBases = ['Claude']
  readonly darwinAppBundleNames = ['Claude.app']
  readonly winExeNames = ['Claude.exe']
  readonly configOverrideKey = 'claude-app'

  protected findDarwinAppExtra(): string | null {
    try {
      const out = this.run(`mdfind "kMDItemCFBundleIdentifier == '${CLAUDE_BUNDLE_ID}'"`)
      const first = out
        .split('\n')
        .map(l => l.trim())
        .find(Boolean)
      return first && existsSync(first) ? first : null
    } catch {
      return null
    }
  }

  /** Search for UWP/Windows Store version via Get-StartApps */
  protected findWinAppExtra(): string | null {
    try {
      const appId = this.runPowerShell(
        `(Get-StartApps | Where-Object { $_.Name -eq 'Claude' -or $_.Name -like 'Claude*' } | Select-Object -First 1 -ExpandProperty AppID)`
      )
      if (appId) return `shell:AppsFolder\\${appId}`
    } catch {
      /* ignore */
    }
    return null
  }

  getInstallHint(): string {
    return 'Claude Desktop App not found. Please install it first.'
  }
}

// Backwards-compatible function exports
const launcher = new ClaudeAppLauncher()

export function claudeAppSupported(): void {
  if (process.platform !== 'darwin' && process.platform !== 'win32') {
    throw new Error('Claude Desktop launch is supported on macOS and Windows only.')
  }
}

export function findClaudeApp(): string | null {
  // Delegates to the launcher rather than re-implementing the search. The old
  // hand-rolled copy checked only two static %LOCALAPPDATA% paths and never ran
  // findWinAppExtra(), so Microsoft Store (MSIX) installs — which have no .exe at
  // any fixed path — were reported as "not installed" by detectApp()/the web UI,
  // even though findApp() locates them via Get-StartApps. findApp() is synchronous;
  // findClaudeAppAsync() below already delegates to this same method.
  return launcher.findApp()
}

export async function findClaudeAppAsync(): Promise<string | null> {
  return launcher.findApp()
}

export function isClaudeAppRunning(): boolean {
  return launcher.isRunning()
}

export function quitClaudeAppGracefully(): void {
  launcher.quitGracefully()
}

export async function waitForQuit(timeoutMs: number): Promise<boolean> {
  return launcher.waitForQuit(timeoutMs)
}

export async function openClaudeApp(): Promise<void> {
  const appPath = await launcher.findApp()
  if (!appPath) throw new Error(launcher.getInstallHint())
  launcher.openApp(appPath)
}

export async function launchOrRestartClaudeApp(
  prompt = 'Restart Claude Desktop to apply anygate settings?'
): Promise<void> {
  return launcher.launchOrRestart(prompt)
}
