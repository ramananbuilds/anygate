# 02 — Architecture

System-level map of the **anygate** codebase for agents and contributors.
Companion to [01_PROJECT_GOAL.md](./01_PROJECT_GOAL.md) and [09_GLOSSARY.md](./09_GLOSSARY.md).

- **Version:** `0.4.4`  **Runtime:** Node 18+ (ESM)  **Language:** TypeScript strict, ES2022
- **Bundle:** single `dist/cli.js` via `tsup`  **Core translation:** Vercel AI SDK (`ai` + `@ai-sdk/*`)

**Every module is a focused unit with no side effects at import time. `src/cli.ts` is the only orchestrator.**

---

## 1. Repository layout

```
anygate/
├── src/                  # TypeScript source (entry: cli.ts)
│   ├── cli.ts            # Command parsing + dispatch (root orchestrator)
│   ├── core/             # Cross-cutting, no domain bias (errors, credentials, config,
│   │                    #   constants, types, env, agent-io, redact, http-utils, paths)
│   ├── gateway/          # Unified local API gateway (server, router, models,
│   │                    #   catalog-filter, vendor-mask, auth, vertex,
│   │                    #   anthropic-proxy, sdk-adapter, provider-factory, openai-adapter)
│   ├── agents/           # Per-target launchers (claude/, codex/, gemini/, shared/)
│   ├── providers/        # Provider CLI + catalog (command, catalog, templates, opencode-serve)
│   ├── registry/         # Native provider registry (CRUD, import, auth, refresh, pricing)
│   ├── oauth/            # Device-code OAuth (github, openai, xai, antigravity, ...)
│   ├── ui/               # `anygate ui` visual launcher (command, api, api-types,
│   │                    #   server-control, public/)
│   └── data/             # Static model / provider datasets
├── tests/                # vitest specs (pure functions + cli help)
├── docs/                 # Guides (PROVIDERS, CODEX, CLAUDE_DESKTOP, GEMINI, ...)
├── assets/               # logo.svg, banner.svg (custom SVG branding)
├── scripts/              # copy-ui-assets.mjs, refresh-models-dev-cache.mjs
├── dist/                 # Built bundle (rebuild via `npm run build`)
└── package.json, tsconfig.json, tsup.config.ts, CHANGELOG.md, LICENSE
```

---

## 2. Entry & dispatch

[src/cli.ts](../src/cli.ts) parses `process.argv` into a `ParsedArgs` and dispatches:

| Subcommand | Handler |
|-----------|---------|
| *(none)* / `--help` | help |
| `--version` | version |
| `claude` | inline wizard + launch (root orchestrator) |
| `server [--vertex]` | [src/gateway/server.ts](../src/gateway/server.ts) |
| `models` / `favorites` | [src/agents/claude/favorites.ts](../src/agents/claude/favorites.ts) + [favorites-picker.ts](../src/agents/claude/favorites-picker.ts) |
| `providers` | [src/providers/command.ts](../src/providers/command.ts) |
| `claude-app` | [src/agents/claude/desktop.ts](../src/agents/claude/desktop.ts) |
| `codex` | [src/agents/codex/cli.ts](../src/agents/codex/cli.ts) |
| `codex-app` / `chatgpt` | [src/agents/codex/app.ts](../src/agents/codex/app.ts) |
| `gemini` | [src/agents/gemini/cli.ts](../src/agents/gemini/cli.ts) |
| `agy` / `antigravity` / `antigravity-ide` | [src/agents/gemini/antigravity.ts](../src/agents/gemini/antigravity.ts) |
| `ui` | [src/ui/command.ts](../src/ui/command.ts) |
| `--ai [--install]` | [src/agents/shared/ai-doc.ts](../src/agents/shared/ai-doc.ts) |

Boot flags (`--provider`, `--model`, `--dry-run`, `--setup`, `--trace`, `--vertex`) apply
across commands and are absorbed by `cli.ts` so they are never leaked to the child agent.

---

## 3. Core launch flow (`anygate claude`)

