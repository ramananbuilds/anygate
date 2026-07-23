import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  minify: false,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    '@napi-rs/keyring',
    'ws',
    /^@ai-sdk\//,
    '@openrouter/ai-sdk-provider',
    'gitlab-ai-provider',
    'venice-ai-sdk-provider',
    'open',
  ],
  onSuccess: async () => {
    // Copy template JSON files to dist directory
    const srcTemplatesDir = 'src/registry/data/templates';
    const destTemplatesDir = 'dist/registry/data/templates';
    const srcProvidersDir = 'src/registry/data/providers';
    const destProvidersDir = 'dist/registry/data/providers';

    // Copy templates
    mkdirSync(destTemplatesDir, { recursive: true });
    for (const file of readdirSync(srcTemplatesDir)) {
      if (file.endsWith('.json')) {
        copyFileSync(join(srcTemplatesDir, file), join(destTemplatesDir, file));
      }
    }

    // Copy providers
    mkdirSync(destProvidersDir, { recursive: true });
    for (const file of readdirSync(srcProvidersDir)) {
      if (file.endsWith('.json')) {
        copyFileSync(join(srcProvidersDir, file), join(destProvidersDir, file));
      }
    }
  },
});