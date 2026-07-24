// Maps an OpenCode provider's `npm` package (the field providers.ts already
// reads) to a Vercel AI SDK LanguageModel instance. The SDK owns wire format,
// endpoint selection, and provider quirks.
import type { LanguageModel } from 'ai';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { VERTEX_ANTHROPIC_NPM, CODEX_RESPONSES_LITE_VERSION, CODEX_RESPONSES_LITE_WS_URL } from '../../config/constants.js';
import { extractOpenAiAccountId } from '../../auth/openai.js';
import { createResponsesWebSocketFetch } from '../../auth/responses-websocket.js';
import {
  CLAUDE_CODE_USER_AGENT,
  injectClaudeIdentity,
} from '../../auth/claude-identity.js';

// Reasoning-capability detection and provider-option mapping.
// Extracted to provider-reasoning.ts to keep the core SDK factory lean.
export type {
  ReasoningMode,
  ReasoningSource,
  ReasoningConfidence,
  ReasoningWireFormat,
  ReasoningMetadata,
  ReasoningCapabilities,
} from './provider-reasoning.js';
export {
  getReasoningCapabilities,
  buildCodexReasoningLevels,
  effortProviderOptions,
  deepMergeProviderOptions,
  thinkingProviderOptions,
} from './provider-reasoning.js';

/** Models that must use /v1/responses instead of /v1/chat/completions. */
const RESPONSES_ONLY_PREFIXES = [
  'gpt-5-codex',
  'gpt-5-pro',
  'gpt-5.2-pro',
  'o3',
  'o4',
];

type SdkProviderFactory = (options: { apiKey: string; baseURL?: string; name?: string; headers?: Record<string, string> }) => {
  (modelId: string): LanguageModel;
  chat: (modelId: string) => LanguageModel;
  responses: (modelId: string) => LanguageModel;
};

const factoryCache = new Map<string, Promise<SdkProviderFactory>>();

/**
 * True when a model id must use the OpenAI/xAI Responses API instead of
 * chat/completions. The SDK reflects this by selecting `provider.responses(id)`.
 */
export function modelPrefersResponsesApi(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  if (RESPONSES_ONLY_PREFIXES.some(prefix => lower === prefix || lower.startsWith(`${prefix}-`))) {
    return true;
  }
  // gpt-5.4 and later minor versions require the Responses API (e.g. gpt-5.4, gpt-5.5, gpt-5.6, gpt-5.6-fast).
  const gpt5Minor = lower.match(/^gpt-5\.(\d+)(?:-|$)/);
  if (gpt5Minor && Number(gpt5Minor[1]) >= 4) return true;
  // Versioned Codex IDs (e.g. gpt-5.3-codex) don't match the gpt-5-codex prefix.
  if (lower.startsWith('gpt-') && lower.includes('-codex')) return true;
  // xAI multiagent models (e.g. grok-4.20-multi-agent, grok-4.2-multiagent).
  if (lower.startsWith('grok-') && (lower.includes('multi-agent') || lower.includes('multiagent'))) return true;
  return false;
}

/**
 * OpenAI's Responses API is a strict superset of Chat Completions for every
 * current model — there is no OpenAI model that Chat Completions can serve
 * that Responses cannot. So route every OpenAI model through Responses by
 * default, except pre-chat legacy completion models that predate both APIs
 * and are not agentic chat models at all.
 */
const OPENAI_CHAT_COMPLETIONS_ONLY = [
  'davinci-002',
  'babbage-002',
  'gpt-3.5-turbo-instruct',
];

export function shouldUseOpenAiResponsesEndpoint(modelId: string): boolean {
  return !OPENAI_CHAT_COMPLETIONS_ONLY.includes(modelId.toLowerCase());
}

export interface VertexProviderConfig {
  project: string;
  location: string;
}

