import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Several suites boot real HTTP servers (gateway, UI API) and land near 5s
    // on their own; under full-suite parallel load they exceeded vitest's 5s
    // default and failed intermittently. These are slow by nature, not hung.
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      exclude: [
        'src/ui/app/**',
        'src/ui/dist/**',
        'src/ui/public/**',
        'dist/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.svelte',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
})
