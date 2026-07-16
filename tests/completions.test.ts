import { afterEach, describe, expect, it, vi } from 'vitest';

import { runCompletionsCommand } from '../src/agents/shared/completions.js';

const SUBCOMMAND_TOKENS = ['claude', 'codex', 'gemini', 'agy', 'server', 'ui', 'models', 'providers', 'doctor', 'completions', 'update'];

describe('completions command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env['SHELL'];
    delete process.env['PSModulePath'];
    delete process.env['POWERSHELL_DISTRIBUTION_CHANNEL'];
  });

  it('emits a bash completion script', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand('bash');
    expect(exit).toBe(0);
    const out = write.mock.calls.flat().join('');
    expect(out).toContain('complete -F _anygate anygate');
    for (const tok of SUBCOMMAND_TOKENS) expect(out).toContain(tok);
  });

  it('emits a zsh completion script', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand('zsh');
    expect(exit).toBe(0);
    const out = write.mock.calls.flat().join('');
    expect(out).toContain('compdef anygate');
  });

  it('emits a fish completion script', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand('fish');
    expect(exit).toBe(0);
    const out = write.mock.calls.flat().join('');
    expect(out).toContain('complete -c anygate');
  });

  it('emits a PowerShell completion script', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand('powershell');
    expect(exit).toBe(0);
    const out = write.mock.calls.flat().join('');
    expect(out).toContain('Register-ArgumentCompleter');
  });

  it('accepts pwsh as an alias for powershell', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand('pwsh');
    expect(exit).toBe(0);
    expect(write.mock.calls.flat().join('')).toContain('Register-ArgumentCompleter');
  });

  it('detects the shell from SHELL env when no arg is given', async () => {
    process.env['SHELL'] = '/bin/zsh';
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const exit = await runCompletionsCommand(undefined);
    expect(exit).toBe(0);
    expect(write.mock.calls.flat().join('')).toContain('compdef anygate');
  });

  it('fails with a non-zero exit for an unknown shell', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const exit = await runCompletionsCommand('tcsh');
    expect(exit).toBe(1);
    expect(err.mock.calls.flat().join('')).toContain('could not detect your shell');
  });
});
