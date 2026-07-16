import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock the core env helpers the doctor command relies on. We don't want the
// real keyring probe / credential store touching the OS during tests.
vi.mock('../src/core/env.js', () => ({
  detectConflicts: vi.fn(() => []),
  isSecretServiceAvailable: vi.fn(async () => true),
  readFromCredentialStore: vi.fn(async () => 'sk-test-123'),
}));

// Use a high, almost-certainly-free port so the bind probe never clashes
// with a real `anygate server` on 17645.
vi.mock('../src/core/constants.js', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, GATEWAY_PORT: 48123 };
});

import { runDoctorCommand } from '../src/agents/shared/doctor.js';

function captureOutput(): { restore: () => void; out: () => string } {
  let buf = '';
  const logSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    buf += args.join(' ') + '\n';
  });
  const writeSpy = vi
    .spyOn(process.stdout, 'write')
    .mockImplementation((chunk: string | Uint8Array): boolean => {
      buf += typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
      return true;
    });
  return {
    out: () => buf,
    restore: () => {
      logSpy.mockRestore();
      writeSpy.mockRestore();
    },
  };
}

describe('doctor command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes when all probes succeed', async () => {
    const cap = captureOutput();
    const exit = await runDoctorCommand(false);
    expect(exit).toBe(0);
    const out = cap.out();
    expect(out).toContain('Node.js version');
    expect(out).toContain('Secure credential store');
    expect(out).toContain('OpenCode API key');
    expect(out).toContain('Gateway port 48123');
    cap.restore();
  });

  it('fails (exit 1) when Node is too old', async () => {
    const original = process.versions.node;
    Object.defineProperty(process.versions, 'node', { configurable: true, value: '16.0.0' });
    const cap = captureOutput();
    const exit = await runDoctorCommand(false);
    Object.defineProperty(process.versions, 'node', { configurable: true, value: original });
    expect(exit).toBe(1);
    cap.restore();
  });

  it('warns (exit 0) when the keyring probe throws', async () => {
    const { isSecretServiceAvailable } = await import('../src/core/env.js');
    (isSecretServiceAvailable as unknown as vi.Mock).mockRejectedValueOnce(new Error('no keyring'));
    const cap = captureOutput();
    const exit = await runDoctorCommand(false);
    expect(exit).toBe(0);
    expect(cap.out()).toContain('no keyring');
    cap.restore();
  });

  it('warns (exit 0) when the API key is missing', async () => {
    const { readFromCredentialStore } = await import('../src/core/env.js');
    (readFromCredentialStore as unknown as vi.Mock).mockResolvedValueOnce(null);
    const cap = captureOutput();
    const exit = await runDoctorCommand(false);
    expect(exit).toBe(0);
    expect(cap.out()).toContain('not set');
    cap.restore();
  });

  it('reports conflicting env vars when present', async () => {
    const { detectConflicts } = await import('../src/core/env.js');
    (detectConflicts as unknown as vi.Mock).mockReturnValueOnce([
      { name: 'ANTHROPIC_API_KEY', value: 'x' },
    ]);
    const cap = captureOutput();
    await runDoctorCommand(false);
    expect(cap.out()).toContain('ANTHROPIC_API_KEY');
    cap.restore();
  });
});
