# 07 — Build, Run, Test

How to install, build, run, and test **anygate** locally.

---

## Prerequisites

- **Node.js 18+** (ESM). Check with `node --version`.
- A package manager (npm is used in all scripts below).
- For the **Vertex gateway**: Google Cloud SDK with `gcloud auth application-default login`.
- For **OpenCode import**: the [OpenCode CLI](https://opencode.ai) installed (optional).

---

## Setup

```bash
npm install          # install dependencies
npm run build        # tsup -> dist/cli.js + copy UI assets (scripts/copy-ui-assets.mjs)
```

`npm run build` produces a single ESM bundle `dist/cli.js` with a
`#!/usr/bin/env node` shebang. Provider SDKs and the keyring are marked `external` in
[tsup.config.ts](../tsup.config.ts) so they resolve from `node_modules` at runtime
(keeps the bundle small).

---

## Common scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript → `dist/cli.js` (via tsup, ESM, shebang injected). |
| `npm run dev` | Watch mode build (`tsup --watch`). |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit`). |
| `npm test` | Run all tests with vitest. |
| `npm run refresh:models-dev` | Rebuild the dev model cache. |
| `npx vitest run tests/env.test.ts` | Run a single test file. |

`prepublishOnly` enforces `package.json` / `package-lock.json` version sync, then builds.

---

## Running locally

```bash
# After a build, the CLI is linked (npm bin) or run directly:
anygate --help
anygate ui                  # visual launcher
anygate claude              # launch Claude Code (primary)
anygate server              # local API gateway (port 17645)
anygate models              # manage favorite models

# Simulate a fresh first run without writing anything:
anygate Codex --dry-run
anygate Codex --trace       # write debug log + print errors on exit
```

There is **no separate dev server** for the web UI; `anygate ui` serves the static assets
in [src/ui/public](../src/ui/public) from an in-process Node HTTP server.

---

## Testing

- **Framework:** [vitest](https://vitest.dev) with `@vitest/coverage-v8`.
- **Coverage:** pure functions across `env.ts`, `models.ts`, `sdk-adapter.ts`,
  `provider-factory.ts`, `proxy.ts` (`aliasModelId`), `providers.ts`, `catalog.ts`,
  `favorites.ts`, `prompts.ts`, `upstream-forward.ts`, `config.ts`, `tool-search.ts`,
  `cli.ts` (help text), and the server / antigravity / codex / gemini modules.
- **Interactive flows** (real provider behavior, live launches) are verified manually.
- `tests/ai-doc.test.ts` asserts `npm install -g anygate` is documented — keep the README
  string in sync when changing it.

```bash
npm test
npx vitest run tests/proxy.test.ts
```

The `tests/helpers/` folder holds shared fixtures.

---

## Project conventions (recap)

- **No import-time side effects.** Every module is safe to import; `cli.ts` orchestrates.
- **Registry-first providers.** `fetchProviderCatalog()` resolves providers from the native
  registry, not a running OpenCode binary.
- **Single translation path.** Non-Anthropic providers always route through the Vercel AI SDK.
- **Clean env isolation.** `buildChildEnv()` never mutates the parent shell.
- **No `settings.json` mutation.** Launch config is env-var-only (plus `--model`).

---

## Critical constraints (recap)

> [!CAUTION]
> `BACKENDS.baseUrl` must **not** include `/v1`. The Anthropic SDK appends it.

> [!IMPORTANT]
> Provider credential resolution is not centralized — fix all divergent copies on credential bugs.

> [!WARNING]
> `package.json` `description`/`keywords` still carry the legacy "Gateway" word (backlog).
