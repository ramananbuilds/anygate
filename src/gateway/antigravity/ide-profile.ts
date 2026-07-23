import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';

/**
 * Read the settings.json file from the specified path.
 *
 * @param settingsPath Absolute path to settings.json
 * @returns Parsed JSON settings object, or empty object if not found or malformed
 */
export function readIdeSettings(settingsPath: string): Record<string, any> {
  if (!fs.existsSync(settingsPath)) return {};
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(raw) as Record<string, any>;
  } catch {
    return {};
  }
}

/**
 * Write a settings object atomically back to the specified path.
 *
 * @param settingsPath Absolute path to settings.json
 * @param settings Settings object to write
 */
export function writeIdeSettings(settingsPath: string, settings: Record<string, any>): void {
  const tempPath = `${settingsPath}.tmp-${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(settings, null, 2), 'utf8');
  fs.renameSync(tempPath, settingsPath);
}

/** Return true if the isolated profile directory already has a settings.json (i.e., was initialized). */
function isProfileInitialized(profileDir: string): boolean {
  const settingsPath = path.join(profileDir, 'User', 'settings.json');
  return fs.existsSync(settingsPath);
}

/** Copy a directory recursively, preserving structure. */
function copyDirectory(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      try {
        const linkTarget = fs.readlinkSync(srcPath);
        fs.symlinkSync(linkTarget, destPath);
      } catch {
        // Ignore broken symlinks
      }
    }
  }
}

/**
 * Find the user's real Antigravity profile directory.
 *
 * @param isIDE True for Antigravity IDE, false for standalone Antigravity app
 * @returns Absolute path to the real profile directory, or null if not found
 */
export function findRealAntigravityProfile(isIDE: boolean): string | null {
  const appName = isIDE ? 'Antigravity IDE' : 'Antigravity';

  if (process.platform === 'darwin') {
    const base = path.join(homedir(), 'Library', 'Application Support', appName);
    if (fs.existsSync(base)) return base;
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA ?? path.join(homedir(), 'AppData', 'Roaming');
    const base = path.join(appData, appName);
    if (fs.existsSync(base)) return base;
  }

  // Linux: Antigravity typically uses ~/.config/antigravity or ~/.config/antigravity-ide
  if (process.platform === 'linux') {
    const configHome = process.env.XDG_CONFIG_HOME ?? path.join(homedir(), '.config');
    const base = path.join(configHome, isIDE ? 'antigravity-ide' : 'antigravity');
    if (fs.existsSync(base)) return base;
  }

  return null;
}

/**
 * Prepare an isolated, Gateway-owned profile directory for the Antigravity IDE/App.
 *
 * On first run, it copies the user's real Antigravity profile (if found) to the
 * isolated directory, then patches `settings.json` with the gateway URL and
 * telemetry-off settings. On subsequent runs, it only updates the gateway URL
 * in the already-initialized isolated profile.
 *
 * @param profileDir Absolute path to the isolated profile directory
 * @param gatewayUrl The randomized local gateway URL
 * @param isIDE True for Antigravity IDE, false for standalone Antigravity app
 * @returns The resolved profile directory path
 */
export function prepareIdeProfile(
  profileDir: string,
  gatewayUrl: string,
  isIDE: boolean,
): string {
  // 1. Create the directory with 0700 permissions (rwx------)
  fs.mkdirSync(profileDir, { recursive: true, mode: 0o700 });

  const userDir = path.join(profileDir, 'User');
  fs.mkdirSync(userDir, { recursive: true });

  const settingsPath = path.join(userDir, 'settings.json');

  // 2. On first run, copy real profile to isolated dir (if real profile exists)
  if (!isProfileInitialized(profileDir)) {
    const realProfile = findRealAntigravityProfile(isIDE);
    if (realProfile) {
      const realUserDir = path.join(realProfile, 'User');
      if (fs.existsSync(realUserDir)) {
        copyDirectory(realUserDir, userDir);
      }
    }
  }

  // 3. Read existing settings (from copied profile or empty), update/merge
  const settings = readIdeSettings(settingsPath);

  // 4. Set/update only the jetski.cloudCodeUrl parameter and telemetry settings
  settings['jetski.cloudCodeUrl'] = gatewayUrl;
  settings['telemetry.telemetryLevel'] = 'off';
  settings['telemetry.enableTelemetry'] = false;
  settings['telemetry.enableCrashReporter'] = false;

  // 5. Write atomically to prevent corrupting settings on write failures
  writeIdeSettings(settingsPath, settings);

  return profileDir;
}