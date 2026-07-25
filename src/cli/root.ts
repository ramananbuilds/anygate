// src/cli/root.ts — bare `anygate` command: onboarding flow + main menu
//
// When the user runs `anygate` with no subcommand, this handler takes over.
// On first run (no providers configured) it runs a 3-step onboarding flow:
//   1. Categorize providers (keyless vs API-key-required)
//   2. Handle each selection (paste key, open signup, skip)
//   3. Show summary
// On subsequent runs it shows a main menu with launch shortcuts.

import pc from 'picocolors';
import * as p from '@clack/prompts';
import open from 'open';
import {
  printOnboardingPanel,
  printProviderCategoryPanel,
  printSetupSummaryPanel,
  printMainMenuPanel,
  printApiKeyProviderPanel,
  gateIntro,
  gateOutro,
  fmtCommand,
} from '../apps/shared/ui.js';
import {
  listSupportedTemplates,
  getTemplateById,
  type ProviderTemplate,
} from '../registry/templates/provider-templates.js';
import { addProviderFromTemplate } from '../registry/templates/add-template.js';
import { loadRegistry } from '../registry/storage/io.js';
import { resolveProvidersForDisplay } from '../registry/provider-catalog.js';
import { VERSION } from '../config/constants.js';
import type { ParsedArgs } from '../types/index.js';

/** Templates shown in the onboarding flow, in display order. */
const ONBOARDING_TEMPLATES = ['kilo', 'nvidia', 'groq', 'mistral', 'cerebras'];

/** Categorize onboarding templates into keyless vs API-key-required. */
function categorizeOnboardingProviders(): {
  keyless: ProviderTemplate[];
  apiKeyRequired: ProviderTemplate[];
} {
  const templates = ONBOARDING_TEMPLATES
    .map(id => getTemplateById(id))
    .filter((t): t is ProviderTemplate => t !== undefined && t.supported);

  const keyless: ProviderTemplate[] = [];
  const apiKeyRequired: ProviderTemplate[] = [];

  for (const t of templates) {
    if (t.apiKeyOptional || t.anonymousFreeModels) {
      keyless.push(t);
    } else {
      apiKeyRequired.push(t);
    }
  }

  return { keyless, apiKeyRequired };
}

/** Check if the user has any providers configured. */
function hasConfiguredProviders(): boolean {
  const registry = loadRegistry();
  return registry.providers.length > 0;
}

/** Enable a keyless provider (no API key needed). */
async function handleKeylessProvider(template: ProviderTemplate): Promise<boolean> {
  p.log.info(`Adding ${template.name}...`);
  const result = await addProviderFromTemplate(template, '');
  if (result.added) {
    p.log.success(`${template.name} enabled (no key needed)`);
    return true;
  }
  if (result.error) {
    p.log.error(`${template.name}: ${result.error}`);
  }
  return false;
}

/** Handle an API-key-required provider: paste key, open signup, or skip. */
async function handleApiKeyProvider(template: ProviderTemplate): Promise<boolean | null> {
  const signupUrl = template.signupUrl ?? 'https://opencode.ai/auth';
  printApiKeyProviderPanel(template.name, signupUrl);

  let choice = await p.select({
    message: `How would you like to set up ${template.name}?`,
    options: [
      {
        value: 'paste',
        label: pc.cyan('I have a key — paste it now'),
        hint: 'Key stored securely in your system keychain',
      },
      {
        value: 'signup',
        label: pc.cyan('Open signup page in browser'),
        hint: `Free tier at ${signupUrl}`,
      },
      {
        value: 'skip',
        label: pc.dim('Skip for now'),
        hint: 'You can add this later with anygate providers add',
      },
    ],
  });

  if (p.isCancel(choice)) return null;

  if (choice === 'signup') {
    try {
      await open(signupUrl);
      p.log.info(`Opened ${signupUrl} in your browser.`);
    } catch {
      p.log.warn(`Could not open browser. Visit: ${signupUrl}`);
    }
    // After opening signup, ask if they have a key now
    const retry = await p.confirm({
      message: 'Did you get your API key?',
      initialValue: false,
    });
    if (p.isCancel(retry) || !retry) return false;
    choice = 'paste';
  }

  if (choice === 'paste') {
    const apiKey = await p.password({
      message: `Paste your ${template.name} API key:`,
      validate: (val) => val.trim() ? undefined : 'Key cannot be empty',
    });
    if (p.isCancel(apiKey)) return null;

    p.log.info(`Adding ${template.name}...`);
    const result = await addProviderFromTemplate(template, String(apiKey).trim());
    if (result.added) {
      p.log.success(`${template.name} configured`);
      return true;
    }
    if (result.error) {
      p.log.error(`${template.name}: ${result.error}`);
    }
    return false;
  }

  // skip
  return false;
}

