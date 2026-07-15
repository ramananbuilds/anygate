# anygate — Context Pack

This folder is a **self-contained context pack** for AI coding agents (Codex, Claude Code,
Gemini CLI, Antigravity, etc.). If you are an AI model that has been pointed at this
repository and asked to understand or extend it, read these files **in order**. They are
written so another agent can build, modify, or debug anygate from scratch without
needing to read every source file first.

> Project: **anygate** — a Node.js CLI + visual launcher that routes *any* model into
> *any* coding agent. Version `0.4.4`. License MIT. Maintainer `ramanan-techlover`.

## Reading order (do not skip)

1. [01_PROJECT_GOAL.md](./01_PROJECT_GOAL.md) — what we are building and why.
2. [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) — system map: entry/dispatch, the translation layer, proxy, server, UI, registry, env isolation.
3. [03_COMPONENTS.md](./03_COMPONENTS.md) — every `src/` module mapped to a responsibility.
4. [04_DATA_FLOW.md](./04_DATA_FLOW.md) — request/response flow and the proxy routing model.
5. [05_WORKFLOWS.md](./05_WORKFLOWS.md) — end-to-end user flows (first run, favorites, providers, server, UI, agent mode, Antigravity).
6. [06_CONVENTIONS.md](./06_CONVENTIONS.md) — code style, invariants, critical constraints.
7. [07_BUILD_RUN_TEST.md](./07_BUILD_RUN_TEST.md) — how to install, build, run, test locally.
8. [08_EXTENDING.md](./08_EXTENDING.md) — how to add providers, backends, SDK providers, agent targets; release process.
9. [09_GLOSSARY.md](./09_GLOSSARY.md) — terms, env vars, file roles, provider/auth vocabulary.

## Quick facts

| Field | Value |
|-------|-------|
| Version | `0.4.4` |
| Runtime | Node.js 18+ (ESM, `"type": "module"`) |
| Language | TypeScript (strict, ES2022 target) |
| Bundle | single `dist/cli.js` via `tsup` (shebang `#!/usr/bin/env node`) |
| Core translation | Vercel AI SDK (`ai` + `@ai-sdk/*`) |
| Gateway port | `17645` (`anygate server`) |
| Favorites cap | `20` (`MAX_MODEL_CATALOG`) |
| Env vars stripped | `17` (`CONFLICTING_ENV_VARS`) |
| Keyring | `@napi-rs/keyring` (optional, dynamically imported) |
| Tests | `vitest` (`vitest run`) |

## Critical invariants (memorize before editing core code)

> [!CAUTION]
> `BACKENDS.baseUrl` in [src/constants.ts](../src/constants.ts) must **NOT** include `/v1`.
> The Anthropic SDK appends `/v1/messages` automatically. A value of
> `https://opencode.ai/zen/v1` would hit `/zen/v1/v1/messages` → 404.

> [!IMPORTANT]
> Provider credential resolution **is centralized** in
> `core/credentials.ts::resolveLocalProviderApiKey()`. Every launcher (`cli.ts`,
> `agents/codex/cli.ts`, `agents/codex/app.ts`, `agents/gemini/cli.ts`,
> `agents/claude/desktop.ts`, `agents/shared/favorites-resolver.ts`,
> `gateway/antigravity/launch-routes.ts`) imports that single helper — no divergent
> copies. This fixed the Kilo Code "No credential" bug.

> [!WARNING]
> `package.json` `description`/`keywords` still carry the legacy "Relay" word. Normalize
> for consistency (backlog item). User-facing copy already says "Route any model".

## Where to look for things

- CLI dispatch / arg parsing → [src/cli.ts](../src/cli.ts)
- Launch + spawn child binaries → [src/agents/shared/launch.ts](../src/agents/shared/launch.ts)
- Env isolation → [src/core/env.ts](../src/core/env.ts)
- Typed errors → [src/core/errors.ts](../src/core/errors.ts)
- Credential resolution → [src/core/credentials.ts](../src/core/credentials.ts)
- Translation (Anthropic ↔ SDK) → [src/gateway/sdk-adapter.ts](../src/gateway/sdk-adapter.ts)
- SDK provider factory → [src/gateway/provider-factory.ts](../src/gateway/provider-factory.ts)
- Local proxy → [src/gateway/anthropic-proxy.ts](../src/gateway/anthropic-proxy.ts)
- Server gateway → [src/gateway/server.ts](../src/gateway/server.ts)
- Registry / providers → [src/registry/](../src/registry), [src/providers/command.ts](../src/providers/command.ts)
- OAuth → [src/oauth/](../src/oauth)
- Visual launcher → [src/ui/](../src/ui)
- Antigravity gateway → [src/gateway/antigravity/](../src/gateway/antigravity)

## Disclaimer

anygate has **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub,
OpenAI, xAI, or any integrated vendor. It routes inference through services you
configure yourself. Use at your own risk.
