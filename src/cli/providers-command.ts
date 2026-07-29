// src/cli/providers-command.ts — anygate providers command

import pc from 'picocolors'
import * as p from '@clack/prompts'
import {
  upgradeGlobalOpencodeCredential,
  readGlobalOpencodeCredential,
  resolveProviderCredential,
} from '../config/env.js'
import { findOpencodeBinary } from '../providers/opencode-serve.js'
import {
  listAddableTemplates,
  listSupportedTemplates,
  filterTemplates,
  getTemplateById,
  type ProviderTemplate,
} from '../registry/templates/provider-templates.js'
import { addProviderFromTemplate } from '../registry/templates/add-template.js'
import { addCustomEndpointProvider } from '../registry/storage/custom-endpoint.js'
import { validateCustomEndpointUrl } from '../registry/validation/url-security.js'
import {
  addGoRegistryStub,
  addZenRegistryStub,
  removeProviderFromRegistry,
  toggleProviderEnabled,
} from '../registry/storage/crud.js'
import { loadRegistry } from '../registry/storage/io.js'
import { refreshAllProviderModels, refreshProviderModels } from '../registry/sync/refresh-models.js'
import { resolveRefreshCredential } from '../registry/sync/refresh-credentials.js'
import { resolveOrCollectApiKey } from '../apps/shared/key-setup.js'
import {
  fmtCount,
  fmtProvider,
  fmtUrl,
  logConnected,
  printPanel,
  printImportConflictPanel,
  printCloudProviderPanel,
  printProviderDetailPanel,
} from '../apps/shared/ui.js'
import {
  authenticateProvider,
  providerAuthHelpText,
  type ProviderAuthMethod,
} from '../registry/provider-auth.js'
import {
  importFromOpencode,
  type ImportConflictChoice,
  type ImportConflictContext,
} from '../registry/loader/import-opencode.js'
import { listVisibleOAuthTemplates } from '../registry/templates/provider-templates.js'
import {
  resolveProvidersForDisplay,
  formatRegistryAuthLabel,
} from '../registry/provider-catalog.js'
import { cachedModelToLocal } from '../registry/loader/materialize.js'
import { browseAllModels } from '../apps/shared/prompts.js'
import { supportsNativeOAuth } from '../auth/types.js'
import { loadPreferences } from '../storage/config.js'
import type { LocalProvider } from '../types/index.js'

export type { ProviderTemplate } from '../registry/templates/provider-templates.js'
export { listAddableTemplates, getTemplateById } from '../registry/templates/provider-templates.js'
export { providerAuthHelpText }
export type { ProviderAuthMethod }

export function providerHubChoiceValue(entry: { id: string }): string {
  return `provider:${entry.id}`
}