/** Step 1: Categorize providers and let user select which to configure. */
async function step1CategorizeProviders(
  keyless: ProviderTemplate[],
  apiKeyRequired: ProviderTemplate[],
): Promise<{ selectedKeyless: ProviderTemplate[]; selectedApiKey: ProviderTemplate[] } | null> {
  printProviderCategoryPanel();

  // Build selectable options
  const options: Array<{ value: string; label: string; hint: string }> = [];

  if (keyless.length > 0) {
    options.push({
      value: '__keyless_header__',
      label: pc.dim('── Keyless (works instantly) ──'),
      hint: '',
    });
    for (const t of keyless) {
      options.push({
        value: `keyless:${t.id}`,
        label: `${pc.green('✓')} ${t.name}`,
        hint: 'no key needed',
      });
    }
  }

  if (apiKeyRequired.length > 0) {
    options.push({
      value: '__apikey_header__',
      label: pc.dim('── API Key Required (free tier) ──'),
      hint: '',
    });
    for (const t of apiKeyRequired) {
      options.push({
        value: `apikey:${t.id}`,
        label: t.name,
        hint: `free at ${t.signupUrl ?? 'console.groq.com'}`,
      });
    }
  }

  options.push({
    value: '__continue__',
    label: pc.cyan('Continue'),
    hint: 'configure selected providers',
  });

  const selected = new Set<string>();
  let selectedKeyless: ProviderTemplate[] = [];
  let selectedApiKey: ProviderTemplate[] = [];

  // Multi-select loop
  while (true) {
    const currentOptions = options.map(opt => ({
      ...opt,
      label: selected.has(opt.value) && !opt.value.startsWith('__') && opt.value !== '__continue__'
        ? `${pc.green('✓')} ${opt.label.replace(/^[✓●]\s*/, '')}`
        : opt.label,
    }));

    const choice = await p.select({
      message: 'Select providers to configure (Space to toggle, Enter to continue):',
      options: currentOptions,
    });

    if (p.isCancel(choice)) return null;

    if (choice === '__continue__') break;

    // Toggle selection
    if (selected.has(choice)) {
      selected.delete(choice);
    } else {
      selected.add(choice);
    }

    // Rebuild selected arrays
    selectedKeyless = [];
    selectedApiKey = [];
    for (const val of selected) {
      if (val.startsWith('keyless:')) {
        const t = keyless.find(k => k.id === val.slice('keyless:'.length));
        if (t) selectedKeyless.push(t);
      } else if (val.startsWith('apikey:')) {
        const t = apiKeyRequired.find(k => k.id === val.slice('apikey:'.length));
        if (t) selectedApiKey.push(t);
      }
    }
  }

  // If nothing selected, select all by default
  if (selectedKeyless.length === 0 && selectedApiKey.length === 0) {
    selectedKeyless = [...keyless];
    selectedApiKey = [...apiKeyRequired];
  }

  return { selectedKeyless, selectedApiKey };
}

/** Step 2: Handle each selected provider. */
async function step2HandleSelections(
  keyless: ProviderTemplate[],
  apiKeyRequired: ProviderTemplate[],
): Promise<{ configured: Array<{ name: string; keyless: boolean }>; skipped: string[] }> {
  const configured: Array<{ name: string; keyless: boolean }> = [];
  const skipped: string[] = [];

  for (const t of keyless) {
    const result = await handleKeylessProvider(t);
    if (result) {
      configured.push({ name: t.name, keyless: true });
    } else {
      skipped.push(t.name);
    }
  }

  for (const t of apiKeyRequired) {
    const result = await handleApiKeyProvider(t);
    if (result === true) {
      configured.push({ name: t.name, keyless: false });
    } else if (result === false) {
      skipped.push(t.name);
    }
    // null = cancelled, treat as skip
  }

  return { configured, skipped };
}

