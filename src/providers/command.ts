// src/providers-command.ts — anygate providers command
//
// Command dispatch, arg parsing, help text, and the add-flow (template +
// custom endpoint). Registry management, model refresh, and capability
// display live in their respective subdirectories:
//   registry/     — import, auth, remove, list
//   models/       — refresh model lists, pick from catalog
//   capabilities/ — provider detail, cloud catalog, hub choice values
//   pricing/      — cost formatting helpers

import pc from 'picocolors';
import * as p from '@clack/prompts';
import { upgradeGlobalOpencodeCredential, readGlobalOpencodeCredential } from '../core/env.js';
import { findOpencodeBinary } from './opencode-serve.js';
import {
  listAddableTemplates,
  type ProviderTemplate,
} from './provider-templates.js';
import { addProviderFromTemplate } from '../registry/add-template.js';
import { addCustomEndpointProvider } from '../registry/custom-endpoint.js';
import { validateCustomEndpointUrl } from '../registry/url-security.js';
import {
  addGoRegistryStub,
  addZenRegistryStub,
} from '../registry/crud.js';
import { loadRegistry } from '../registry/io.js';
import { refreshProviderModels } from '../registry/refresh-models.js';
import { resolveOrCollectApiKey } from '../apps/shared/key-setup.js';
import {
  fmtCount,
  fmtProvider,
  fmtUrl,
  logConnected,
  printPanel,
} from '../apps/shared/ui.js';
import {
  runProvidersImport,
  runProvidersAuth,
  runProvidersRemove,
  runProvidersList,
  providerAuthHelpText,
  type ProviderAuthMethod,
  listVisibleOAuthTemplates,
} from './registry/index.js';
import { runProvidersRefreshModels, pickTemplateFromCatalog } from './models/index.js';
import {
  runProviderDetail,
  runOpenCodeCloudDetail,
  providerHubChoiceValue,
} from './capabilities/index.js';

// Re-export for backward compatibility (tests and external callers import from command.ts)
export { providerHubChoiceValue };
import { resolveProvidersForDisplay } from './provider-catalog.js';
import { fmtEnabledStar } from '../apps/shared/ui.js';

export type { ProviderTemplate } from './provider-templates.js';
export { listAddableTemplates, getTemplateById } from './provider-templates.js';

export type ProvidersSubcommand = 'hub' | 'add' | 'import' | 'list' | 'remove' | 'refresh-models' | 'auth' | 'help';

export function parseProvidersArgs(args: string[]): {
  subcommand: ProvidersSubcommand;
  showHelp: boolean;
  removeId?: string;
  authMethod?: ProviderAuthMethod;
  error?: string;
} {
  if (args.length === 0) return { subcommand: 'hub', showHelp: false };
  const [first, ...rest] = args;
  if (first === '--help' || first === '-h') return { subcommand: 'help', showHelp: true };
  if (first === 'add') {
    if (rest.length > 0) return { subcommand: 'add', showHelp: false, error: `Unknown add option: ${rest[0]}` };
    return { subcommand: 'add', showHelp: false };
  }
  if (first === 'import') {
    if (rest.length > 0) return { subcommand: 'import', showHelp: false, error: `Unknown import option: ${rest[0]}` };
    return { subcommand: 'import', showHelp: false };
  }
  if (first === 'list') {
    if (rest.length > 0) return { subcommand: 'list', showHelp: false, error: `Unknown list option: ${rest[0]}` };
    return { subcommand: 'list', showHelp: false };
  }
  if (first === 'auth') {
    if (rest.length === 0) return { subcommand: 'auth', showHelp: true };
    let authMethod: ProviderAuthMethod | undefined;
    const positional: string[] = [];
    for (const arg of rest) {
      if (arg === '--native') authMethod = 'native';
      else if (arg === '--broker') authMethod = 'broker';
      else if (arg.startsWith('-')) {
        return { subcommand: 'auth', showHelp: false, error: `Unknown auth option: ${arg}` };
      } else {
        positional.push(arg);
      }
    }
    if (positional.length !== 1) {
      return { subcommand: 'auth', showHelp: false, error: 'Usage: anygate providers auth <id> [--native|--broker]' };
    }
    return { subcommand: 'auth', showHelp: false, removeId: positional[0], authMethod };
  }
  if (first === 'remove') {
    if (rest.length === 0) return { subcommand: 'remove', showHelp: false, error: 'Usage: anygate providers remove <id>' };
    if (rest.length > 1) return { subcommand: 'remove', showHelp: false, error: `Unknown remove option: ${rest[1]}` };
    return { subcommand: 'remove', showHelp: false, removeId: rest[0] };
  }
  if (first === 'refresh-models') {
    if (rest.length === 0) return { subcommand: 'refresh-models', showHelp: false };
    if (rest.length > 1) return { subcommand: 'refresh-models', showHelp: false, error: `Unknown refresh-models option: ${rest[1]}` };
    return { subcommand: 'refresh-models', showHelp: false, removeId: rest[0] };
  }
  return { subcommand: 'hub', showHelp: false, error: `Unknown providers subcommand: ${first}` };
}