export async function runProvidersImport(): Promise<number> {
  const registry = loadRegistry()
  const hasExisting = registry.providers.length > 0

  const resolveConflict = hasExisting
    ? async (ctx: ImportConflictContext): Promise<ImportConflictChoice> => {
        printImportConflictPanel(ctx.existing.name, ctx.existingKeyHint, ctx.incomingKeyHint)
        const choice = await p.select({
          message: 'Which configuration should we keep?',
          options: [
            {
              value: 'keep',
              label: pc.cyan('Keep mine'),
              hint: 'Leave your current anygate config unchanged',
            },
            {
              value: 'import',
              label: pc.cyan('Use imported'),
              hint: 'Replace with OpenCode settings and refresh models',
            },
            { value: 'skip', label: pc.dim('Skip this provider'), hint: '' },
          ],
        })
        if (p.isCancel(choice)) return 'skip' as ImportConflictChoice
        return choice as ImportConflictChoice
      }
    : undefined

  const spinner = p.spinner()
  spinner.start('Importing from OpenCode...')
  const result = await importFromOpencode({ resolveConflict })
  spinner.stop('')

  if (result.error) {
    p.log.error(result.error)
    return 1
  }

  if (result.imported.length === 0 && result.skipped.length === 0) {
    p.log.warn('No configured providers found in OpenCode.')
    p.log.info('Add providers in OpenCode first, or use anygate providers add.')
    return 0
  }

  if (result.authFileWarning) {
    p.log.warn(result.authFileWarning)
  }

  const importedNames = result.imported.map(pr => pr.name).join(', ')
  const modelTotal = result.imported.reduce((n, pr) => n + (pr.modelsCache?.models.length ?? 0), 0)
  const credNote = result.oauthImported > 0 ? ` (${result.oauthImported} via OAuth)` : ''
  p.log.success(
    `Imported ${importedNames} — ${modelTotal} model${modelTotal === 1 ? '' : 's'}, ` +
      `${result.keysSaved} credential${result.keysSaved === 1 ? '' : 's'} saved to Keychain${credNote}.`
  )

  if (result.skipped.length > 0) {
    for (const s of result.skipped) {
      const reason =
        s.reason === 'user-skipped'
          ? 'skipped by you'
          : s.reason === 'conflict-kept'
            ? 'kept your existing config'
            : s.reason === 'oauth-no-token'
              ? 'OAuth provider in OpenCode but not signed in — run anygate providers auth'
              : s.reason === 'no-api-key'
                ? 'no API key in OpenCode — add key there or use anygate providers add'
                : s.reason === 'manual-only'
                  ? 'uses gcloud/AWS credentials — not importable via API key'
                  : s.reason === 'placeholder-key'
                    ? 'placeholder API key — provider not imported'
                    : s.reason === 'invalid-key'
                      ? 'API key failed verification — provider not imported'
                      : s.reason === 'credential-save-failed'
                        ? 'could not save credential — provider not imported'
                        : s.reason
      p.log.warn(`Skipped ${s.name} (${s.id}): ${reason}`)
    }
  }

  if (result.keysSkipped.length > 0) {
    for (const k of result.keysSkipped) {
      if (k.detail) {
        p.log.info(`${k.name} (${k.id}): ${k.detail}`)
      }
    }
  }

  if (result.imported.length > 0) {
    const refreshSpinner = p.spinner()
    refreshSpinner.start('Fetching model capabilities from providers...')
    const currentReg = loadRegistry()
    for (const provider of result.imported) {
      const key = await resolveRefreshCredential(provider, async pr =>
        resolveProviderCredential(pr.id, pr.authRef)
      )
      await refreshProviderModels(provider.id, key, currentReg)
    }
    refreshSpinner.stop('Model capabilities refreshed.')
  }

  return 0
}

export async function runProvidersAuth(
  providerId: string,
  method?: ProviderAuthMethod
): Promise<number> {
  try {
    const result = await authenticateProvider(providerId, { method })
    p.log.success(`Signed in to ${result.registryProvider.name} — credential saved to Keychain.`)
    return 0
  } catch (err) {
    if (err instanceof Error && err.message === 'Cancelled') {
      p.cancel('Cancelled.')
      return 0
    }
    p.log.error(err instanceof Error ? err.message : String(err))
    return 1
  }
}

export async function runProvidersRemove(id: string, interactive = false): Promise<number> {
  const registry = loadRegistry()
  const provider = registry.providers.find(pr => pr.id === id)
  if (!provider) {
    p.log.error(`Provider not found: ${id}`)
    return 1
  }

  if (interactive) {
    const confirm = await p.confirm({
      message: `Remove ${provider.name} (${id})?`,
      initialValue: false,
    })
    if (p.isCancel(confirm) || !confirm) {
      p.cancel('Cancelled.')
      return 0
    }
  }

  const result = await removeProviderFromRegistry(id)
  if (!result.removed) {
    p.log.error(result.error ?? `Could not remove ${id}`)
    return 1
  }

  p.log.success(`Removed ${result.name ?? id}.`)
  if (result.credentialDeleted) {
    p.log.info('Provider API key removed from Keychain.')
  }
  return 0
}

