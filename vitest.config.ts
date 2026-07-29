import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
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
