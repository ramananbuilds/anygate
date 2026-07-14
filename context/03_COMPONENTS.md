# 03 — Components

A component-level map of the **anygate** source tree. Each module is a focused,
import-safe unit. System-level picture lives in [02_ARCHITECTURE.md](./02_ARCHITECTURE.md).

---

## Root orchestration

| Module | Responsibility |
|--------|----------------|
| [cli.ts](../src/cli.ts) | Arg parsing + dispatch. The only orchestrator with side effects. |
| [launch.ts](../src/launch.ts) | Locate + spawn target binaries (`stdio:inherit`). |
| [launch-target.ts](../src/launch-target.ts) | Normalize launch args per agent; plan the wizard. |
| [env.ts](../src/env.ts) | `buildChildEnv()` — 17-var isolation; sets `ANTHROPIC_*`. |
| [key-setup.ts](../src/key-setup.ts) | API-key collection + OS keychain storage. |
| [config.ts](../src/config.ts) | `~/.anygate/config.json` load/save + migration. |
| [constants.ts](../src/constants.ts) | `BACKENDS`, `MAX_MODEL_CATALOG=20`, `classifyModelFormat`. |
| [types.ts](../src/types.ts) | Shared types: `ParsedArgs`, `ModelInfo`, `LocalProvider`, `UserPreferences`. |
| [first-run.ts](../src/first-run.ts) | First-run wizard (API key, subscription tier). |
| [prompts.ts](../src/prompts.ts) | Smart pickers: recent, search (>25), paginated (15/page). |
| [trace-log.ts](../src/trace-log.ts) | `--trace` debug logging. |
| [update-check.ts](../src/update-check.ts) | Cached npm release check. |
| [agent-io.ts](../src/agent-io.ts) | Clean NDJSON/JSONL stdout for agent mode. |

---

## Translation & proxy

| Module | Responsibility |
|--------|----------------|
| [proxy.ts](../src/proxy.ts) | Local Anthropic-format proxy (single + catalog routes). |
| [proxy-shared.ts](../src/proxy-shared.ts) | Shared helpers: `aliasModelId`, route resolution. |
| [proxy-types.ts](../src/proxy-types.ts) | `ProxyRoute`, `ProxyHandle` types. |
| [sdk-adapter.ts](../src/sdk-adapter.ts) | Anthropic ↔ Vercel AI SDK translation (the heart). |
| [provider-factory.ts](../src/provider-factory.ts) | `createLanguageModel` via dynamic `import(npm)`. |
| [catalog.ts](../src/catalog.ts) | Build multi-route favorites catalog. |
| [models.ts](../src/models.ts) | Model listing, caching, format classification. |
| [upstream-forward.ts](../src/upstream-forward.ts) | Shared upstream forwarding helpers. |

---

## Providers & registry

| Module | Responsibility |
|--------|----------------|
| [providers.ts](../src/providers.ts) | OpenCode local-provider discovery. |
| [providers-command.ts](../src/providers-command.ts) | `anygate providers` CLI. |
| [provider-catalog.ts](../src/provider-catalog.ts) | Registry-first catalog resolution (canonical credential helper). |
| [provider-templates.ts](../src/provider-templates.ts) | Built-in provider templates. |
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
| `import-opencode.ts` | One-time OpenCode migration. |
| `import-build.ts` | Build provider objects from imported data. |
| `convert.ts` | Convert between registry and internal shapes. |
| `materialize.ts` | Materialize a provider into runtime models/credentials. |
| `migrate.ts` | Config migration between versions. |
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
| [claude-app.ts](../src/claude-app.ts) | Claude Desktop (Cowork + Code). |
| [codex.ts](../src/codex.ts) | OpenAI Codex CLI. |
| [codex-app.ts](../src/codex-app.ts) | ChatGPT desktop (Codex mode); alias `chatgpt`. |
| [codex-proxy.ts](../src/codex-proxy.ts) | Codex OpenAI-format proxy. |
| [codex-responses-adapter.ts](../src/codex-responses-adapter.ts) | Codex Responses API adapter. |
| [gemini.ts](../src/gemini.ts) + [gemini-proxy.ts](../src/gemini-proxy.ts) + [gemini-parts.ts](../src/gemini-parts.ts) | Gemini CLI. |
| [antigravity.ts](../src/antigravity.ts) + [antigravity/](../src/antigravity) | Antigravity CLI/app/IDE + Cloud Code gateway. |