export async function runProvidersList(): Promise<number> {
  const entries = await resolveProvidersForDisplay()
  if (entries.length === 0) {
    p.log.info('No providers configured. Run anygate providers add or import.')
    return 0
  }

  console.log('')
  for (const entry of entries) {
    const status = entry.enabled ? pc.green('●') : pc.dim('○')
    console.log(
      `  ${status} ${pc.bold(entry.name)} ${pc.dim(`(${entry.id})`)} — ` +
        `${entry.modelCount} model${entry.modelCount === 1 ? '' : 's'}, auth: ${entry.authLabel}`
    )
  }
  console.log('')
  return 0
}

export async function runProvidersRefreshModels(providerId?: string): Promise<number> {
  const resolveKey = async (provider: import('../registry/types.js').RegistryProvider) =>
    resolveProviderCredential(provider.id, provider.authRef)

  if (providerId) {
    const registry = loadRegistry()
    const provider = registry.providers.find(pItem => pItem.id === providerId)
    if (!provider) {
      p.log.error(`Provider not found: ${providerId}`)
      return 1
    }
    const spinner = p.spinner()
    spinner.start(`Refreshing ${provider.name}...`)
    const key = await resolveRefreshCredential(provider, async pItem =>
      resolveProviderCredential(pItem.id, pItem.authRef)
    )
    const result = await refreshProviderModels(providerId, key)
    spinner.stop('')
    if (result.skipped) {
      const countNote = result.modelCount ? ` (${result.modelCount} cached models kept)` : ''
      p.log.warn(`${result.name}: ${result.reason}${countNote}`)
      return 0
    }
    if (!result.ok) {
      p.log.error(`${result.name}: ${result.reason ?? 'Refresh failed.'}`)
      return 1
    }
    const diff =
      result.previousModelCount === undefined
        ? 0
        : (result.modelCount ?? 0) - result.previousModelCount
    const diffStr =
      result.previousModelCount === undefined
        ? ''
        : diff > 0
          ? ` (+${diff})`
          : diff < 0
            ? ` (${diff})`
            : ''
    p.log.success(
      `${result.name}: ${result.modelCount} model${result.modelCount === 1 ? '' : 's'} updated${diffStr}.`
    )
    if (result.reason) {
      p.log.warn(result.reason)
    }
    return 0
  }

  const spinner = p.spinner()
  spinner.start('Refreshing model lists...')
  const { refreshed } = await refreshAllProviderModels(resolveKey)
  spinner.stop('')

  const ok = refreshed.filter(r => r.ok && !r.skipped)
  const skipped = refreshed.filter(r => r.skipped)
  const failed = refreshed.filter(r => !r.ok)

  if (ok.length > 0) {
    p.log.success(`Updated ${ok.length} provider${ok.length === 1 ? '' : 's'}.`)
    for (const r of ok) {
      const diff =
        r.previousModelCount === undefined ? 0 : (r.modelCount ?? 0) - r.previousModelCount
      const diffStr =
        r.previousModelCount === undefined
          ? ''
          : diff > 0
            ? ` (+${diff})`
            : diff < 0
              ? ` (${diff})`
              : ''
      p.log.info(`  ${r.name}: ${r.modelCount} model${r.modelCount === 1 ? '' : 's'}${diffStr}`)
      if (r.reason) {
        p.log.warn(`  ${r.reason}`)
      }
    }
  }
  for (const r of skipped) {
    const countNote = r.modelCount ? ` (${r.modelCount} cached models kept)` : ''
    p.log.warn(`Skipped ${r.name}: ${r.reason}${countNote}`)
  }
  for (const r of failed) {
    p.log.error(`${r.name}: ${r.reason ?? 'Refresh failed.'}`)
  }
  return failed.length > 0 ? 1 : 0
}