/** Step 3: Show summary. */
function step3Summary(
  configured: Array<{ name: string; keyless: boolean }>,
  skipped: string[],
): void {
  printSetupSummaryPanel(configured, skipped);
}

/** Run the full onboarding flow for first-time users. */
async function runOnboardingFlow(): Promise<number> {
  printOnboardingPanel();

  const { keyless, apiKeyRequired } = categorizeOnboardingProviders();

  if (keyless.length === 0 && apiKeyRequired.length === 0) {
    p.log.warn('No providers available for onboarding.');
    return 0;
  }

  // Step 1: Categorize and select
  const selection = await step1CategorizeProviders(keyless, apiKeyRequired);
  if (!selection) return 0;

  // Step 2: Handle each selection
  const { configured, skipped } = await step2HandleSelections(
    selection.selectedKeyless,
    selection.selectedApiKey,
  );

  // Step 3: Summary
  step3Summary(configured, skipped);

  return 0;
}

/** Run the main menu for subsequent runs. */
async function runMainMenu(): Promise<number> {
  const entries = await resolveProvidersForDisplay();
  const providerCount = entries.length;

  // Only show onboarding-list providers in the hint (not subscription/OAuth providers
  // like Antigravity, Claude Code, etc. that may have been configured via import)
  const onboardingEntries = entries.filter(e => ONBOARDING_TEMPLATES.includes(e.id));
  const freeHint = onboardingEntries.length > 0
    ? `free: ${onboardingEntries.map(e => e.name).join(', ')}`
    : providerCount > 0 ? `${providerCount} provider${providerCount === 1 ? '' : 's'} configured` : 'no providers configured';

  printMainMenuPanel(VERSION, providerCount);

  const options: Array<{ value: string; label: string; hint: string }> = [
    {
      value: 'claude',
      label: pc.cyan('Launch Claude'),
      hint: freeHint,
    },
    {
      value: 'codex',
      label: pc.cyan('Launch Codex'),
      hint: 'OpenAI Codex CLI with registry providers',
    },
    {
      value: 'providers',
      label: pc.cyan('Configure Providers'),
      hint: 'Add, import, or manage AI providers',
    },
    {
      value: 'onboarding',
      label: pc.cyan('Free Setup'),
      hint: 'Re-run the provider onboarding flow',
    },
    {
      value: 'doctor',
      label: pc.cyan('Doctor'),
      hint: 'Run environment diagnostics',
    },
    {
      value: 'server',
      label: pc.cyan('Server'),
      hint: 'Start a foreground API gateway',
    },
    {
      value: 'ui',
      label: pc.cyan('Dashboard'),
      hint: 'Open the web dashboard',
    },
    {
      value: 'settings',
      label: pc.cyan('Settings'),
      hint: 'Configure preferences and paths',
    },
    {
      value: 'quit',
      label: pc.dim('Quit'),
      hint: '',
    },
  ];

  const choice = await p.select({
    message: 'What would you like to do?',
    options,
  });

  if (p.isCancel(choice) || choice === 'quit') {
    gateOutro('Goodbye!');
    return 0;
  }

  // Dispatch to the appropriate command
  switch (choice) {
    case 'claude':
      gateOutro('Launching Claude Code...');
      return 0; // The actual launch is handled by the claude command
    case 'codex':
      gateOutro('Launching Codex...');
      return 0;
    case 'providers':
      gateOutro('Opening provider manager...');
      return 0;
    case 'onboarding':
      return runOnboardingFlow();
    case 'doctor':
      gateOutro('Running diagnostics...');
      return 0;
    case 'server':
      gateOutro('Starting server...');
      return 0;
    case 'ui':
      gateOutro('Opening dashboard...');
      return 0;
    case 'settings':
      gateOutro('Opening settings...');
      return 0;
    default:
      return 0;
  }
}

/** Main entry point for the bare `anygate` command. */
export async function handleRootCommand(_parsed: ParsedArgs): Promise<number> {
  // Non-interactive (piped stdin) — fall back to help text
  if (!process.stdin.isTTY) {
    const { printHelp, rootHelpText } = await import('../cli.js');
    printHelp(rootHelpText());
    return 0;
  }

  gateIntro('anygate');

  if (!hasConfiguredProviders()) {
    return runOnboardingFlow();
  }

  return runMainMenu();
}
