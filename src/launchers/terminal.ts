import { openInTerminal as openTerminalScript, createLauncherScript } from './native-launcher.js';
import type { GatewayLaunchOptions } from './native-launcher.js';

export function openCommandInTerminal(command: string, options: GatewayLaunchOptions = {}): void {
  openTerminalScript(command, options);
}

export { createLauncherScript };