export function providersHelpText(): string {
  return `${pc.bold('anygate providers')} — manage your AI providers

${pc.bold('Usage:')}
  anygate providers
  anygate providers add
  anygate providers import
  anygate providers list
  anygate providers remove <id>
  anygate providers refresh-models [id]
  anygate providers auth <id> [--native|--broker]

${pc.bold('Subcommands:')}
  (none)      Provider hub wizard ${pc.dim('[Phase 1.1]')}
  add         Add a provider (Groq, Mistral, Together AI, …) ${pc.dim('[Phase 1.1]')}
  import      Import providers from OpenCode CLI (one-time) ${pc.dim('[Phase 1.0]')}
  auth        Sign in with OAuth (GitHub Copilot, xAI, OpenAI)
  list        Show configured providers ${pc.dim('[Phase 1.0]')}
  remove      Remove a provider by id ${pc.dim('[Phase 1.1]')}
  refresh-models  Update cached model lists ${pc.dim('[Phase 1.2]')}`;
}


function providerLabel(name: string, modelCount: number, enabled: boolean): string {
  return `${fmtEnabledStar(enabled)} ${fmtProvider(name)} ${pc.dim(`(${modelCount} model${modelCount === 1 ? '' : 's'})`)}`;
}

export async function runTemplateAddFlow(templateArg?: ProviderTemplate): Promise<number> {
  let template = templateArg;
  if (!template) {
    if (listAddableTemplates(loadRegistry().providers.map(p => p.id)).length === 0) {
      p.log.info('All catalog providers are already configured.');
      return 0;
    }
    const picked = await pickTemplateFromCatalog();
    if (!picked) return 0;
    template = picked;
  }

  if (template.modelSource === 'zen-go-api') {
    const existingKey = await readGlobalOpencodeCredential();
    let apiKey = existingKey;
    if (!apiKey) {
      printPanel(pc.cyan('OpenCode cloud'), [
        `${pc.white('Get an API key at:')} ${fmtUrl('https://opencode.ai/auth')}`,
        `${pc.dim('Uses OpenCode Zen / Go cloud models — not the same as importing from the OpenCode CLI.')}`,
      ]);
      const collected = await resolveOrCollectApiKey(false, false);
      if (!collected) {
        p.cancel('Cancelled.');
        return 0;
      }
      apiKey = collected;
    }
    await upgradeGlobalOpencodeCredential();

    const spinner = p.spinner();
    spinner.start(`Adding ${template.name}...`);

    const zenStub = addZenRegistryStub();
    const goStub = addGoRegistryStub();
    if (!zenStub.added && !goStub.added) {
      spinner.stop('');
      p.log.warn('OpenCode Zen / Go is already configured.');
      return 0;
    }

    const registry = loadRegistry();
    const refreshResults = [
      await refreshProviderModels('zen', apiKey, registry),
      await refreshProviderModels('go', apiKey, registry),
    ];
    spinner.stop('');

    const modelCount = refreshResults.reduce((total, result) => total + (result.modelCount ?? 0), 0);
    const failed = refreshResults.filter(result => !result.ok);
    if (failed.length === 0) {
      p.log.success(`Added ${template.name} — ${fmtCount(modelCount, 'model')} updated.`);
    } else {
      p.log.warn(`Added ${template.name}, but ${failed.length} catalog refresh${failed.length === 1 ? '' : 'es'} failed.`);
    }
    return 0;
  }

  if (template.signupUrl) {
    printPanel(fmtProvider(template.name), [
      `${pc.white('Get an API key at:')} ${fmtUrl(template.signupUrl)}`,
    ]);
  }

  let baseUrlOverride: string | undefined;
  if (template.urlPrompt) {
    const urlInput = await p.text({
      message: template.urlPrompt,
      initialValue: template.defaultBaseUrl,
      validate: v => v.trim() ? undefined : 'URL is required',
    });
    if (p.isCancel(urlInput)) return 0;
    baseUrlOverride = String(urlInput).trim();

    const usesHttp = /^http:\/\//i.test(baseUrlOverride);
    if (usesHttp) {
      p.log.warn('HTTP is not encrypted. Use it only for trusted local or LAN servers, like Ollama on your own network.');
    }
    const valid = await validateCustomEndpointUrl(baseUrlOverride, { allowInsecureLocal: usesHttp });
    if (!valid.ok) {
      p.log.error(valid.error ?? 'Invalid URL');
      if (valid.hint) p.log.info(valid.hint);
      return 1;
    }
  }

  const apiKeyMsg = template.anonymousFreeModels
    ? `API key (leave empty to use free models only):`
    : template.apiKeyOptional
    ? `API key (leave empty for local servers without auth):`
    : `Paste your ${template.name} API key:`;

  const apiKeyInput = await p.password({
    message: apiKeyMsg,
    validate: val => template.apiKeyOptional ? undefined : (val.trim() ? undefined : 'Key cannot be empty'),
  });
  if (p.isCancel(apiKeyInput)) {
    p.cancel('Cancelled.');
    return 0;
  }

  const rawKey = String(apiKeyInput).trim();
  const apiKey = template.apiKeyOptional && !rawKey && !template.anonymousFreeModels ? template.id : rawKey;

  const spinner = p.spinner();
  spinner.start(`Testing connection to ${template.name}...`);
  const result = await addProviderFromTemplate(template, apiKey, { baseUrl: baseUrlOverride });
  spinner.stop('');

  if (!result.added) {
    p.log.error(result.error ?? 'Could not add provider.');
    if (result.hint) p.log.info(result.hint);
    return 1;
  }

  logConnected(template.name, result.modelCount ?? 0);
  return 0;
}