export interface ProviderModelSpec {
  /** OpenCode `api.npm` package, e.g. `@ai-sdk/xai`. */
  npm: string;
  modelId: string;
  apiKey: string;
  /** Base URL for openai-compatible / openrouter providers (no trailing path). */
  baseURL?: string;
  /** Provider id for naming openai-compatible instances (diagnostics only). */
  providerId?: string;
  /** Registry authentication mode. OpenAI OAuth uses the ChatGPT Codex backend. */
  authType?: 'api' | 'oauth' | 'none';
  oauthAccountId?: string;
  providerData?: Record<string, unknown>;
  /** Google Vertex AI — uses Application Default Credentials, not apiKey. */
  vertex?: VertexProviderConfig;
  /** Static headers sent on every upstream request (e.g. a plan/auth-tracking header a custom endpoint requires). */
  headers?: Record<string, string>;
  /** Backend capability: model requires the Responses-Lite request shape (x-openai-internal-codex-responses-lite). */
  useResponsesLite?: boolean;
  /** Backend capability: model must use the WebSocket Responses transport instead of HTTP. */
  preferWebSockets?: boolean;
  /** Optional debug logger (wired to the proxy trace log) for transport-level diagnostics. */
  onDebug?: (msg: string) => void;
}

/** True when this provider routes through the SDK adapter (local providers + Zen/Go openai-format). */
export function isSdkUpgradedNpm(npm: string | undefined): boolean {
  return !!npm && npm !== '@ai-sdk/anthropic';
}

export function maxToolsForNpm(npm: string | undefined): number | undefined {
  return npm === '@ai-sdk/groq' ? 128 : undefined;
}

function findCreateFactory(mod: Record<string, unknown>): SdkProviderFactory {
  for (const value of Object.values(mod)) {
    if (typeof value === 'function' && value.name.startsWith('create')) {
      return value as SdkProviderFactory;
    }
  }
  throw new Error('No create* factory export found in provider package');
}

async function loadSdkProviderFactory(npm: string): Promise<SdkProviderFactory> {
  let cached = factoryCache.get(npm);
  if (!cached) {
    cached = (async () => {
      try {
        const mod = await import(npm);
        return findCreateFactory(mod as Record<string, unknown>);
      } catch (err) {
        const code = err && typeof err === 'object' && 'code' in err ? err.code : undefined;
        if (code === 'ERR_MODULE_NOT_FOUND') {
          throw new Error(`SDK provider package not installed: ${npm}. Run: npm install ${npm}`);
        }
        throw err;
      }
    })();
    factoryCache.set(npm, cached);
    cached.catch(() => factoryCache.delete(npm));
  }
  return cached;
}

