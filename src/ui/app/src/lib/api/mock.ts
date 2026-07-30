// Client-side fallbacks for backend-later endpoints. These implement the
// contract locally (localStorage / derivation) so the UI is fully functional
// before the backend ships. Once the backend implements the real endpoints,
// swap the calls in endpoints.ts — no UI change needed.
import type {
  HealthReport,
  Preset,
  DryRunPreview,
  UiProvider,
  UiModelsResponse,
  UiConfigResponse,
  UiAppsResponse,
  ServerStatusPayload,
  UiApp,
  FavoriteModel,
  UiProviderModel,
} from './types'

const PRESETS_KEY = 'anygate-presets'
const RECENT_FOLDERS_KEY = 'anygate-recent-folders'

// ── Health ───────────────────────────────────────────────────────────
export function healthFallback(err: unknown): HealthReport {
  const status = (err as { status?: number })?.status
  const degraded = status === 404
  return {
    ok: degraded,
    keychain: {
      available: false,
      note: degraded ? 'Health check needs a newer anygate' : 'Unable to reach backend',
    },
    conflictingEnvVars: [],
    port17645Available: true,
    providerReachability: [],
  }
}

// ── Presets (localStorage) ──────────────────────────────────────────
export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY)
    return raw ? (JSON.parse(raw) as Preset[]) : []
  } catch {
    return []
  }
}
export function storePresets(presets: Preset[]): void {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
  } catch {}
}

export function loadRecentFolders(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_FOLDERS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}
export function pushRecentFolder(folder: string): string[] {
  const list = loadRecentFolders().filter(f => f !== folder)
  list.unshift(folder)
  const next = list.slice(0, 10)
  try {
    localStorage.setItem(RECENT_FOLDERS_KEY, JSON.stringify(next))
  } catch {}
  return next
}

// ── Dry-run preview (client-computed) ───────────────────────────────
// Mirrors the buildChildEnv / printDryRun rules from the CLI.
export function computeDryRun(opts: {
  provider?: UiProvider
  modelId?: string
  contextWindow?: number
}): DryRunPreview {
  const { provider, modelId, contextWindow } = opts
  const env: DryRunPreview['env'] = []
  env.push({ key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:<proxy-port>' })
  if (provider && modelId) {
    env.push({ key: 'ANTHROPIC_MODEL', value: `${provider.id}__${modelId}` })
    env.push({ key: 'CLAUDE_CODE_MAX_CONTEXT_TOKENS', value: String(contextWindow ?? 200000) })
  }
  env.push({ key: 'ANTHROPIC_AUTH_TOKEN', value: '<proxy-local-token>', masked: true })
  env.push({ key: 'CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY', value: '1' })
  return {
    env,
    command:
      provider && modelId ? `anygate ${provider.id} --model ${modelId}` : 'anygate <provider>',
  }
}

// ── Mock data for full mock API mode ────────────────────────────────────

export interface MockModelOpts {
  id?: string
  name?: string
  family?: string
  brand?: string
  modelFormat?: 'anthropic' | 'openai' | 'cloud-code' | 'unsupported'
  upstreamModelId?: string
  isFree?: boolean
  contextWindow?: number
  reasoning?: boolean
  npm?: string
}

export function mockModel(opts: MockModelOpts): UiProviderModel {
  return {
    id: opts.id ?? 'gpt-5.5',
    name: opts.name ?? opts.id ?? 'GPT-5.5',
    isFree: opts.isFree ?? false,
    freeStatus: opts.isFree ? 'free' : undefined,
    contextWindow: opts.contextWindow ?? 16384,
    cost: { input: 1.5, output: 6 },
    format: opts.modelFormat === 'anthropic' ? 'anthropic' : 'openai',
    reasoning: opts.reasoning ?? false,
    supportedParameters: opts.reasoning
      ? ['reasoning', 'max_tokens', 'temperature']
      : ['max_tokens', 'temperature'],
    inputTypes: ['text'],
    sourceBackend: opts.id ?? 'mock',
    providerId: opts.family?.toLowerCase() ?? 'mock',
  }
}

export function mockProviders(): UiModelsResponse {
  const providers: UiProvider[] = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      favoriteName: 'Claude',
      hasKey: true,
      freeAccess: false,
      authType: 'api' as const,
      modelCount: 2,
      models: [
        {
          ...mockModel({
            id: 'claude-sonnet-4-5',
            name: 'Claude Sonnet 4.5',
            family: 'claude',
            brand: 'Anthropic',
            modelFormat: 'anthropic',
            upstreamModelId: 'claude-sonnet-4-5',
            contextWindow: 200000,
          }),
          providerId: 'anthropic',
        },
        {
          ...mockModel({
            id: 'claude-opus-4-1',
            name: 'Claude Opus 4.1',
            family: 'claude',
            brand: 'Anthropic',
            modelFormat: 'anthropic',
            upstreamModelId: 'claude-opus-4-1',
            contextWindow: 200000,
            reasoning: true,
          }),
          providerId: 'anthropic',
        },
      ],
    },
    {
      id: 'openai',
      name: 'OpenAI',
      favoriteName: 'GPT',
      hasKey: true,
      freeAccess: false,
      authType: 'api' as const,
      modelCount: 2,
      models: [
        {
          ...mockModel({
            id: 'gpt-5.5',
            name: 'GPT-5.5',
            family: 'gpt',
            brand: 'OpenAI',
            modelFormat: 'openai',
            upstreamModelId: 'gpt-5.5',
            contextWindow: 16384,
          }),
          providerId: 'openai',
        },
        {
          ...mockModel({
            id: 'o1-pro',
            name: 'o1-pro',
            family: 'gpt',
            brand: 'OpenAI',
            modelFormat: 'openai',
            upstreamModelId: 'o1-pro',
            contextWindow: 128000,
            reasoning: true,
          }),
          providerId: 'openai',
        },
      ],
    },
  ]
  return { providers }
}

export function mockConfig(): UiConfigResponse {
  const favoriteModels: FavoriteModel[] = [
    {
      providerId: 'anthropic',
      providerName: 'Anthropic',
      model: 'Claude Sonnet 4.5',
      modelId: 'claude-sonnet-4-5',
    },
    { providerId: 'openai', providerName: 'OpenAI', model: 'GPT-5.5', modelId: 'gpt-5.5' },
  ]
  return { favoriteModels, antigravityCliFavoriteModels: [] }
}

export function mockApps(): UiAppsResponse {
  const apps: UiApp[] = [
    {
      id: 'claude',
      name: 'Claude Code',
      type: 'cli' as const,
      installed: true,
      launchCommand: 'claude',
    },
    {
      id: 'codex',
      name: 'Codex CLI',
      type: 'cli' as const,
      installed: true,
      launchCommand: 'codex',
    },
    {
      id: 'gemini',
      name: 'Gemini CLI',
      type: 'cli' as const,
      installed: false,
      installHint: 'npm install -g @google/gemini',
    },
  ]
  return { apps, recentLaunchFolders: loadRecentFolders() }
}

export function mockServerStatus(): ServerStatusPayload {
  return {
    running: false,
    saved: {
      favoritesOnly: false,
      freeModelsOnly: false,
      exposedProviders: null,
      maskGatewayIds: false,
      listenMode: 'local' as const,
      hasSavedPassword: false,
    },
    providerSummary: 'mock',
  }
}