async function runCustomEndpointAddFlow(): Promise<number> {
  const kindChoice = await p.select({
    message: 'Custom server type',
    options: [
      {
        value: 'openai',
        label: 'Works with most AI services',
        hint: 'OpenAI-compatible API (Together, vLLM, Ollama, …)',
      },
      {
        value: 'anthropic',
        label: 'Claude-style API servers',
        hint: 'Anthropic-compatible /v1/messages passthrough',
      },
      { value: 'back', label: 'Back', hint: '' },
    ],
  });
  if (p.isCancel(kindChoice) || kindChoice === 'back') return 0;

  const displayName = await p.text({
    message: 'Display name:',
    placeholder: 'My Work LLM',
    validate: v => v.trim() ? undefined : 'Name is required',
  });
  if (p.isCancel(displayName)) return 0;

  const baseUrl = await p.text({
    message: 'Base URL:',
    placeholder: kindChoice === 'openai' ? 'https://api.together.xyz/v1' : 'https://api.anthropic.com',
    validate: v => v.trim() ? undefined : 'URL is required',
  });
  if (p.isCancel(baseUrl)) return 0;

  const usesHttp = /^http:\/\//i.test(String(baseUrl).trim());
  let allowInsecureHttp = false;
  if (usesHttp) {
    p.log.warn('HTTP is not encrypted. Only use it for a trusted local or LAN server, like Ollama on your own network.');
    const allowLocal = await p.confirm({
      message: 'Allow insecure HTTP for this local/LAN server?',
      initialValue: true,
    });
    if (p.isCancel(allowLocal)) return 0;
    allowInsecureHttp = allowLocal === true;
  }

  const apiKey = await p.password({
    message: 'API key (leave empty for local servers without auth):',
  });
  if (p.isCancel(apiKey)) return 0;

  const wantsHeaders = await p.confirm({
    message: 'Does this endpoint need extra custom headers? (e.g. a plan/auth-tracking header)',
    initialValue: false,
  });
  if (p.isCancel(wantsHeaders)) return 0;

  const headers: Record<string, string> = {};
  if (wantsHeaders) {
    for (;;) {
      const headerLine = await p.text({
        message: 'Header (leave empty when done):',
        placeholder: 'X-Plan: coding',
      });
      if (p.isCancel(headerLine)) return 0;
      const trimmed = String(headerLine).trim();
      if (!trimmed) break;
      const idx = trimmed.indexOf(':');
      if (idx < 1) {
        p.log.warn('Use the format "Name: Value" — skipped.');
        continue;
      }
      const name = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (name) headers[name] = value;
    }
  }

  const spinner = p.spinner();
  spinner.start('Testing connection...');
  const result = await addCustomEndpointProvider({
    displayName: String(displayName).trim(),
    baseUrl: String(baseUrl).trim(),
    apiKey: String(apiKey ?? '').trim(),
    kind: kindChoice as 'openai' | 'anthropic',
    allowInsecureLocal: allowInsecureHttp,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });
  spinner.stop('');

  if (!result.added) {
    p.log.error(result.error ?? 'Could not add custom provider.');
    if (result.hint) p.log.info(result.hint);
    return 1;
  }

  logConnected(result.provider?.name ?? 'Provider', result.modelCount ?? 0);
  return 0;
}

