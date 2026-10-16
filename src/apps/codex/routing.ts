// Codex routing: tier 1 (direct OpenAI) vs tier 2 (Responses proxy).
import type { CodexProxyRoute } from './proxy.js'
import { BACKENDS } from '../../../src/config/constants.js'
import {
  isTargetCompatibleModel,
  providersForTarget,
  routableModelsForTarget,
  type GatewayLaunchTarget,
} from '../../../src/apps/shared/target-compatibility.js'
import { isOpenCodeZenUrl } from '../../../src/providers/opencode-gate.js'
import type { LocalProvider, LocalProviderModel } from '../../../src/types/index.js'

export interface CodexRoute {
  tier: 'direct' | 'proxy' | 'cloud-code'
  npm: string
  baseURL?: string
  upstreamModelId: string
  apiKey: string
  contextWindow?: number
  modelId: string
  providerId: string
  authType?: 'api' | 'oauth' | 'none'
  oauthAccountId?: string
  providerData?: Record<string, unknown>
  supportedParameters?: string[]
  reasoning?: boolean
  interleavedReasoningField?: string
  /** Static headers sent on every upstream request (e.g. a plan/auth-tracking header a custom endpoint requires). */
  headers?: Record<string, string>
}

export function isRoutableModel(
  model: LocalProviderModel,
  providerId: string,
  agent: GatewayLaunchTarget = 'codex',
  authType?: LocalProvider['authType']
): boolean {
  return isTargetCompatibleModel({ target: agent, providerId, authType, model }).compatible
}

/** Registry providers with at least one routable model (includes Anthropic). */
export function codexCompatibleProviders(
  providers: LocalProvider[],
  agent: GatewayLaunchTarget = 'codex'
): LocalProvider[] {
  return providersForTarget(providers, agent)
}

function resolveBaseURL(model: LocalProviderModel, provider: LocalProvider): string | undefined {
  if (provider.id === 'zen' || provider.id === 'go') {
    const isAnthropic = model.modelFormat === 'anthropic'
    const baseUrl = BACKENDS[provider.id].baseUrl
    return isAnthropic ? baseUrl : `${baseUrl}/v1`
  }
  return (
    model.apiBaseUrl ?? model.completionsUrl?.replace(/\/chat\/completions$/, '') ?? model.baseUrl
  )
}

/** Tier 1 = OpenAI API keys only. OAuth needs the proxy for Codex endpoint headers. */
export function resolveCodexRoute(
  provider: LocalProvider,
  model: LocalProviderModel,
  apiKey: string
): CodexRoute {
  const upstreamModelId = model.upstreamModelId || model.id
  const inferredNpm =
    model.modelFormat === 'anthropic' ? '@ai-sdk/anthropic' : '@ai-sdk/openai-compatible'
  // For zen/go cloud backends the registry modelsCache npm is unreliable — the
  // OpenCode models cache (via modelFormat) is authoritative for endpoint format.
  const isZenGo = provider.id === 'zen' || provider.id === 'go'
  // Zen/go GPT & Muse Spark models are Responses-API-only — keep the cache npm
  // so the proxy hits /v1/responses instead of the OpenAI-compatible endpoint.
  const zenGoNpm = model.npm === '@ai-sdk/openai' ? model.npm : inferredNpm
  const baseURL = resolveBaseURL(model, provider)
  // Zen-backed endpoints can also be reached through other ids — the
  // `opencode-cloud` template (materialized with that id) or a custom provider
  // pointed at opencode.ai. URL detection keeps them on the gateway too.
  const isGatedUpstream = isZenGo || (baseURL !== undefined && isOpenCodeZenUrl(baseURL))
  const base = {
    npm: isZenGo ? zenGoNpm : (model.npm ?? inferredNpm),
    baseURL,
    upstreamModelId,
    apiKey,
    contextWindow: model.contextWindow,
    modelId: model.id,
    providerId: provider.id,
    authType: provider.authType,
    oauthAccountId: provider.oauthAccountId,
    providerData: provider.providerData,
    supportedParameters: model.supportedParameters,
    reasoning: model.reasoning,
    interleavedReasoningField: model.interleavedReasoningField,
    headers: provider.headers,
  }

  if (model.modelFormat === 'cloud-code') {
    return {
      tier: 'cloud-code',
      npm: '@ai-sdk/anthropic',
      baseURL: '',
      upstreamModelId: model.upstreamModelId || model.id,
      apiKey,
      contextWindow: model.contextWindow,
      modelId: model.id,
      providerId: provider.id,
      authType: provider.authType,
      oauthAccountId: provider.oauthAccountId,
      providerData: provider.providerData,
      supportedParameters: model.supportedParameters,
      reasoning: model.reasoning,
      interleavedReasoningField: model.interleavedReasoningField,
      headers: provider.headers,
    }
  }

  // Zen-backed upstreams must never go direct: the free tier only works when
  // requests carry the in-process gate (session id + client headers) injected
  // by the proxy.
  if (
    !isGatedUpstream &&
    model.npm === '@ai-sdk/openai' &&
    provider.authType !== 'oauth' &&
    model.modelFormat === 'openai'
  ) {
    return { tier: 'direct', ...base }
  }

  return { tier: 'proxy', ...base }
}

export function routableModelsForProvider(
  provider: LocalProvider,
  agent: GatewayLaunchTarget = 'codex'
): LocalProviderModel[] {
  return routableModelsForTarget(provider, agent)
}

export function buildCodexProxyRoutesForProvider(
  provider: LocalProvider,
  apiKey: string,
  selectedModelId?: string,
  agent: GatewayLaunchTarget = 'codex'
): CodexProxyRoute[] {
  const routable = routableModelsForProvider(provider, agent)
  const ordered = selectedModelId
    ? [
        ...routable.filter(m => m.id === selectedModelId),
        ...routable.filter(m => m.id !== selectedModelId),
      ]
    : routable
  return ordered.map(model => {
    const route = resolveCodexRoute(provider, model, apiKey)
    return {
      modelId: route.modelId,
      npm: route.npm,
      apiKey: route.apiKey,
      baseURL: route.baseURL,
      upstreamModelId: route.upstreamModelId,
      providerId: route.providerId,
      authType: route.authType,
      oauthAccountId: route.oauthAccountId,
      providerData: route.providerData,
      supportedParameters: route.supportedParameters,
      reasoning: route.reasoning,
      interleavedReasoningField: route.interleavedReasoningField,
      contextWindow: route.contextWindow,
      headers: route.headers,
    }
  })
}

export function codexProviderEnvKey(providerId: string): string {
  const known: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    xai: 'XAI_API_KEY',
    'xai-oauth': 'XAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GEMINI_API_KEY',
  }
  return known[providerId] ?? `${providerId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY`
}
