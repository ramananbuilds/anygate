# 09 — Glossary

Terms, env vars, file roles, and provider/auth vocabulary for **anygate**.
Companion index: [00_INDEX.md](./00_INDEX.md).

---

## Commands (entry points)

| Command | What it does |
|---------|---------------|
| `anygate` / `--help` | Show help. |
| `anygate ui` | Visual launcher (browser dashboard). |
| `anygate claude` | Launch Claude Code (primary target). |
| `anygate providers` | Add / import / list / refresh / auth providers. |
| `anygate models` | Manage favorite models (mid-session `/model`). |
| `anygate server [--vertex]` | Local API gateway (port 17645). |
| `anygate claude-app` | Claude Desktop (Cowork + Code). |
| `anygate codex` | OpenAI Codex CLI. |
| `anygate codex-app` / `chatgpt` | ChatGPT desktop app (Codex mode). |
| `anygate gemini` | Google Gemini CLI. |
| `anygate agy` / `antigravity` / `antigravity-ide` | Antigravity CLI / app / IDE. |
| `anygate --ai [--install]` | Agent reference generator + skill installer. |

Boot flags: `--provider`, `--model`, `--dry-run`, `--setup`, `--trace`, `--vertex`,
`--version`, `--help`.

---

## Key types ([src/core/types.ts](../src/core/types.ts))

| Type | Meaning |
|------|---------|
| `ModelFormat` | `'anthropic'` (direct passthrough) \| `'openai'` (SDK adapter) \| `'unsupported'`. |
| `StarterCommand` | One of the dispatch commands above. |
| `BackendConfig` | `{ id: 'zen'\|'go', name, baseUrl }`. |
| `ModelInfo` | Catalog model: id, name, isFree, brand, sourceBackend, modelFormat, cost, contextWindow, reasoning. |
| `LocalProviderModel` | A model from OpenCode/local discovery: upstreamModelId, baseUrl/completionsUrl, npm, apiBaseUrl. |
| `LocalProvider` | `{ id, name, apiKey, authType, models }`. |
| `FavoriteModel` | `{ providerId, modelId }` (max 20). |
| `UserPreferences` | `~/.anygate/config.json` shape: lastProvider, lastModel, recentModelsByProvider, favoriteModels, server.*, etc. |
| `ParsedArgs` | Parsed `process.argv` (command, flags, launchProvider, launchModel). |

---

## Critical constants ([src/core/constants.ts](../src/core/constants.ts))

| Constant | Value / meaning |
|----------|-------------------|
| `BACKENDS` | `zen` → `https://opencode.ai/zen`, `go` → `https://opencode.ai/zen/go`. **No `/v1` suffix.** |
| `MAX_MODEL_CATALOG` | `20` — favorites cap and max proxy routes. |
| `CONFLICTING_ENV_VARS` | 17 vars stripped from the child (Vertex, Bedrock, AWS, Foundry, stale Anthropic). |
| `OPENCODE_CACHE_PATH` | `~/.cache/opencode/models.json` (optional enrichment). |
| `VERTEX_ANTHROPIC_NPM` | `'@ai-sdk/google-vertex/anthropic'` (Vertex Claude via ADC). |
| `CODEX_RESPONSES_LITE_WS_URL` | `wss://chatgpt.com/backend-api/codex/responses`. |
| `classifyModelFormat(id, npm)` | Returns the `ModelFormat` for a model. |

---

## Environment variables

| Var | Set by | Purpose |
|-----|--------|---------|
| `ANTHROPIC_BASE_URL` | `buildChildEnv` | Proxy URL (`http://127.0.0.1:<port>`) or provider base. |
| `ANTHROPIC_API_KEY` | `buildChildEnv` | Proxy/local token or provider key. |
| `ANTHROPIC_MODEL` | `buildChildEnv` | Launch model id (via `claudeCodeClientModelId`). |
| `ENABLE_TOOL_SEARCH` | `applyClaudeCodeThirdPartyCompat` | `'true'` for third-party routing. |
| `CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT` | `applyClaudeCodeThirdPartyCompat` | `'0'` to keep guardrails. |
| `OPENCODE_API_KEY` | key-setup / OAuth | OpenCode cloud key (resolved from keychain if present). |
| `ANYGATE_HOME` | user | Override `~/.anygate` root. |
| `17 × CONFLICTING_ENV_VARS` | stripped | See constants table. |

---

## File roles

| Path | Role |
|------|------|
| `src/cli.ts` | Arg parsing + dispatch (only orchestrator). |
| `src/core/env.ts` | Child env isolation. |
| `src/gateway/sdk-adapter.ts` | Anthropic ↔ Vercel AI SDK translation. |
| `src/gateway/provider-factory.ts` | Dynamic `import(npm)` → SDK `LanguageModel`. |
| `src/gateway/anthropic-proxy.ts` | Local Anthropic-format proxy. |
| `src/registry/` | Native provider registry (CRUD, import, auth, pricing, refresh). |
| `src/oauth/` | Device-code OAuth flows. |
| `src/gateway/` | `anygate server` gateway. |
| `src/ui/` | `anygate ui` visual launcher. |
| `src/gateway/antigravity/` | Cloud Code gateway for Antigravity. |
| `~/.anygate/providers.json` | Provider registry (no secrets). |
| `~/.anygate/config.json` | User preferences. |
| OS keychain (`keyring:provider:<id>`, `anygate` service) | Per-provider keys + OpenCode key. |
| `dist/cli.js` | Built bundle (rebuild via `npm run build`). |

---

## Provider / auth vocabulary

| Term | Meaning |
|------|---------|
| Registry provider | A provider configured once via `anygate providers` (Groq, Mistral, Together, OpenRouter, SDK templates, custom endpoints). |
| OpenCode Zen / Go | Cloud backends via an OpenCode API key (`BACKENDS`). |
| OpenCode import | One-time import of an existing OpenCode setup. |
| Vertex AI | Claude on Google Vertex via `gcloud` ADC + `anygate server --vertex`. |
| `authType` | `'api'` \| `'oauth'` \| `'none'` on a `LocalProvider`. |
| OAuth device-code | Flows for `github-copilot`, `openai-oauth`, `xai-oauth`, `antigravity-oauth`. |
| `npm` | The `@ai-sdk/*` package a provider maps to (drives SDK routing). |
| `upstreamModelId` | Wire id sent upstream (may differ from catalog id, e.g. `gpt-5.5-fast` → `gpt-5.5`). |
| `modelPrefersResponsesApi` | True when a model must use OpenAI's Responses API. |
| `useResponsesLite` / `preferWebSockets` | Backend capability flags for Codex Responses-Lite over WebSocket. |
| Favorites catalog | Multi-route proxy of starting model + up to 20 favorites for live `/model` switching. |
| `aliasModelId` | Rewrites non-`Claude-*` ids so gateway model discovery accepts them. |

---

## Disclaimer

anygate has **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub,
OpenAI, xAI, or any integrated vendor. It routes inference through services you
configure yourself. Use at your own risk.
