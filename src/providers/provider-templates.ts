// src/providers/provider-templates.ts — builtin provider templates for anygate providers add
//
// Templates are now loaded from JSON files in src/registry/data/templates/.
// See src/registry/data-loader.ts for the async loader (for dynamic loading).

import { globSync } from 'glob';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Determine the templates directory, works in both source and dist. */
function getTemplatesDir(): string {
  // In dist: chunk is in dist/, templates are at dist/registry/data/templates/
  // In source: file is in src/providers/, templates at src/registry/data/templates/
  const distPath = join(__dirname, 'registry', 'data', 'templates');
  const srcPath = join(__dirname, '..', 'registry', 'data', 'templates');
  // Check if dist path exists (bundled), otherwise use src path
  if (existsSync(distPath)) return distPath;
  return srcPath;
}

const TEMPLATES_DIR = getTemplatesDir();

export type ProviderAuthType = 'api' | 'oauth' | 'none';
export type ProviderModelSource = 'api-list' | 'static-seed' | 'manual-only' | 'zen-go-api';

export interface ProviderTemplate {
  id: string;
  name: string;
  authType: ProviderAuthType;
  npm: string;
  defaultBaseUrl?: string;
  modelsPath?: string;
  signupUrl?: string;
  urlPlaceholder?: string;
  urlPrompt?: string;
  apiKeyOptional?: boolean;
  anonymousFreeModels?: boolean;
  /** Static headers this provider requires on every request (model listing and runtime). */
  headers?: Record<string, string>;
  modelSource: ProviderModelSource;
  staticModels?: Array<{ id: string; name: string }>;
  supported: boolean;
  addable?: boolean;
  hidden?: boolean;
  unsupportedReason?: string;
  /** True for providers that extract subscription tokens — carries account risk. */
  subscriptionRisk?: boolean;
}

/** Synchronously load a template from JSON file. */
export function loadTemplateSync(id: string): ProviderTemplateData | undefined {
  try {
    const content = readFileSync(join(TEMPLATES_DIR, `${id}.json`), 'utf8');
    return JSON.parse(content) as ProviderTemplateData;
  } catch {
    return undefined;
  }
}

/** Load all provider templates synchronously from JSON files. */
export function loadTemplatesSync(): ProviderTemplateData[] {
  const files = globSync('*.json', { cwd: TEMPLATES_DIR });
  return files
    .map(file => {
      const content = readFileSync(join(TEMPLATES_DIR, file), 'utf8');
      return JSON.parse(content) as ProviderTemplateData;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================================================
// Type definitions (compatible with data-loader.ts)
// ============================================================================

interface ProviderTemplateData {
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

/** Convert template data to the internal ProviderTemplate format. */
export function toProviderTemplate(data: ProviderTemplateData): ProviderTemplate {
  return {
    id: data.id,
    name: data.name,
    authType: data.authType === 'apiKey' ? 'api' : data.authType === 'oauth' ? 'oauth' : 'none',
    npm: data.npm ?? '', // Will be populated from known npm packages
    defaultBaseUrl: data.apiBaseUrl,
    modelsPath: data.modelsPath ?? data.modelsEndpoint,
    signupUrl: data.signupUrl,
    modelSource: data.modelSource as ProviderTemplate['modelSource'] ?? 'api-list',
    staticModels: data.staticModels,
    supported: data.supported,
    addable: data.addable ?? true,
    hidden: data.hidden,
    unsupportedReason: data.unsupportedReason,
    subscriptionRisk: data.subscriptionRisk,
    apiKeyOptional: data.apiKeyOptional,
    anonymousFreeModels: data.anonymousFreeModels,
    headers: data.headers,
  };
}

// Known npm package mapping for providers
const NPM_PACKAGES: Record<string, string> = {
  groq: '@ai-sdk/groq',
  nvidia: '@ai-sdk/openai-compatible',
  mistral: '@ai-sdk/mistral',
  togetherai: '@ai-sdk/togetherai',
  cerebras: '@ai-sdk/cerebras',
  deepinfra: '@ai-sdk/deepinfra',
  deepseek: '@ai-sdk/openai-compatible',
  zhipu: '@ai-sdk/openai-compatible',
  moonshot: '@ai-sdk/openai-compatible',
  'moonshot-global': '@ai-sdk/openai-compatible',
  'kimi-code': '@ai-sdk/openai-compatible',
  xai: '@ai-sdk/xai',
  perplexity: '@ai-sdk/perplexity',
  cohere: '@ai-sdk/cohere',
  openai: '@ai-sdk/openai',
  google: '@ai-sdk/google',
  alibaba: '@ai-sdk/alibaba',
  openrouter: '@openrouter/ai-sdk-provider',
  kilo: '@ai-sdk/openai-compatible',
  ollama: '@ai-sdk/openai-compatible',
  lmstudio: '@ai-sdk/openai-compatible',
  venice: 'venice-ai-sdk-provider',
  anthropic: '@ai-sdk/anthropic',
  bedrock: '@ai-sdk/amazon-bedrock',
  azure: '@ai-sdk/azure',
  vertex: '@ai-sdk/google-vertex',
  'opencode-cloud': '@ai-sdk/openai-compatible',
  zen: '@ai-sdk/openai-compatible',
  go: '@ai-sdk/openai-compatible',
  'claude-code': '@ai-sdk/anthropic',
  antigravity: '@ai-sdk/openai-compatible',
  'xai-oauth': '@ai-sdk/xai',
  'openai-oauth': '@ai-sdk/openai',
  'github-copilot': '@ai-sdk/openai-compatible',
  sambanova: '@ai-sdk/sambanova',
  fireworks: '@ai-sdk/fireworks',
  ovh: '@ai-sdk/openai-compatible',
  scaleway: '@ai-sdk/openai-compatible',
};

/** All provider templates loaded from JSON files. */
export const PROVIDER_TEMPLATES: ProviderTemplate[] = loadTemplatesSync()
  .map(toProviderTemplate)
  .map(t => ({
    ...t,
    npm: t.npm ?? NPM_PACKAGES[t.id] ?? '',
  }));

export function listSupportedTemplates(): ProviderTemplate[] {
  return PROVIDER_TEMPLATES
    .filter(t => t.supported && t.authType === 'api' && t.addable !== false && !t.hidden)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Supported templates not yet present in the user's registry. */
export function listAddableTemplates(configuredIds: Iterable<string> = []): ProviderTemplate[] {
  const configured = new Set(configuredIds);
  return listSupportedTemplates().filter(t => {
    if (t.id === 'opencode-cloud') {
      return !configured.has('zen') && !configured.has('go');
    }
    return !configured.has(t.id);
  });
}

export function listVisibleOAuthTemplates(configuredIds: Iterable<string> = []): ProviderTemplate[] {
  const configured = new Set(configuredIds);
  return PROVIDER_TEMPLATES
    .filter(t => t.authType === 'oauth' && t.supported && t.addable !== false && !t.hidden && !configured.has(t.id))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getTemplateById(id: string): ProviderTemplate | undefined {
  // First check if we have a JSON file
  const data = loadTemplateSync(id);
  if (data) {
    return {
      ...toProviderTemplate(data),
      npm: data.npm ?? NPM_PACKAGES[id] ?? '',
    };
  }
  // Fallback to in-memory array
  return PROVIDER_TEMPLATES.find(t => t.id === id);
}

export function filterTemplates(templates: ProviderTemplate[], query: string): ProviderTemplate[] {
  const q = query.trim().toLowerCase();
  if (!q) return templates;
  return templates.filter(
    t =>
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.npm.toLowerCase().includes(q),
  );
}