### `src/codex/`, `src/gemini/`, `src/claude-desktop/`

| Folder | Key files |
|-------|----------|
| `codex/` | `launch.ts`, `catalog.ts`, `routing.ts`, `session.ts`, `profile.ts`, `prompts.ts`, `app-config.ts`, `app-launch.ts`, `app-profile.ts`, `app-provider-routes.ts`, `app-session.ts`, `favorites-catalog.ts`, `favorites-launch.ts`, `upstream-error.ts`, `ui.ts` |
| `gemini/` | `launch.ts`, `backend-routes.ts`, `prompts.ts` |
| `claude-desktop/` | `app-config.ts`, `app-launch.ts`, `app-session.ts` |

---

## Server & UI

| Module | Responsibility |
|--------|----------------|
| [server/index.ts](../src/server/index.ts) | Foreground gateway on port 17645. |
| [server/router.ts](../src/server/router.ts) | Anthropic/OpenAI format routing. |
| [server/catalog-filter.ts](../src/server/catalog-filter.ts) | Provider/favorites filtering. |
| [server/vertex-config.ts](../src/server/vertex-config.ts) | Vertex AI gateway config. |
| [server/models.ts](../src/server/models.ts) | Server model catalog build. |
| [server/prompts.ts](../src/server/prompts.ts), [provider-select.ts](../src/server/provider-select.ts), [auth.ts](../src/server/auth.ts), [vendor-mask.ts](../src/server/vendor-mask.ts) | Server wizard + auth + masking. |
| [ui.ts](../src/ui.ts) | Visual launcher HTTP server. |
| [ui/api.ts](../src/ui/api.ts) | Launcher JSON API. |
| [ui/server-control.ts](../src/ui/server-control.ts) | In-process gateway lifecycle. |
| [ui/public/](../src/ui/public) | Browser dashboard assets (index.html, app.js, style.css). |

---

## Favorites & model UX

| Module | Responsibility |
|--------|----------------|
| [favorites.ts](../src/favorites.ts) | Favorites manager entry. |
| [favorites-picker.ts](../src/favorites-picker.ts) | Global favorites picker. |
| [favorites-resolver.ts](../src/favorites-resolver.ts) | Resolve favorites → `{provider, model, apiKey}`. |
| [favorite-provider-display.ts](../src/favorite-provider-display.ts) | Display names. |
| [model-search.ts](../src/model-search.ts), [model-compatibility.ts](../src/model-compatibility.ts), [tool-search.ts](../src/tool-search.ts) | Search & compatibility helpers. |
| [free-models.ts](../src/free-models.ts), [reasoning-capabilities.ts](../src/reasoning-capabilities.ts), [context-window.ts](../src/context-window.ts), [context-model-id.ts](../src/context-model-id.ts) | Model metadata helpers. |

---

## Tests

`tests/` holds vitest specs covering pure functions: `env`, `models`, `sdk-adapter`,
`provider-factory`, `proxy` (`aliasModelId`), `providers`, `catalog`, `favorites`,
`prompts`, `upstream-forward`, `config`, `tool-search`, `cli` (help), and the
`server/` + `antigravity/` + `codex/` + `gemini/` modules. Interactive launches and
real-provider behavior are verified manually. `tests/ai-doc.test.ts` asserts
`npm install -g anygate` is documented (keep README string in sync).