export async function createLanguageModel(spec: ProviderModelSpec): Promise<LanguageModel> {
  const { npm, modelId, apiKey, baseURL } = spec;

  if (npm === VERTEX_ANTHROPIC_NPM) {
    if (!spec.vertex?.project) {
      throw new Error('Vertex project is required for @ai-sdk/google-vertex/anthropic');
    }
    const { createVertexAnthropic } = await import('@ai-sdk/google-vertex/anthropic');
    const vertex = createVertexAnthropic({
      project: spec.vertex.project,
      location: spec.vertex.location,
    });
    return vertex(modelId);
  }

  if (npm === '@ai-sdk/openai') {
    const { createOpenAI } = await import('@ai-sdk/openai');
    const accountId = spec.authType === 'oauth'
      ? spec.oauthAccountId ?? extractOpenAiAccountId({ access_token: apiKey })
      : undefined;
    const oauthOptions = spec.authType === 'oauth'
      ? {
          apiKey,
          baseURL: 'https://chatgpt.com/backend-api/codex',
          headers: {
            ...(accountId ? { 'ChatGPT-Account-Id': accountId } : {}),
            originator: 'anygate',
            // Responses-Lite models (backend prefer_websockets/use_responses_lite,
            // e.g. gpt-5.6-luna) require these on the request.
            ...(spec.useResponsesLite
              ? { version: CODEX_RESPONSES_LITE_VERSION, 'x-openai-internal-codex-responses-lite': 'true' }
              : {}),
          },
          // Models the backend flags with prefer_websockets are only served over
          // the WebSocket Responses transport, not HTTP.
          ...(spec.preferWebSockets
            ? { fetch: createResponsesWebSocketFetch(CODEX_RESPONSES_LITE_WS_URL, spec.onDebug) }
            : {}),
        }
      : { apiKey };
    const openai = createOpenAI(oauthOptions);
    return shouldUseOpenAiResponsesEndpoint(modelId) ? openai.responses(modelId) : openai.chat(modelId);
  }
  if (npm === '@ai-sdk/xai') {
    const { createXai } = await import('@ai-sdk/xai');
    const xai = createXai({ apiKey });
    return modelPrefersResponsesApi(modelId) ? xai.responses(modelId) : xai(modelId);
  }
  // @ai-sdk/google owns its native v1beta endpoint. Registry templates store the
  // OpenAI-compatible URL only for GET /v1/models discovery — passing it here
  // produces .../v1beta/openai/models/...:streamGenerateContent → 404.
  if (npm === '@ai-sdk/google') {
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    const google = createGoogleGenerativeAI({ apiKey });
    return google(modelId);
  }
  // Registry stores root URL (no /v1) for GET /v1/models discovery — passing it here
  // makes the SDK call https://api.anthropic.com/messages → 404.
  if (npm === '@ai-sdk/anthropic') {
    const { createAnthropic } = await import('@ai-sdk/anthropic');
    const root = baseURL?.replace(/\/v1\/?$/, '').replace(/\/$/, '');
    const anthropicOptions: Parameters<typeof createAnthropic>[0] = spec.authType === 'oauth'
      ? {
          authToken: apiKey,
          ...(spec.providerId === 'claude-code'
            ? {
                headers: {
                  'User-Agent': CLAUDE_CODE_USER_AGENT,
                  'x-app': 'cli',
                  'X-Claude-Code-Session-Id': injectClaudeIdentity(
                    {},
                    spec.providerData,
                    spec.oauthAccountId ?? apiKey,
                  ).sessionId,
                },
              }
            : {}),
        }
      : { apiKey };
    if (spec.headers) {
      anthropicOptions.headers = { ...anthropicOptions.headers, ...spec.headers };
    }
    if (!root || root === 'https://api.anthropic.com') {
      return createAnthropic(anthropicOptions)(modelId);
    }
    const sdkBase = baseURL!.endsWith('/v1') ? baseURL : `${root}/v1`;
    return createAnthropic({ ...anthropicOptions, baseURL: sdkBase })(modelId);
  }
  let model: LanguageModel;

  if (npm === '@ai-sdk/openai-compatible') {
    const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible');
    const options = {
      name: spec.providerId ?? 'openai-compatible',
      baseURL: baseURL ?? '',
      ...(apiKey.trim() ? { apiKey } : {}),
      ...(spec.headers ? { headers: spec.headers } : {}),
    };
    model = createOpenAICompatible({
      ...options,
    })(modelId);
  } else if (npm === '@openrouter/ai-sdk-provider') {
    const { createOpenRouter } = await import('@openrouter/ai-sdk-provider');
    model = createOpenRouter({ apiKey, baseURL, ...(spec.headers ? { headers: spec.headers } : {}) })(modelId);
  } else {
    const create = await loadSdkProviderFactory(npm);
    const provider = create({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
      ...(spec.headers ? { headers: spec.headers } : {}),
    });
    model = provider(modelId);
  }

  const isReasoning = modelId.toLowerCase().match(/deepseek-r1|think|reasoning|qwq/);
  if (isReasoning) {
    return wrapLanguageModel({
      model: model as Parameters<typeof wrapLanguageModel>[0]['model'],
      middleware: [extractReasoningMiddleware({ tagName: 'think' })],
    }) as unknown as LanguageModel;
  }

  return model;
}
