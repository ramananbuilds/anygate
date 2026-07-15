# 03 — Components

A component-level map of the **anygate** source tree. Each module is a focused,
import-safe unit. System-level picture lives in [02_ARCHITECTURE.md](./02_ARCHITECTURE.md).

---

## Root orchestration

| Module | Responsibility |
|--------|----------------|
| [cli.ts](../src/cli.ts) | Arg parsing + dispatch. The only orchestrator with side effects. |
| [agents/shared/launch.ts](../src/agents/shared/launch.ts) | Locate + spawn target binaries (`stdio:inherit`). |
| [agents/shared/launch-target.ts](../src/agents/shared/launch-target.ts) | Normalize launch args per agent; plan the wizard. |
| [core/env.ts](../src/core/env.ts) | `buildChildEnv()` — 17-var isolation; sets `ANTHROPIC_*`. |
| [agents/shared/key-setup.ts](../src/agents/shared/key-setup.ts) | API-key collection + OS keychain storage. |
| [core/config.ts](../src/core/config.ts) | `~/.anygate/config.json` load/save + import. |
| [core/constants.ts](../src/core/constants.ts) | `BACKENDS`, `MAX_MODEL_CATALOG=20`, `classifyModelFormat`. |
| [core/types.ts](../src/core/types.ts) | Shared types: `ParsedArgs`, `ModelInfo`, `LocalProvider`, `UserPreferences`. |
| [agents/shared/first-run.ts](../src/agents/shared/first-run.ts) | First-run wizard (API key, subscription tier). |
| [agents/shared/prompts.ts](../src/agents/shared/prompts.ts) | Smart pickers: recent, search (>25), paginated (15/page). |
| [agents/shared/trace-log.ts](../src/agents/shared/trace-log.ts) | `--trace` debug logging. |
| [agents/shared/update-check.ts](../src/agents/shared/update-check.ts) | Cached npm release check. |
| [core/agent-io.ts](../src/core/agent-io.ts) | Clean NDJSON/JSONL stdout for agent mode. |

---

## Translation & proxy

| Module | Responsibility |
|--------|----------------|
| [gateway/anthropic-proxy.ts](../src/gateway/anthropic-proxy.ts) | Local Anthropic-format proxy (single + catalog routes). |
| [gateway/proxy-shared.ts](../src/gateway/proxy-shared.ts) | Shared helpers: `aliasModelId`, route resolution. |
| [gateway/proxy-types.ts](../src/gateway/proxy-types.ts) | `ProxyRoute`, `ProxyHandle` types. |
| [gateway/sdk-adapter.ts](../src/gateway/sdk-adapter.ts) | Anthropic ↔ Vercel AI SDK translation (the heart). |
| [gateway/provider-factory.ts](../src/gateway/provider-factory.ts) | `createLanguageModel` via dynamic `import(npm)`. |
| [agents/codex/catalog.ts](../src/agents/codex/catalog.ts) | Build multi-route favorites catalog. |
| [gateway/models.ts](../src/gateway/models.ts) | Model listing, caching, format classification. |
| [gateway/upstream-forward.ts](../src/gateway/upstream-forward.ts) | Shared upstream forwarding helpers. |

---

## Providers & registry

| Module | Responsibility |
|--------|----------------|
| [providers/opencode-serve.ts](../src/providers/opencode-serve.ts) | OpenCode local-provider discovery. |
| [providers/command.ts](../src/providers/command.ts) | `anygate providers` CLI. |
| [providers/provider-catalog.ts](../src/providers/provider-catalog.ts) | Registry-first catalog resolution (canonical credential helper). |
| [providers/templates.ts](../src/providers/templates.ts) | Built-in provider templates. |
| [registry/](../src/registry) | CRUD, import, auth broker, pricing, model refresh. |
| [oauth/](../src/oauth) | Device-code OAuth for copilot/openai/xai/antigravity. |

### `src/registry/` files

| File | Responsibility |
|------|----------------|
| `index.ts` | Public surface of the registry. |
| `crud.ts` | Create/read/update/delete providers. |
| `io.ts` | Read/write `~/.anygate/providers.json`. |
| `builtins.ts` | Registered built-in provider list. |
| `add-template.ts` | `providers add <template>` flow. |
| `custom-endpoint.ts` | Custom OpenAI/Anthropic-compatible endpoint. |
| `import-opencode.ts` | One-time OpenCode import. |
| `import-build.ts` | Build provider objects from imported data. |
| `convert.ts` | Convert between registry and internal shapes. |
| `materialize.ts` | Materialize a provider into runtime models/credentials. |
| `migrate.ts` | Config import between versions. |
| `load.ts` | Load + validate the registry. |
| `types.ts` | Registry-specific types. |
| `pricing.ts` | Model pricing table + lookup. |
| `provider-auth.ts` | Provider auth resolution (api/oauth/none). |
| `opencode-auth.ts` | OpenCode API key + OAuth credential helpers. |
| `auth-broker.ts` | OAuth device-code broker entry. |
| `refresh-credentials.ts` | Refresh expired OAuth credentials. |
| `refresh-models.ts` | Refresh cached model catalogs per provider. |
| `fetch-template-models.ts` | Fetch model lists from template endpoints. |
| `resolve-template.ts` | Resolve a template id to a template def. |
| `model-source.ts` | Tag model source (registry / opencode / zen). |
| `models-dev.ts` | Dev-only model cache helpers. |
| `url-security.ts` | Validate/redact provider URLs. |
| `validate.ts` | Schema validation. |
| `validate-import-key.ts` | Validate imported API keys (skip placeholders like `anything`). |
| `google-model-id.ts` | Normalize Google/Gemini model ids. |