```
cli.ts
  → findClaudeBinary()                 [agents/shared/launch.ts]
  → resolveOrCollectApiKey()           [agents/shared/key-setup.ts — env / keychain / prompt]
  → fetchProviderCatalog()             [providers/provider-catalog.ts — registry-first]
  → runFirstRunWizard() if empty      [agents/shared/first-run.ts]
  → pickModel / favorites catalog      [agents/shared/prompts.ts / agents/codex/catalog.ts]
  → buildChildEnv(baseUrl, ...)        [core/env.ts — strips 17 vars, sets ANTHROPIC_*, --model]
  → startProxy() / startProxyCatalog() [gateway/anthropic-proxy.ts]
  → launchClaude()                     [agents/shared/launch.ts — spawn, stdio:inherit]
  → proxyHandle.close() on exit
```

When `prefs.favoriteModels.length > 0`, the launch enters **favorites mode** and uses
`startProxyCatalog()` (multi-route, max 20 = `MAX_MODEL_CATALOG`) so Claude Code's
`/model` switch works against a synthetic catalog.

---

## 4. The translation layer (the heart of the product)

All **non-Anthropic** providers route through the **Vercel AI SDK** (`ai` + `@ai-sdk/*`,
the same packages OpenCode loads). This is the *only* translation path — no hand-rolled
per-provider conversion.