export async function pickTemplateFromCatalog(): Promise<ProviderTemplate | null> {
  while (true) {
    const registry = loadRegistry()
    const configuredIds = new Set(registry.providers.map(pItem => pItem.id))
    const templates = listAddableTemplates(configuredIds)
    if (templates.length === 0) return null

    const method = await p.select({
      message: `Choose a provider (${templates.length} available)`,
      options: [
        { value: 'search', label: 'Search providers', hint: 'e.g. gro, mistral, together' },
        { value: 'browse', label: 'Browse all providers', hint: 'Scroll the full list' },
        { value: 'back', label: 'Back', hint: '' },
      ],
    })
    if (p.isCancel(method) || method === 'back') return null

    if (method === 'browse') {
      const options = templates.map(t => ({
        value: t.id,
        label: t.name,
        hint: t.npm,
      }))
      const picked = await p.select({ message: 'Select a provider', options })
      if (p.isCancel(picked)) continue
      const template = templates.find(t => t.id === picked)
      if (template) return template
      continue
    }

    const searchInput = await p.text({
      message: 'Search providers:',
      placeholder: 'e.g. groq, mistral, openrouter',
    })
    if (p.isCancel(searchInput)) continue

    const query = String(searchInput)
    const matched = filterTemplates(templates, query)
    if (matched.length === 0) {
      const alreadyAdded = filterTemplates(listSupportedTemplates(), query).filter(t =>
        configuredIds.has(t.id)
      )
      if (alreadyAdded.length > 0) {
        p.log.info(`Already configured: ${alreadyAdded.map(t => t.name).join(', ')}`)
      } else {
        p.log.warn('No providers match — try a different search')
      }
      continue
    }

    const options = matched.map(t => ({
      value: t.id,
      label: t.name,
      hint: t.npm,
    }))
    const picked = await p.select({
      message: matched.length === 1 ? 'Match found' : `Select provider (${matched.length} matches)`,
      options,
    })
    if (p.isCancel(picked)) continue
    const template = matched.find(t => t.id === picked)
    if (template) return template
  }
}

export async function runOpenCodeCloudDetail(): Promise<'back'> {
  const registry = loadRegistry()
  const routes = registry.providers.filter(
    provider => provider.id === 'zen' || provider.id === 'go'
  )
  printCloudProviderPanel('OpenCode Zen / Go')
  if (routes.length === 0) return 'back'

  const choice = await p.select({
    message: 'Manage an OpenCode catalog',
    options: [
      ...routes.map(provider => ({
        value: provider.id,
        label: provider.name,
        hint: `${provider.modelsCache?.models.length ?? 0} cached models`,
      })),
      { value: 'back', label: 'Back', hint: '' },
    ],
  })
  if (!p.isCancel(choice) && choice !== 'back') {
    await runProviderDetail(String(choice))
  }
  return 'back'
}

export async function runProviderDetail(id: string): Promise<'back' | 'removed'> {
  const registry = loadRegistry()
  const provider = registry.providers.find(pr => pr.id === id)
  if (!provider) return 'back'

  const modelCount = provider.modelsCache?.models.length ?? 0
  const authLabel = formatRegistryAuthLabel(provider)
  printProviderDetailPanel(provider.name, modelCount, authLabel)

  const detailOptions: Array<{ value: string; label: string; hint?: string }> = []
  if (modelCount > 0) {
    detailOptions.push({
      value: 'browse',
      label: 'Browse models',
      hint: `Search or browse ${modelCount} model${modelCount === 1 ? '' : 's'}`,
    })
  }
  detailOptions.push({
    value: 'refresh',
    label: 'Refresh model list',
    hint: 'Fetch latest models from the provider API',
  })
  if (supportsNativeOAuth(id) || provider.authType === 'oauth') {
    detailOptions.push({
      value: 'auth',
      label: 'Sign in again (OAuth)',
      hint: 'Refresh OAuth tokens or switch accounts',
    })
  }
  detailOptions.push(
    {
      value: 'toggle',
      label: provider.enabled ? 'Disable provider' : 'Enable provider',
      hint: provider.enabled ? 'Hide from anygate claude picker' : 'Show in anygate claude picker',
    },
    {
      value: 'remove',
      label: 'Remove provider',
      hint: 'Delete from registry and Keychain when safe',
    },
    { value: 'back', label: 'Back', hint: '' }
  )

  const action = await p.select({
    message: 'What would you like to do?',
    options: detailOptions,
  })
  if (p.isCancel(action) || action === 'back') return 'back'

  if (action === 'browse') {
    const cachedModels = provider.modelsCache?.models ?? []
    const localModels = cachedModels
      .map(m => cachedModelToLocal(m, provider))
      .filter((m): m is NonNullable<typeof m> => m !== null)
    const localProvider: LocalProvider = {
      id: provider.id,
      name: provider.name,
      apiKey: '',
      models: localModels,
    }
    await browseAllModels(localProvider, loadPreferences())
    return 'back'
  }

  if (action === 'refresh') {
    await runProvidersRefreshModels(id)
    return 'back'
  }

  if (action === 'auth') {
    await runProvidersAuth(id)
    return 'back'
  }

  if (action === 'toggle') {
    const result = toggleProviderEnabled(id)
    if (result.toggled) {
      p.log.success(`${provider.name} ${result.enabled ? 'enabled' : 'disabled'}.`)
    }
    return 'back'
  }

  const code = await runProvidersRemove(id, true)
  return code === 0 ? 'removed' : 'back'
}

