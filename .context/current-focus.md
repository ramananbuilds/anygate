# Current Focus & Recent Changes

> Active development status and recent major architecture updates.

## Current Version: 0.5.10

### Recent Architectural Refactoring
1. **17-Domain `src/` Restructuring**: Clean, single-responsibility domain subdirectories.
2. **Engine Subdomain Split**: Reorganized `src/engine/` into `routing/` and `selection/`.
3. **Registry Provider Metadata**: Standardized provider metadata in `src/registry/providers/`.
4. **Colocated Svelte 5 Frontend**: Web dashboard app located in `src/ui/app/`.
5. **Reorganized Test Suite**: All 117 test files relocated to matching `tests/` domain subdirectories.
6. **Documentation System**: Established `docs/` (architecture, components, guides, reference) and `.context/` AI agent working memory.

## Development Checklist for New Features & UI Changes

Whenever a feature is added, modified, or deleted in the codebase or UI:
- [x] Update `docs/architecture/` if system data flow or lifecycle changes
- [x] Update `docs/components/` for modified modules
- [x] Update `docs/reference/` if new providers, apps, config keys, or env vars are introduced
- [x] Update `.context/current-focus.md` with the change summary
- [x] Update `AGENTS.md` and `CLAUDE.md` if agent workflows are affected
- [x] Update `CHANGELOG.md`

## Recent Changes (v0.5.10)

1. **Bare `anygate` Command**: New `src/cli/root.ts` handler — onboarding flow on first run (3-step: categorize providers, handle selections, summary) and main menu on subsequent runs.
2. **Provider-Aware Model Format Detection**: Rewrote `src/ui/app/src/lib/providers/modelFormat.ts` with `inferModelFormat(modelId, providerId)` that distinguishes OpenAI-compatible providers (NVIDIA, Groq, etc.) from the actual OpenAI provider. Fixes NVIDIA `openai/gpt-oss-120b` being incorrectly marked "unsupported".
3. **Non-TTY Graceful Degradation**: Bare `anygate` in non-interactive mode falls back to help text instead of crashing.