---

## Agent sub-launchers

| Module | Responsibility |
|--------|----------------|
| [agents/claude/desktop.ts](../src/agents/claude/desktop.ts) | Claude Desktop (Cowork + Code). |
| [agents/codex/cli.ts](../src/agents/codex/cli.ts) | OpenAI Codex CLI. |
| [agents/codex/app.ts](../src/agents/codex/app.ts) | ChatGPT desktop (Codex mode); alias `chatgpt`. |
| [agents/codex/proxy.ts](../src/agents/codex/proxy.ts) | Codex OpenAI-format proxy. |
| [agents/codex/responses-adapter.ts](../src/agents/codex/responses-adapter.ts) | Codex Responses API adapter. |
| [agents/gemini/cli.ts](../src/agents/gemini/cli.ts) + [agents/gemini/proxy.ts](../src/agents/gemini/proxy.ts) + [agents/gemini/parts.ts](../src/agents/gemini/parts.ts) | Gemini CLI. |
| [agents/gemini/antigravity.ts](../src/agents/gemini/antigravity.ts) + [gateway/antigravity/](../src/gateway/antigravity) | Antigravity CLI/app/IDE + Cloud Code gateway. |

### `src/agents/codex/`, `src/agents/gemini/`, `src/agents/claude/`

| Folder | Key files |
|-------|----------|
| `codex/` | `launch.ts`, `catalog.ts`, `routing.ts`, `session.ts`, `profile.ts`, `prompts.ts`, `app-config.ts`, `app-launch.ts`, `app-profile.ts`, `app-provider-routes.ts`, `app-session.ts`, `favorites-catalog.ts`, `favorites-launch.ts`, `upstream-error.ts`, `ui.ts` |
| `gemini/` | `launch.ts`, `backend-routes.ts`, `prompts.ts` |
| `claude-desktop/` | `app-config.ts`, `app-launch.ts`, `app-session.ts` |

---

## Server & UI

| Module | Responsibility |
|--------|----------------|
| [gateway/server.ts](../src/gateway/server.ts) | Foreground gateway on port 17645. |
| [gateway/router.ts](../src/gateway/router.ts) | Anthropic/OpenAI format routing. |
| [gateway/catalog-filter.ts](../src/gateway/catalog-filter.ts) | Provider/favorites filtering. |
| [gateway/vertex.ts](../src/gateway/vertex.ts) | Vertex AI gateway config. |
| [gateway/models.ts](../src/gateway/models.ts) | Server model catalog build. |
| [gateway/prompts.ts](../src/gateway/prompts.ts), [gateway/provider-select.ts](../src/gateway/provider-select.ts), [gateway/auth.ts](../src/gateway/auth.ts), [gateway/vendor-mask.ts](../src/gateway/vendor-mask.ts) | Server wizard + auth + masking. |
| [ui/command.ts](../src/ui/command.ts) | Visual launcher HTTP server. |
| [ui/api.ts](../src/ui/api.ts) | Launcher JSON API. |
| [ui/server-control.ts](../src/ui/server-control.ts) | In-process gateway lifecycle. |
| [ui/public/](../src/ui/public) | Browser dashboard assets (index.html, app.js, style.css). |

---

## Favorites & model UX

| Module | Responsibility |
|--------|----------------|
| [agents/claude/favorites.ts](../src/agents/claude/favorites.ts) | Favorites manager entry. |
| [agents/claude/favorites-picker.ts](../src/agents/claude/favorites-picker.ts) | Global favorites picker. |
| [agents/shared/favorites-resolver.ts](../src/agents/shared/favorites-resolver.ts) | Resolve favorites → `{provider, model, apiKey}`. |
| [agents/claude/favorite-provider-display.ts](../src/agents/claude/favorite-provider-display.ts) | Display names. |
| [agents/shared/model-search.ts](../src/agents/shared/model-search.ts), [agents/shared/model-compatibility.ts](../src/agents/shared/model-compatibility.ts), [agents/shared/tool-search.ts](../src/agents/shared/tool-search.ts) | Search & compatibility helpers. |
| [agents/shared/free-models.ts](../src/agents/shared/free-models.ts), [agents/shared/reasoning-capabilities.ts](../src/agents/shared/reasoning-capabilities.ts), [agents/shared/context-window.ts](../src/agents/shared/context-window.ts), [agents/shared/context-model-id.ts](../src/agents/shared/context-model-id.ts) | Model metadata helpers. |

---

## Tests

`tests/` holds vitest specs covering pure functions: `env`, `models`, `sdk-adapter`,
`provider-factory`, `proxy` (`aliasModelId`), `providers`, `catalog`, `favorites`,
`prompts`, `upstream-forward`, `config`, `tool-search`, `cli` (help), and the
`server/` + `antigravity/` + `codex/` + `gemini/` modules. Interactive launches and
real-provider behavior are verified manually. `tests/ai-doc.test.ts` asserts
`npm install -g anygate` is documented (keep README string in sync).
