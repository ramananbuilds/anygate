// src/registry/data-loader.ts — Load provider templates and built-in providers from JSON files
import { glob } from 'glob';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const TEMPLATES_DIR = join(DATA_DIR, 'templates');
const PROVIDERS_DIR = join(DATA_DIR, 'providers');

export interface ProviderTemplateData {
  id: string;
  name: string;
  description?: string;
  addable: boolean;
  supported: boolean;
  authType: 'apiKey' | 'oauth' | 'none';
  apiBaseUrl?: string;
  modelsEndpoint?: string;
  modelsPath?: string;
  signupUrl?: string;
  modelSource?: string;
  staticModels?: Array<{ id: string; name: string }>;
  headers?: Record<string, string>;
  apiKeyOptional?: boolean;
  anonymousFreeModels?: boolean;
  subscriptionRisk?: boolean;
  hidden?: boolean;
  unsupportedReason?: string;
  npm?: string;
}

export interface BuiltinProviderData {
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

/** Load all provider templates from JSON files in templates directory. */
export async function loadProviderTemplates(): Promise<ProviderTemplateData[]> {
  const files = await glob('*.json', { cwd: TEMPLATES_DIR });
  const templates: ProviderTemplateData[] = [];
  for (const file of files) {
    const content = readFileSync(join(TEMPLATES_DIR, file), 'utf8');
    templates.push(JSON.parse(content) as ProviderTemplateData);
  }
  return templates.sort((a, b) => a.name.localeCompare(b.name));
}

/** Load a single provider template by ID. */
export async function loadProviderTemplate(id: string): Promise<ProviderTemplateData | undefined> {
  try {
    const content = readFileSync(join(TEMPLATES_DIR, `${id}.json`), 'utf8');
    return JSON.parse(content) as ProviderTemplateData;
  } catch {
    return undefined;
  }
}

/** Load all built-in providers from JSON files in providers directory. */
export async function loadBuiltinProviders(): Promise<BuiltinProviderData[]> {
  const files = await glob('*.json', { cwd: PROVIDERS_DIR });
  const providers: BuiltinProviderData[] = [];
  for (const file of files) {
    const content = readFileSync(join(PROVIDERS_DIR, file), 'utf8');
    providers.push(JSON.parse(content) as BuiltinProviderData);
  }
  return providers.sort((a, b) => a.name.localeCompare(b.name));
}

/** Load a single built-in provider by ID. */
export async function loadBuiltinProvider(id: string): Promise<BuiltinProviderData | undefined> {
  try {
    const content = readFileSync(join(PROVIDERS_DIR, `${id}.json`), 'utf8');
    return JSON.parse(content) as BuiltinProviderData;
  } catch {
    return undefined;
  }
}

/** Check if a provider template file exists. */
export function hasProviderTemplate(id: string): boolean {
  try {
    const content = readFileSync(join(TEMPLATES_DIR, `${id}.json`), 'utf8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}