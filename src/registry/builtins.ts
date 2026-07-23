// src/registry/builtins.ts — Zen/Go registry stub entries (models fetched live)

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RegistryProvider, RegistrySubscriptionFilter } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROVIDERS_DIR = join(__dirname, 'data', 'providers');

/** Built-in provider data structure matching JSON files. */
interface BuiltinProviderData {
  id: string;
  name: string;
  description?: string;
  addable: boolean;
  supported: boolean;
  authType: 'apiKey' | 'oauth' | 'none';
  apiBaseUrl?: string;
  modelsEndpoint?: string;
  modelsPath?: string;
  headers?: Record<string, string>;
}

/** Synchronously load a builtin provider from JSON file. */
function loadBuiltinProviderSync(id: string): BuiltinProviderData | undefined {
  try {
    const content = readFileSync(join(PROVIDERS_DIR, `${id}.json`), 'utf8');
    return JSON.parse(content) as BuiltinProviderData;
  } catch {
    return undefined;
  }
}

/** Convert builtin provider data to RegistryProvider format. */
function toRegistryProvider(data: BuiltinProviderData, subscriptionFilter?: RegistrySubscriptionFilter): RegistryProvider {
  return {
    id: data.id,
    templateId: data.id,
    name: data.name,
    enabled: true,
    authRef: data.authType === 'oauth' ? 'keyring:global:opencode' : 'keyring:global:opencode',
    api: {},
    ...(subscriptionFilter ? { subscriptionFilter } : {}),
    addedAt: new Date().toISOString(),
  };
}

/** Zen registry stub - models fetched live from OpenCode. */
export function zenRegistryStub(subscriptionFilter?: RegistrySubscriptionFilter): RegistryProvider {
  const data = loadBuiltinProviderSync('zen');
  if (!data) {
    throw new Error('Zen builtin provider data not found');
  }
  return toRegistryProvider(data, subscriptionFilter);
}

/** Go registry stub - models fetched live from OpenCode. */
export function goRegistryStub(subscriptionFilter?: RegistrySubscriptionFilter): RegistryProvider {
  const data = loadBuiltinProviderSync('go');
  if (!data) {
    throw new Error('Go builtin provider data not found');
  }
  return toRegistryProvider(data, subscriptionFilter);
}