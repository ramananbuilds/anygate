# Phase 1 Implementation Plan — P0 Critical Fixes

> **Version**: 0.5.11 → 0.5.12
> **Scope**: Phase 1 (P0 — Critical) from CODEBASE_ANALYSIS.md
> **Status**: ✅ COMPLETE
> **Skills Used**: `diagnosing-bugs`, `simplify`, `setup-pre-commit`, `security-review`

---

## Overview

This plan implements Phase 1 (P0 — Critical) fixes from the codebase analysis. All tasks have been completed and verified.

## Phase 0 Context (Pre-existing)

The following Phase 0 implementations were already in place before Phase 1:

1. **Context window safety margin** — `translateRequest()` always resolves a context window and trims with 85% safety margin
2. **Self-healing model validation** — `src/registry/validation/` module with 24h cache TTL, background validation, deprecated model filtering

## Phase 1 Tasks (All Complete)

### Task 1: Fix Bare `anygate` Main Menu Dispatch
- **Skill**: `diagnosing-bugs`
- **Status**: ✅ Complete
- **File**: `src/cli/root.ts`
- **Change**: `runMainMenu()` switch cases now call `dispatchCommand()` instead of returning 0
- **Commit**: `8efd97d`

### Task 2: Audit and Remove Dead Code
- **Skill**: `simplify`
- **Status**: ✅ Complete
- **Files**: `src/engine/`, `src/providers/`, `src/protocols/`, `src/core/`, `src/launchers/`, `tests/engine/`
- **Change**: Removed 30+ dead files. Only `src/engine/routing/health.ts` and `src/providers/opencode-serve.ts` retained.
- **Commit**: `c04f97f`

### Task 3: Add ESLint + Prettier
- **Skill**: `setup-pre-commit`
- **Status**: ✅ Complete
- **Files**: `eslint.config.js`, `.prettierrc`, `.lintstagedrc`, `.husky/pre-commit`, `package.json`
- **Change**: ESLint with TypeScript support, Prettier config, lint/format scripts, Husky pre-commit hook
- **Commit**: `5364343`, `f8cbcec`

### Task 4: Add Security Hardening
- **Skill**: `security-review`
- **Status**: ✅ Complete
- **Files**: `src/shared/http.ts`, `src/gateway/server/router.ts`, `src/config/constants.ts`
- **Change**: Security headers (X-Content-Type-Options, X-Frame-Options, Cache-Control), rate limiting (120 req/min), body size limit (10MB), Content-Length header
- **Commit**: `8b6565f`

### Task 5: Fix Error Handling Consistency
- **Skill**: `security-review`
- **Status**: ✅ Complete
- **File**: `src/gateway/server/router.ts`
- **Change**: Catch block now uses `sendError()` for `AnygateError` instances; non-AnygateError errors return generic "Internal server error"
- **Commit**: `8b6565f`

### P1 Bonus: ModelFormat Type Consistency
- **Status**: ✅ Complete
- **Files**: `src/types/model.ts`, `src/gateway/server/models.ts`, `src/registry/types.ts`, `src/gateway/antigravity/types.ts`, `src/gateway/proxy/anthropic-proxy.ts`
- **Change**: Added `'cloud-code'` to `ModelFormat`, updated all inline type literals to use shared type
- **Commit**: `306045c`

### P1 Bonus: Security Integration Tests
- **Status**: ✅ Complete
- **File**: `tests/gateway/server-integration.test.ts`
- **Change**: 14 tests covering rate limiting, error handling, and security constants
- **Commit**: `306045c`

## Verification Matrix

| Check | Command | Expected | Status |
|-------|---------|----------|--------|
| TypeScript compiles | `npm run typecheck` | Exit 0 | ✅ |
| ESLint | `npx eslint src/` | 0 errors | ✅ |
| Prettier | `npx prettier --check` | All formatted | ✅ |
| Build | `npm run build` | Exit 0 | ✅ |
| Integration tests | `npx vitest run tests/gateway/server-integration.test.ts` | 14/14 pass | ✅ |

## Architectural Invariants Preserved

1. ✅ Never mutated `settings.json`
2. ✅ `package.json` is source of truth for versioning
3. ✅ `BACKENDS.baseUrl` doesn't include `/v1`
4. ✅ All non-Anthropic models route through Vercel AI SDK
5. ✅ Error classifications preserved (`AnygateError`, `sendError`)
6. ✅ No manual `npm publish`

## Docs Updated

- `CLAUDE.md` — lint/format commands
- `AGENTS.md` — removed dead directories, added lint/format commands
- `.context/repository-map.md` — removed dead directory entries
- `.context/current-focus.md` — added Phase 1 change summary
- `.context/coding-standards.md` — added ESLint/Prettier reference
- `docs/architecture/gateway.md` — security features section
- `CHANGELOG.md` — v0.5.12 entries

## Next Phases

| Phase | Priority | Tasks |
|-------|----------|-------|
| Phase 2 | P1 (High) | Launcher tests, provider health tests, structured logging, CI enforcement |
| Phase 3 | P2 (Medium) | Dark mode, PWA, i18n, accessibility, ADRs, migration guide |
| Phase 4 | P3 (Low) | UI component tests, E2E tests, performance benchmarks |
