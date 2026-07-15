# 06 — Conventions

Code style, invariants, and critical constraints for **anygate** contributors.
Read before touching core modules. Companion to [02_ARCHITECTURE.md](./02_ARCHITECTURE.md).

---

## 1. Language & build

- **TypeScript strict**, ES2022 target, ESM (`"type": "module"`).
- Every source file uses `.ts` and imports with the `.js` extension (NodeNext resolution).
- The single bundle `dist/cli.js` is built by `tsup` with a `#!/usr/bin/env node` shebang.
- **Provider SDKs and the keyring are `external`** in
  [tsup.config.ts](../tsup.config.ts) so they resolve from `node_modules` at runtime
  (keeps the bundle small). Never `import` an `@ai-sdk/*` package as a static, bundled dep
  unless you also externalize it.

---

## 2. Module invariants

> [!IMPORTANT]
> **No import-time side effects.** Every module must be safe to import. `cli.ts` is the
> only place that performs work on load. Do not run network calls, spawn processes, or
> touch the filesystem at module top-level.

> [!IMPORTANT]
> **Registry-first providers.** `fetchProviderCatalog()` resolves providers from the native
> registry, **not** from a running OpenCode binary. Do not reintroduce OpenCode-as-source-of-truth.

> [!IMPORTANT]
> **Single translation path.** Non-Anthropic providers *always* route through the
> Vercel AI SDK via `provider-factory.ts` + `sdk-adapter.ts`. Do not hand-roll
> per-provider wire conversion.

> [!IMPORTANT]
> **Clean env isolation.** `buildChildEnv()` never mutates the parent shell. Launch config
> is env-var-only (plus `--model`). Do not write to the agent's `settings.json`.

---

## 3. Critical constraints (memorize)

> [!CAUTION]
> **Backend URL:** `BACKENDS.baseUrl` in [src/constants.ts](../src/constants.ts) must
> **NOT** include `/v1`. The Anthropic SDK appends `/v1/messages` automatically. A value of
> `https://opencode.ai/zen/v1` would hit `/zen/v1/v1/messages` → 404.

> [!IMPORTANT]
> **Provider credential resolution is centralized** in
> [src/core/credentials.ts](../src/core/credentials.ts)`::resolveLocalProviderApiKey()`. Every agent target
> (`agents/codex/cli.ts`, `agents/codex/app.ts`, `agents/claude/desktop.ts`, `agents/shared/favorites-resolver.ts`,
> `agents/gemini/cli.ts`) imports this single helper — there are no divergent copies. Fix credential
> bugs in the one function.

> [!WARNING]
> **Stale "Gateway" string:** `package.json` `description` and `keywords` still contain the old
> "Gateway" word. Normalize for consistency (backlog item — see
> [02_ARCHITECTURE.md](./02_ARCHITECTURE.md)#12-known-limitations--housekeeping-backlog)).

---

## 4. Naming & structure

- Command handlers are named `run<X>Command` (e.g. `runCodexCommand`, `runGeminiCommand`).
- Sub-launchers live in per-agent folders (`codex/`, `gemini/`, `claude-desktop/`) — now under
  `src/agents/` (`agents/codex/`, `agents/gemini/`, `agents/claude/`).
- Pure, testable functions are preferred; they are what vitest covers.
- Legacy identifiers from the rename (`gatewayIntro`, `gatewayOutro`, `GATEWAY_LAUNCH_FLAGS`,
  `parseGatewayLaunchFlag`) were **removed** during the restructure — do not reintroduce them.

---

## 5. Subscription tiers

- Tiers control which models show and whether a backend selector appears
  ([agents/shared/prompts.ts](../src/agents/shared/prompts.ts), [cli.ts](../src/cli.ts)):

- `free` / `zen` — always Zen backend, no backend selector.
- `go` — Go backend, but also fetches Zen for free models (combined list).
- `both` — shows backend selector.

When adding a backend: update `BACKENDS` ([core/constants.ts](../src/core/constants.ts)), the
`BackendConfig` id union in [core/types.ts](../src/core/types.ts), and the tier logic.

---

## 6. Free / stale models

- `STALE_FREE_MODELS` ([core/constants.ts](../src/core/constants.ts)) lists models whose free
  promotion ended but the API still returns them (currently `qwen3.6-plus-free`).
  These are filtered out in `mergeModels()`.
- `free-models.ts` + `reasoning-capabilities.ts` carry per-model metadata used by pickers.

---

## 7. Proxy route rules

- `startProxy(completionsUrl, modelId, debug, contextWindow?, sdk?)` — single-model wrapper
  around `startProxyCatalog`; `sdk` carries `{ npm, baseURL }`.
- `startProxyCatalog(routes, startingAliasId, debug)` — multi-route catalog proxy for switch-menu.
- `MAX_MODEL_CATALOG = 20` — favorites cap and max routes in catalog.
- `aliasModelId()` rewrites non-`Claude-*` ids to `anthropic-{provider}__{id}`.

---

## 8. Disclaimer

anygate has **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub, OpenAI,
xAI, or any integrated vendor. It routes inference through services you configure yourself.
Use at your own risk.