function providerLabel(name: string, modelCount: number, enabled: boolean): string {
  const status = enabled ? pc.green('●') : pc.dim('○')
  return `${status} ${name} (${modelCount} model${modelCount === 1 ? '' : 's'})`
}

export type ProvidersSubcommand =
  'hub' | 'add' | 'import' | 'list' | 'remove' | 'refresh-models' | 'auth' | 'help'

export interface ParsedProvidersArgs {
  subcommand: ProvidersSubcommand
  showHelp: boolean
  removeId?: string
  authMethod?: ProviderAuthMethod
  error?: string
}

export function parseProvidersArgs(args: string[]): ParsedProvidersArgs {
  if (args.includes('--help') || args.includes('-h')) {
    return { subcommand: 'help', showHelp: true }
  }
  const first = args[0]
  if (!first) return { subcommand: 'hub', showHelp: false }

  if (first === 'add') return { subcommand: 'add', showHelp: false }
  if (first === 'import') return { subcommand: 'import', showHelp: false }
  if (first === 'list') return { subcommand: 'list', showHelp: false }

  if (first === 'remove' || first === 'rm') {
    const targetId = args[1]
    if (!targetId)
      return { subcommand: 'remove', showHelp: true, error: 'Usage: anygate providers remove <id>' }
    return { subcommand: 'remove', showHelp: false, removeId: targetId }
  }

  if (first === 'refresh-models') {
    const targetId = args[1]
    return { subcommand: 'refresh-models', showHelp: false, removeId: targetId }
  }

  if (first === 'auth') {
    const targetId = args[1]
    const native = args.includes('--native')
    const broker = args.includes('--broker')
    const authMethod: ProviderAuthMethod | undefined = native
      ? 'native'
      : broker
        ? 'broker'
        : undefined
    return { subcommand: 'auth', showHelp: !targetId, removeId: targetId, authMethod }
  }

  return { subcommand: 'hub', showHelp: false }
}

export function providersHelpText(): string {
  return `${pc.bold('anygate providers')} — manage AI providers & model catalogs (Phase 1.1)

${pc.bold('Usage:')}
  anygate providers                 Open interactive provider manager
  anygate providers add             Add a provider (template, custom, or import)
  anygate providers import          Import providers from OpenCode CLI
  anygate providers list            List configured providers & status
  anygate providers remove <id>     Remove a provider
  anygate providers refresh-models  Refresh model catalog for all/specific provider
  anygate providers auth <id>       Sign in with OAuth (xAI, OpenAI, GitHub Copilot, …)`
}