export async function runProvidersAdd(): Promise<number> {
  const registry = loadRegistry();
  const hasOpencode = findOpencodeBinary() !== null;

  const options: Array<{ value: string; label: string; hint: string }> = [];
  const addableTemplates = listAddableTemplates(registry.providers.map(p => p.id));
  if (addableTemplates.length > 0) {
    options.push({
      value: 'templates',
      label: 'Add Groq, Mistral, Together AI, …',
      hint: `${addableTemplates.length} provider${addableTemplates.length === 1 ? '' : 's'} available`,
    });
  }
  options.push({
    value: 'custom',
    label: 'Custom server (Advanced)',
    hint: 'OpenAI-compatible or Claude-style API URL',
  });
  options.push({
    value: 'import',
    label: 'Import providers from OpenCode CLI',
    hint: hasOpencode ? 'Import Groq, OpenAI, etc. from your OpenCode config' : 'Requires OpenCode CLI',
  });

  const choice = await p.select({ message: 'Add a provider', options });
  if (p.isCancel(choice)) {
    p.cancel('Cancelled.');
    return 0;
  }

  if (choice === 'import') {
    if (!hasOpencode) {
      p.log.error('OpenCode CLI not found. Install from https://opencode.ai');
      return 1;
    }
    return runProvidersImport();
  }
  if (choice === 'templates') return runTemplateAddFlow();
  if (choice === 'custom') return runCustomEndpointAddFlow();
  return 0;
}

export async function runProvidersHub(): Promise<number> {
  const hasOpencode = findOpencodeBinary() !== null;

  while (true) {
    const entries = await resolveProvidersForDisplay();
    const options: Array<{ value: string; label: string; hint?: string }> = [
      { value: 'add', label: pc.bold('+ Add a provider'), hint: '' },
    ];

    for (const entry of entries) {
      const hint = entry.id;
      const value = providerHubChoiceValue(entry);
      options.push({
        value,
        label: providerLabel(entry.name, entry.modelCount, entry.enabled),
        hint,
      });
    }

    options.push({ value: 'auth-menu', label: '→ Sign in with OAuth', hint: 'GitHub Copilot · xAI · OpenAI' });
    if (entries.length > 0) {
      options.push({ value: 'refresh-all', label: '↺ Refresh all models', hint: 'Update model lists for all providers' });
    }
    if (hasOpencode) {
      options.push({ value: 'import', label: '→ Import providers from OpenCode CLI', hint: 'One-time import' });
    }
    options.push({ value: 'done', label: 'Done', hint: '' });

    const choice = await p.select({
      message: entries.length > 0 ? 'Your AI providers' : 'Get started',
      options,
    });
    if (p.isCancel(choice) || choice === 'done') {
      return 0;
    }
    if (choice === 'add') {
      await runProvidersAdd();
      continue;
    }
    if (choice === 'import') {
      await runProvidersImport();
      continue;
    }
    if (choice === 'refresh-all') {
      await runProvidersRefreshModels();
      continue;
    }
    if (choice === 'auth-menu') {
      const configuredIds = loadRegistry().providers.map(provider => provider.id);
      const oauthTemplates = listVisibleOAuthTemplates(configuredIds);
      if (oauthTemplates.length === 0) {
        p.log.info('All visible OAuth providers are already configured.');
        continue;
      }
      const providerId = await p.select({
        message: 'Which provider?',
        options: oauthTemplates.map(template => ({
          value: template.id,
          label: template.name,
          hint: 'device code',
        })),
      });
      if (!p.isCancel(providerId)) await runProvidersAuth(providerId as string);
      continue;
    }
    if (typeof choice === 'string' && choice.startsWith('cloud:')) {
      const id = choice.slice('cloud:'.length);
      if (id === 'opencode') await runOpenCodeCloudDetail();
      continue;
    }
    if (typeof choice === 'string' && choice.startsWith('provider:')) {
      const id = choice.slice('provider:'.length);
      const outcome = await runProviderDetail(id);
      if (outcome === 'removed') continue;
    }
  }
}

export async function runProvidersCommand(args: string[]): Promise<number> {
  const parsed = parseProvidersArgs(args);
  if (parsed.error) {
    p.log.error(parsed.error);
    return 1;
  }
  if (parsed.showHelp) {
    console.log(providersHelpText());
    return 0;
  }

  if (parsed.subcommand === 'import') return runProvidersImport();
  if (parsed.subcommand === 'list') return runProvidersList();
  if (parsed.subcommand === 'add') return runProvidersAdd();
  if (parsed.subcommand === 'remove' && parsed.removeId) return runProvidersRemove(parsed.removeId);
  if (parsed.subcommand === 'refresh-models') return runProvidersRefreshModels(parsed.removeId);
  if (parsed.subcommand === 'auth') {
    if (parsed.showHelp || !parsed.removeId) {
      console.log(providerAuthHelpText());
      return 0;
    }
    return runProvidersAuth(parsed.removeId, parsed.authMethod);
  }
  return runProvidersHub();
}
