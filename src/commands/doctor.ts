// src/commands/doctor.ts — anygate doctor command
import type { ParsedArgs } from '../core/types.js';
import { runDoctorCommand } from '../agents/shared/doctor.js';

export async function handleDoctorCommand(parsed: ParsedArgs): Promise<number> {
  if (parsed.showVersion) {
    const { VERSION } = await import('../core/constants.js');
    console.log(VERSION);
    return 0;
  }
  if (parsed.showHelp) {
    console.log(`
anygate doctor — Run an environment diagnostic

Usage:
  anygate doctor [--dry-run] [--help] [--version]

Options:
  --dry-run  Show what would be checked without running
  --help, -h Show this help
  -v, --version  Show version

Checks:
  - Node.js version
  - Keyring/credential store availability
  - API key configuration
  - Port availability
  - Environment variable conflicts
`);
    return 0;
  }
  return runDoctorCommand(parsed.dryRun);
}