- [src/gateway/sdk-adapter.ts](../src/gateway/sdk-adapter.ts): Anthropic `/v1/messages` ↔ SDK.
  `translateRequest()` builds SDK call params and folds inline `role:'system'` messages
  into the system prompt (so skills/system-reminders aren't dropped). `streamAnthropicResponse`
  maps the SDK `fullStream` → Anthropic SSE. Round-trips `thought_signature` (Gemini) via
  `tool_use.id` encoding.
- [src/gateway/provider-factory.ts](../src/gateway/provider-factory.ts): `createLanguageModel({ npm,
  modelId, apiKey, baseURL })` dynamically `import(npm)` and discovers the `create*` factory.
  Special branches for OpenAI/xAI **Responses API** selection (`modelPrefersResponsesApi`
  → `provider.responses(id)`) and openai-compatible/openrouter base URLs. `isSdkMigratedNpm(npm)`
  is true for any npm except `@ai-sdk/anthropic`.
- **Model format classification** (`modelFormat`): `anthropic` (direct passthrough) vs
  `openai` (SDK adapter proxy). Driven by `provider.npm` / ID-prefix heuristics in
  [src/core/constants.ts](../src/core/constants.ts) (`classifyModelFormat`).

---

## 5. Local proxy

[src/gateway/anthropic-proxy.ts](../src/gateway/anthropic-proxy.ts): an HTTP server on `127.0.0.1:<random-port>` accepting
Anthropic-format `/v1/messages`. Per-route dispatch:

- `modelFormat === 'anthropic'` → direct passthrough to provider's Anthropic endpoint.
- else → `isSdkMigratedNpm(route.npm)` → SDK adapter.

`GET /v1/models` returns a synthetic catalog with per-model `context_window`.
`aliasModelId()` rewrites non-`Claude-*` ids so gateway model discovery accepts them.
Favorites mode uses `startProxyCatalog()` (multi-route, max 20).

---

## 6. Server mode (`anygate server`)

[src/gateway/server.ts](../src/gateway/server.ts) + [router.ts](../src/gateway/router.ts)
run a foreground gateway on fixed port **17645**. `loadServerModels()` converts registry
providers to `ServerModelInfo[]`; the router forwards Anthropic-format to
`{baseUrl}/v1/messages` and SDK-adapts OpenAI-format. `GET /models` strips `apiKey`. Health:
`GET /health`. The **Vertex gateway** (`--vertex`) uses gcloud ADC to serve Claude on Vertex
(see [docs/PROVIDERS.md](../docs/PROVIDERS.md)).

---

## 7. Visual launcher (`anygate ui`)

[src/ui/command.ts](../src/ui/command.ts) + [src/ui/api.ts](../src/ui/api.ts) serve a browser
dashboard from [src/ui/public](../src/ui/public). The **Server tab** runs the *same*
gateway as `anygate server` in-process via [src/ui/server-control.ts](../src/ui/server-control.ts)
(no child process; stops when the UI exits). Saved settings are shared with the terminal wizard.

---

## 8. Registry & providers

- [src/registry/](../src/registry): native provider registry CRUD, templates
  ([src/providers/templates.ts](../src/providers/templates.ts)), one-time OpenCode import,
  OAuth auth broker, model refresh, pricing.
- `fetchProviderCatalog()` is **registry-first**: OpenCode is no longer the source of truth
  for providers (unlike older versions).
- [src/oauth/](../src/oauth): device-code flows for `github-copilot`, `openai-oauth`,
  `xai-oauth`, and `antigravity-oauth`.

---

## 9. Antigravity gateway

[src/gateway/antigravity/](../src/gateway/antigravity): `startCloudCodeGateway()` fakes Google's internal
Cloud Code API so Antigravity routes through anygate. `request-adapter.ts` converts Cloud Code
`generateContent` → SDK params; `response-adapter.ts` converts SDK stream → Cloud Code SSE.
`normalizeFunctionCallArgs` un-stringifies MCP tool-call args (third-party models stringify
them). **Use a throwaway Google account** (see [docs/ANTIGRAVITY.md](../docs/ANTIGRAVITY.md)).

---

## 10. Environment isolation

[src/core/env.ts](../src/core/env.ts) `buildChildEnv()`: copies `process.env`, deletes the 17
`CONFLICTING_ENV_VARS` (Vertex AI, Bedrock, AWS, Foundry, stale Anthropic), then sets
`ANTHROPIC_BASE_URL` / `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` and passes `--model`. The
**parent shell is never mutated.** (Caveat: the target tool may persist the model to its own
`settings.json` — outside anygate's control.)

---

## 11. Configuration & data files

| File | Purpose |
|------|---------|
| `~/.anygate/providers.json` | Provider registry (no secrets) |
| `~/.anygate/config.json` | Preferences: `lastProvider`, `lastModel`, `recentModelsByProvider`, `favoriteModels`, server settings, optional server password |
| `~/.anygate/vertex-models.json` | Custom Vertex catalog (copy of `assets/vertex-models.example.json`) |
| OS keychain (`keyring:provider:<id>`, `anygate` service) | Per-provider keys + OpenCode API key |
| `ANYGATE_HOME` env var | Override the `~/.anygate` root |
| `--dry-run` | Ignores all saved state and writes nothing (simulates fresh first-run) |

---

## 12. Known limitations & housekeeping backlog

> [!WARNING]
> **Stale "Relay" string:** `package.json` `description` still reads *"Relay any model into
> any coding agent…"* and `keywords` still include `"relay"`. The user-facing README uses
> "Route any model". Normalize for full consistency (backlog item).

Other known limitations (by design):

- Cost display in Codex is always inaccurate for non-Anthropic models (Codex applies its own pricing).
- OAuth-authenticated providers (no stored key) are silently skipped by discovery.
- In gateway-discovery (switch-menu) mode, the displayed context window reflects the **launch**
  model and does not update on live `/model` switch.
- Mistral free tier has tight 429 rate limits during tool-heavy sessions.
- Provider credential resolution **is centralized** in
  [src/core/credentials.ts](../src/core/credentials.ts)`::resolveLocalProviderApiKey()`. Every
  agent target (`agents/codex/cli.ts`, `agents/codex/app.ts`, `agents/claude/desktop.ts`,
  `agents/shared/favorites-resolver.ts`, `agents/gemini/cli.ts`) imports this single helper —
  there are no divergent copies. Fix credential bugs in the one function.

> [!NOTE]
> **UI contract is frozen.** `src/ui/api-types.ts` is the public HTTP contract for the `anygate ui`
> dashboard. The `ui/` domain must **never** be imported by `core/`, `gateway/`, `agents/`, or
> `providers/` (one-way dependency). `src/ui/api.ts` is the only implementer of that contract; it
> is covered by `tests/ui-api.test.ts`.