export async function runTemplateAddFlow(t?: ProviderTemplate): Promise<number> {
  const template = t ?? (await pickTemplateFromCatalog())
  if (!template) return 0

  const inputKey = await p.password({
    message: `API key for ${template.name}${template.apiKeyOptional ? ' (optional)' : ''}:`,
  })
  if (p.isCancel(inputKey)) return 0
  const apiKey = String(inputKey ?? '').trim()

  const result = await addProviderFromTemplate(template, apiKey)
  if (!result.added) {
    if (result.error) p.log.error(result.error)
    return 1
  }

  logConnected(template.name, result.modelCount ?? 0)
  return 0
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
  })
  if (p.isCancel(kindChoice) || kindChoice === 'back') return 0

  const displayName = await p.text({
    message: 'Display name:',
    placeholder: 'My Work LLM',
    validate: v => (v.trim() ? undefined : 'Name is required'),
  })
  if (p.isCancel(displayName)) return 0

  const baseUrl = await p.text({
    message: 'Base URL:',
    placeholder:
      kindChoice === 'openai' ? 'https://api.together.xyz/v1' : 'https://api.anthropic.com',
    validate: v => (v.trim() ? undefined : 'URL is required'),
  })
  if (p.isCancel(baseUrl)) return 0

  const usesHttp = /^http:\/\//i.test(String(baseUrl).trim())
  let allowInsecureHttp = false
  if (usesHttp) {
    p.log.warn(
      'HTTP is not encrypted. Only use it for a trusted local or LAN server, like Ollama on your own network.'
    )
    const allowLocal = await p.confirm({
      message: 'Allow insecure HTTP for this local/LAN server?',
      initialValue: true,
    })
    if (p.isCancel(allowLocal)) return 0
    allowInsecureHttp = allowLocal === true
  }

  const apiKey = await p.password({
    message: 'API key (leave empty for local servers without auth):',
  })
  if (p.isCancel(apiKey)) return 0

  const wantsHeaders = await p.confirm({
    message: 'Does this endpoint need extra custom headers? (e.g. a plan/auth-tracking header)',
    initialValue: false,
  })
  if (p.isCancel(wantsHeaders)) return 0

  const headers: Record<string, string> = {}
  if (wantsHeaders) {
    for (;;) {
      const headerLine = await p.text({
        message: 'Header (leave empty when done):',
        placeholder: 'X-Plan: coding',
      })
      if (p.isCancel(headerLine)) return 0
      const trimmed = String(headerLine).trim()
      if (!trimmed) break
      const idx = trimmed.indexOf(':')
      if (idx < 1) {
        p.log.warn('Use the format "Name: Value" — skipped.')
        continue
      }
      const name = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim()
      if (name) headers[name] = value
    }
  }

  const spinner = p.spinner()
  spinner.start('Testing connection...')
  const result = await addCustomEndpointProvider({
    displayName: String(displayName).trim(),
    baseUrl: String(baseUrl).trim(),
    apiKey: String(apiKey ?? '').trim(),
    kind: kindChoice as 'openai' | 'anthropic',
    allowInsecureLocal: allowInsecureHttp,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  })
  spinner.stop('')

  if (!result.added) {
    p.log.error(result.error ?? 'Could not add custom provider.')
    if (result.hint) p.log.info(result.hint)
    return 1
  }

  logConnected(result.provider?.name ?? 'Provider', result.modelCount ?? 0)
  return 0
}

export async function runProvidersAdd(): Promise<number> {
  const registry = loadRegistry()
  const hasOpencode = findOpencodeBinary() !== null

  const options: Array<{ value: string; label: string; hint: string }> = []
  const addableTemplates = listAddableTemplates(registry.providers.map(pItem => pItem.id))
  if (addableTemplates.length > 0) {
    options.push({
      value: 'templates',
      label: 'Add Groq, Mistral, Together AI, …',
      hint: `${addableTemplates.length} provider${addableTemplates.length === 1 ? '' : 's'} available`,
    })
  }
  options.push({
    value: 'custom',
    label: 'Custom server (Advanced)',
    hint: 'OpenAI-compatible or Claude-style API URL',
  })
  options.push({
    value: 'import',
    label: 'Import providers from OpenCode CLI',
    hint: hasOpencode
      ? 'Import Groq, OpenAI, etc. from your OpenCode config'
      : 'Requires OpenCode CLI',
  })

  const choice = await p.select({ message: 'Add a provider', options })
  if (p.isCancel(choice)) {
    p.cancel('Cancelled.')
    return 0
  }

  if (choice === 'import') {
    if (!hasOpencode) {
      p.log.error('OpenCode CLI not found. Install from https://opencode.ai')
      return 1
    }
    return runProvidersImport()
  }
  if (choice === 'templates') return runTemplateAddFlow()
  if (choice === 'custom') return runCustomEndpointAddFlow()
  return 0
}

