# Anygate Domain Model

> Single source of truth for domain terminology in anygate. This is a glossary — not a spec or implementation guide.

## Core Concepts

### Provider

A third-party API service that offers one or more AI models (e.g., OpenAI, Anthropic, Groq, Ollama). Providers are the source of models that anygate routes into coding agents.

- **Provider Template** — A blueprint for adding a provider, loaded from JSON files in `src/registry/data/templates/`. Defines auth type, npm package, default base URL, and whether the API key is optional.
- **Registry Provider** — A provider the user has configured and saved in `~/.anygate/providers.json`. Contains the auth reference, API settings, and a cached model list.
- **Local Provider** — A provider discovered at runtime via `opencode serve --port 0` (OpenCode's local provider catalog). Normalized into the same `LocalProvider` shape as registry providers.

### Model

An AI model offered by a provider (e.g., `gpt-4o`, `claude-3-7-sonnet-20250219`, `deepseek-v3`). Models carry metadata about their wire format, context window, cost, and reasoning capabilities.

- **Model Format** — The wire protocol a model speaks:
  - `'anthropic'` — Direct Anthropic `/v1/messages` API. Claude Code talks to these natively; no proxy needed.
  - `'openai'` — OpenAI-compatible or SDK-routed. Non-Anthropic models route through the Vercel AI SDK adapter (`src/gateway/sdk-adapter.ts`).
  - `'cloud-code'` — Antigravity/Cloud Code Gemini-style format. Translated by `src/gateway/antigravity/`.
  - `'unsupported'` — Cannot be used (e.g., GPT models in the OpenCode Zen/Go wizard — use the local OpenAI provider instead).
- **Upstream Model ID** — The wire id sent to the upstream API, which may differ from the catalog id (e.g., OpenCode's `gpt-5.5-fast` → upstream `gpt-5.5`).
- **Source Backend** — For OpenCode Zen/Go models: `'zen'` (free tier) or `'go'` (paid tier). Critical for setting the correct `ANTHROPIC_BASE_URL` per selected model.
- **Alias Model ID** — A gateway-safe id (`anthropic-{provider}__{id}`) that Claude Code's gateway model discovery accepts. Non-`claude-*` ids are rewritten via `aliasModelId()`.

### Credential

Authentication material for a provider: an API key, OAuth token, or anonymous placeholder.

- **Auth Type** — How a provider authenticates:
  - `'api'` — API key (stored in OS credential store or plaintext env var).
  - `'oauth'` — OAuth 2.0 flow (e.g., OpenAI, xAI, GitHub Copilot).
  - `'none'` — No auth needed (e.g., local Ollama, gcloud ADC for Vertex).
- **Credential Resolution** — The process of finding a usable key for a provider:
  1. Direct `provider.apiKey` (trimmed).
  2. `provider.authType === 'none'` → `'anonymous'`.
  3. Template `apiKeyOptional` or `anonymousFreeModels` → `'anonymous'`.
  4. Registry `authRef` → `resolveProviderCredential()` (keyring, OAuth, or global OpenCode key).
- **Auth Ref** — A string identifying where to find credentials: `keyring:global:opencode` (global OpenCode key), `oauth:{providerId}` (OAuth token), or a provider-specific keyring entry.

### Agent

A coding agent that consumes models via anygate's gateway. Each agent has its own launcher, proxy, and credential resolution path.

- **Claude Code** (`anygate claude`) — Anthropic's coding agent. Talks directly to Anthropic-format models; non-Anthropic models route through the local proxy.
- **Codex CLI** (`anygate codex`) — OpenAI's CLI agent. Uses OpenAI Responses API; non-Anthropic models route through the Codex proxy (`src/agents/codex/responses-adapter.ts`).
- **Codex/ChatGPT Desktop App** (`anygate codex-app` / `anygate chatgpt`) — OpenAI's desktop app (renamed from Codex.app to ChatGPT.app on macOS, 2026-07-09).
- **Gemini CLI** (`anygate gemini`) — Google's CLI agent. Uses Gemini-native format; non-Google models route through the Gemini proxy.
- **Antigravity** (`anygate agy` / `antigravity-ide`) — A fake Cloud Code (Gemini internal) API server. Routes through `src/gateway/antigravity/`.

### Gateway

The HTTP proxy server that translates between Anthropic-format requests (what Claude Code sends) and the provider's native format.

- **Anthropic Proxy** (`src/gateway/anthropic-proxy.ts`) — Local HTTP server on `127.0.0.1:<random-port>`. Accepts Anthropic-format requests at `/v1/messages` and dispatches per route.
- **SDK Adapter** (`src/gateway/sdk-adapter.ts`) — Translates Anthropic `/v1/messages` ↔ Vercel AI SDK calls. Handles tool-use, streaming, and `thought_signature` round-tripping.
- **Proxy Route** — A single model's routing configuration: `npm` (SDK package), `baseURL` (provider URL), `modelId` (upstream id), and `aliasId` (gateway-safe id).
- **Catalog Proxy** (`startProxyCatalog`) — Multi-route proxy for switch-menu sessions (starting model + favorites, max 20 routes).

### Registry

The user's provider configuration, stored in `~/.anygate/providers.json`.

- **Provider Registry** — The persisted configuration: schema version, list of `RegistryProvider` entries, import metadata.
- **Registry Provider** — A configured provider entry with auth ref, API settings, and a cached model list (1-hour TTL).
- **Template** — A provider blueprint from `src/registry/data/templates/`. Templates define auth type, npm package, and model source.

### OAuth

OAuth 2.0 authentication flows for providers that require browser-based login (OpenAI, xAI, GitHub Copilot, Antigravity).

- **OAuth Provider** — A provider with `authType: 'oauth'`. Uses PKCE flow with a local callback server.
- **OAuth Account** — The user's authenticated identity for an OAuth provider, stored in the keyring.
- **Refresh Token** — Used to obtain new access tokens without re-authenticating. Retried once on 401 via `upstream-forward.ts`.

### Subscription Tier

Controls which models are shown and whether a backend selector appears for OpenCode Zen/Go backends.

- `'free'` / `'zen'` — Always Zen backend, no backend selector.
- `'go'` — Go backend, but also fetches Zen for free models (combined list).
- `'both'` — Shows backend selector.

### Favorites

User-saved models for mid-session switching in Claude Code's switch menu.

- **Favorite Model** — A `{providerId, modelId}` pair saved in user preferences.
- **Favorites Catalog** — When favorites exist, `startProxyCatalog` builds routes for the starting model + favorites (max 20 total).
- **Stale Favorites** — Favorites referencing unavailable models are silently skipped when building the catalog.

## Domain Relationships

```
User
  └── Preferences (~/.anygate/config.json)
        ├── favoriteModels[] → FavoriteModel{providerId, modelId}
        ├── subscriptionTier → 'free' | 'zen' | 'go' | 'both'
        └── server → {exposedProviders, maskGatewayIds, favoritesOnly, ...}

Provider Template (JSON in src/registry/data/templates/)
  ├── id, name, authType, npm, apiKeyOptional, anonymousFreeModels
  └── Model Template (static or fetched)

Registry Provider (in ~/.anygate/providers.json)
  ├── templateId → Provider Template
  ├── authRef → Credential (keyring/OAuth/global)
  ├── api{npm, url, id, headers}
  └── modelsCache → CachedModel[] (1h TTL)

Local Provider (from opencode serve)
  ├── id, name, apiKey, authType
  └── models → LocalProviderModel[]

Model
  ├── id (catalog), upstreamModelId (wire)
  ├── modelFormat: 'anthropic' | 'openai' | 'cloud-code' | 'unsupported'
  ├── sourceBackend: 'zen' | 'go' (OpenCode) | providerId (local)
  ├── contextWindow, cost, reasoning
  └── aliasId (gateway-safe)

Agent (claude/codex/gemini/antigravity)
  ├── resolveLocalProviderApiKey() → Credential
  ├── buildChildEnv(baseUrl, model, apiKey, proxyPort?) → env vars
  └── launch → child process with ANTHROPIC_BASE_URL, ANTHROPIC_API_KEY, ANTHROPIC_MODEL
```

## Key Invariants

1. **`BACKENDS.baseUrl` must NOT include `/v1`** — The Anthropic SDK appends `/v1/messages` automatically.
2. **`buildChildEnv` takes a plain string URL** — not a `BackendConfig`. When `proxyPort` is set, `ANTHROPIC_BASE_URL` is always `http://127.0.0.1:{proxyPort}`.
3. **`MAX_MODEL_CATALOG = 20`** — Favorites cap and max routes in catalog proxy.
4. **Credential resolution is centralized** in `src/core/credentials.ts::resolveLocalProviderApiKey()`. All launchers must use this helper — drift causes the "Kilo Code No credential" bug.
5. **Error handling is centralized** in `src/core/errors.ts`. All upstream errors should flow through `formatUpstreamError()` and `upstreamHttpStatus()`.
6. **`settings.json` is never touched** — Launch config is env-var-only, passed to the child process.
7. **`--dry-run` ignores all saved state** and skips all writes.
