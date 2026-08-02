# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. Note that the codebase supports Claude Code, OpenAI Codex, Google Gemini CLI, and Antigravity.

> 💡 **Documentation Memory System**: Deep technical documentation and AI context files are maintained in `docs/` and `.context/`. Always consult these documents before making architectural changes:
> - **Architecture Docs**: [docs/architecture/overview.md](docs/architecture/overview.md), [request-lifecycle.md](docs/architecture/request-lifecycle.md), [routing-engine.md](docs/architecture/routing-engine.md), [provider-system.md](docs/architecture/provider-system.md), [gateway.md](docs/architecture/gateway.md), [authentication.md](docs/architecture/authentication.md), [launcher-system.md](docs/architecture/launcher-system.md), [storage.md](docs/architecture/storage.md), [ui-system.md](docs/architecture/ui-system.md)
> - **Component Guides**: [docs/components/](docs/components/)
> - **Developer Guides**: [docs/guides/](docs/guides/)
> - **Reference Lookups**: [docs/reference/](docs/reference/)
> - **AI Context & Rules**: [.context/vision.md](.context/vision.md), [.context/architecture-rules.md](.context/architecture-rules.md), [.context/coding-standards.md](.context/coding-standards.md), [.context/repository-map.md](.context/repository-map.md), [.context/current-focus.md](.context/current-focus.md)
>
> ⚠️ **Living Context Maintenance**: Whenever you add, delete, or update a feature or UI component, you MUST update the corresponding documentation files in `docs/`, `.context/`, `AGENTS.md`, and `CLAUDE.md`.

## Release workflow

Publishing is automated by GitHub Actions (`.github/workflows/publish.yml`): **pushing a `v*` tag** runs typecheck + tests + build, then `npm publish` (auth via the `GATEWAYAI` repo secret — an npm Automation token) and creates a GitHub Release from the matching `CHANGELOG.md` section. **Do NOT run `npm publish` locally** — that double-publishes and fails.

To release a new version:

```bash
# 1. Land all code changes and a CHANGELOG.md "## [x.y.z]" section first (committed).
npm version patch --no-git-tag-version   # bump package.json + package-lock (use minor/major as needed)
npm run build                            # rebuild dist — VERSION is derived from package.json automatically
git add -A && git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push --follow-tags                   # tag push triggers CI → npm publish + GitHub Release
```

`package.json` is the single source of truth for the version. Never edit `src/config/constants.ts` manually for version bumps. `dist/` is committed, so rebuild it in the release commit.

**Every version display must derive from `package.json`, never a hardcoded string.** `src/config/constants.ts::VERSION` reads `pkg.version`. Both update automatically on `npm run build` — no manual edit needed.

## Commands

```bash
npm run build       # compile TypeScript → dist/cli.js (via tsup, ESM) + build UI SPA
npm test            # run all tests with vitest across tests/ subdirectories
npm run typecheck   # type-check without emitting (tsc --noEmit)
npm run lint        # run ESLint on src/ (TypeScript)
npm run lint:fix    # auto-fix ESLint issues
npm run format      # format src/ with Prettier
npm run format:check # check formatting without writing
npm run dev         # watch mode build

# Run a single test file or domain directory
npx vitest run tests/storage/env.test.ts
npx vitest run tests/registry/models.test.ts
npx vitest run tests/ui/api.test.ts

# Test the CLI locally (already npm-linked)
anygate                 # bare command: onboarding flow (first run) or main menu (subsequent)
anygate --help
anygate models          # manage favorite models for mid-session switching
anygate claude --dry-run # simulate full first-run without writing anything
anygate claude --setup   # re-ask subscription tier
anygate claude --trace   # write debug log to /tmp/anygate-debug.log and print errors on exit
anygate providers       # interactive provider & model catalog manager
anygate server          # foreground OpenCode/registry API gateway
anygate server --vertex # foreground Vertex AI gateway (gcloud ADC)
anygate codex           # Codex CLI with registry providers (see docs/CODEX.md)
anygate codex-app       # Codex desktop app / ChatGPT app (macOS/Windows; see docs/CODEX.md)
anygate chatgpt         # Alias for anygate codex-app
anygate gemini          # Gemini CLI with registry providers (see docs/GEMINI.md)
anygate antigravity     # Antigravity CLI / IDE local Cloud Code gateway
anygate ui              # Svelte 5 web dashboard & visual launcher

# Rebuild after code changes before testing manually
npm run build && anygate --version
```

## Key Constraints

- **`settings.json` is never touched** by Anygate. Configuration is passed exclusively via environment variables to child processes.
- **Provider Credential Resolution**: `src/registry/provider-catalog.ts::resolveLocalProviderApiKey()` is the canonical helper.
- **Vercel AI SDK Adapter**: Non-Anthropic providers route through the Vercel AI SDK (`src/gateway/adapters/sdk-adapter.ts` + `src/gateway/providers/provider-factory.ts`).
- **Web Dashboard**: `anygate ui` serves the Svelte 5 SPA from `src/ui/app/`.