export async function runProvidersHub(): Promise<number> {
  const hasOpencode = findOpencodeBinary() !== null

  while (true) {
    const entries = await resolveProvidersForDisplay()
    const options: Array<{ value: string; label: string; hint?: string }> = [
      { value: 'add', label: pc.bold('+ Add a provider'), hint: '' },
    ]

    for (const entry of entries) {
      const hint = entry.id
      const value = providerHubChoiceValue(entry)
      options.push({
        value,
        label: providerLabel(entry.name, entry.modelCount, entry.enabled),
        hint,
      })
    }

    options.push({
      value: 'auth-menu',
      label: '→ Sign in with OAuth',
      hint: 'GitHub Copilot · xAI · OpenAI',
    })
    if (entries.length > 0) {
      options.push({
        value: 'refresh-all',
        label: '↺ Refresh all models',
        hint: 'Update model lists for all providers',
      })
    }
    if (hasOpencode) {
      options.push({
        value: 'import',
        label: '→ Import providers from OpenCode CLI',
        hint: 'One-time import',
      })
    }
    options.push({ value: 'done', label: 'Done', hint: '' })

    const choice = await p.select({
      message: entries.length > 0 ? 'Your AI providers' : 'Get started',
      options,
    })
    if (p.isCancel(choice) || choice === 'done') {
      return 0
    }
    if (choice === 'add') {
      await runProvidersAdd()
      continue
    }
    if (choice === 'import') {
      await runProvidersImport()
      continue
    }
    if (choice === 'refresh-all') {
      await runProvidersRefreshModels()
      continue
    }
    if (choice === 'auth-menu') {
      const configuredIds = loadRegistry().providers.map(provider => provider.id)
      const oauthTemplates = listVisibleOAuthTemplates(configuredIds)
      if (oauthTemplates.length === 0) {
        p.log.info('All visible OAuth providers are already configured.')
        continue
      }
      const providerId = await p.select({
        message: 'Which provider?',
        options: oauthTemplates.map(template => ({
          value: template.id,
          label: template.name,
          hint: 'device code',
        })),
      })
      if (!p.isCancel(providerId)) await runProvidersAuth(providerId as string)
      continue
    }
    if (typeof choice === 'string' && choice.startsWith('cloud:')) {
      const id = choice.slice('cloud:'.length)
      if (id === 'opencode') await runOpenCodeCloudDetail()
      continue
    }
    if (typeof choice === 'string' && choice.startsWith('provider:')) {
      const id = choice.slice('provider:'.length)
      const outcome = await runProviderDetail(id)
      if (outcome === 'removed') continue
    }
  }
}

export async function runProvidersCommand(args: string[]): Promise<number> {
  const parsed = parseProvidersArgs(args)
  if (parsed.error) {
    p.log.error(parsed.error)
    return 1
  }
  if (parsed.showHelp) {
    console.log(providersHelpText())
    return 0
  }

  if (parsed.subcommand === 'import') return runProvidersImport()
  if (parsed.subcommand === 'list') return runProvidersList()
  if (parsed.subcommand === 'add') return runProvidersAdd()
  if (parsed.subcommand === 'remove' && parsed.removeId) return runProvidersRemove(parsed.removeId)
  if (parsed.subcommand === 'refresh-models') return runProvidersRefreshModels(parsed.removeId)
  if (parsed.subcommand === 'auth') {
    if (parsed.showHelp || !parsed.removeId) {
      console.log(providerAuthHelpText())
      return 0
    }
    return runProvidersAuth(parsed.removeId, parsed.authMethod)
  }
  return runProvidersHub()
}
