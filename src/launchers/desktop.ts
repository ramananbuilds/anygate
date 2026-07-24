import { AppLauncher } from './app-launcher.js';
import { launchWindowsApp } from './windows.js';
import { launchLinuxApp } from './linux.js';
import { launchMacApp } from './macos.js';

export { AppLauncher };

export function launchDesktopAppByPlatform(appPath: string, args: string[] = []) {
  if (process.platform === 'win32') return launchWindowsApp(appPath, { args });
  if (process.platform === 'darwin') return launchMacApp(appPath, { args });
  return launchLinuxApp(appPath, { args });
}
