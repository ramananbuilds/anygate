# Phase 2 Implementation Plan — P1 Developer Experience & Reliability

> **Version**: 0.5.12 → 0.5.13
> **Scope**: P1 (High Priority) items from CODEBASE_ANALYSIS.md
> **Status**: Ready for execution
> **Prerequisite**: Phase 1 (P0) complete and merged to `dev`

---

## Pre-Flight Checklist

| # | Prerequisite | Source | Verification |
|---|-------------|--------|-------------|
| 1 | Phase 1 merged to `dev` | Git history | ✅ Done |
| 2 | `npm run typecheck` passes | CLAUDE.md | Run `npm run typecheck` |
| 3 | `npm test` passes (key tests) | CLAUDE.md | Run `npx vitest run tests/gateway/ tests/cli/` |
| 4 | `npm run lint` passes | CLAUDE.md | Run `npm run lint` |
| 5 | `npm run build` succeeds | CLAUDE.md | Run `npm run build` |

## P1 Tasks

### Task 1: Add Provider Health Tests

> **Skill**: `tdd` — Test-driven development workflow
> **Files**: `tests/services/provider-health.test.ts` (new), `src/services/provider-health.ts`
> **Priority**: P1 — improves reliability, improves provider management

#### Problem

`src/services/provider-health.ts` has 0 tests. The health check logic (using `src/engine/routing/health.ts`) is completely untested.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `tests/services/provider-health.test.ts` | **Create** | Test health check logic, caching, status transitions |
| `src/services/provider-health.ts` | **Read** | Understand health check implementation |
| `src/engine/routing/health.ts` | **Read** | Understand health check primitives |

#### Implementation Steps

1. **Read `src/services/provider-health.ts`** to understand the health check API.
2. **Read `src/engine/routing/health.ts`** to understand the primitives.
3. **Create `tests/services/provider-health.test.ts`** with tests for:
   - Health status transitions (healthy → unhealthy → healthy)
   - Cache TTL behavior
   - Provider-specific health checks
   - Error handling for unreachable providers
4. **Run tests** to verify they pass.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/services/provider-health.test.ts` |
| Typecheck passes | `npm run typecheck` |

---

### Task 2: Add Structured Logging

> **Skill**: `diagnosing-bugs` — Bug diagnosis workflow
> **Files**: `src/shared/logger.ts` (new), `src/gateway/server/router.ts`, `src/gateway/server/server.ts`
> **Priority**: P1 — improves reliability, diagnostics

#### Problem

The gateway server uses `console.error()` for error logging (in `router.ts` catch block). There's no structured logging (JSON format) for diagnostics, making it hard to parse logs in production.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/shared/logger.ts` | **Create** | Structured JSON logger with levels (info, warn, error, debug) |
| `src/gateway/server/router.ts` | **Modify** | Replace `console.error` with structured logger |
| `src/gateway/server/server.ts` | **Modify** | Replace console.log with structured logger |

#### Implementation Steps

1. **Create `src/shared/logger.ts`** with a JSON logger:
   - Levels: `debug`, `info`, `warn`, `error`
   - JSON output: `{"level":"error","msg":"...","ts":"...","err":{...}}`
   - Environment variable `ANYGATE_LOG_LEVEL` to control verbosity
2. **Replace `console.error` in `router.ts`** with `logger.error()`.
3. **Replace `console.log` in `server.ts`** with `logger.info()`.
4. **Run tests** to verify nothing breaks.

#### Verification

| Check | Method |
|-------|--------|
| Typecheck passes | `npm run typecheck` |
| Tests pass | `npx vitest run tests/gateway/` |
| Build succeeds | `npm run build` |

---

### Task 3: Add CI Enforcement

> **Skill**: `setup-pre-commit` — Set up pre-commit hooks
> **Files**: `.github/workflows/ci.yml` (new or modify)
> **Priority**: P1 — improves reliability, reduces maintenance

#### Problem

The CI workflow may not enforce typecheck and tests before publishing. The CLAUDE.md release workflow says "pushing a `v*` tag runs typecheck + tests + build" but the CI workflow may not actually do this.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | **Create/Modify** | Add typecheck + test + lint + build steps |
| `.github/workflows/publish.yml` | **Read** | Check existing publish workflow |

#### Implementation Steps

1. **Read existing CI workflows** in `.github/workflows/`.
2. **Create or update `ci.yml`** with:
   - `npm ci` — install dependencies
   - `npm run typecheck` — type check
   - `npm run lint` — lint check
   - `npm test` — run tests
   - `npm run build` — build
3. **Verify** the workflow is valid YAML.

#### Verification

| Check | Method |
|-------|--------|
| YAML is valid | `npx yaml-lint .github/workflows/ci.yml` |
| Workflow includes all steps | Manual review |

---

### Task 4: Add Coverage Thresholds

> **Skill**: `tdd` — Test-driven development workflow
> **Files**: `vitest.config.ts` (new), `package.json` (modify)
> **Priority**: P1 — reduces maintenance

#### Problem

No coverage thresholds are configured. `npm test` doesn't fail on low coverage.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `vitest.config.ts` | **Create** | Configure coverage thresholds |
| `package.json` | **Modify** | Add `test:coverage` script |

#### Implementation Steps

1. **Create `vitest.config.ts`** with coverage thresholds:
   - Lines: 70%
   - Functions: 70%
   - Branches: 60%
   - Statements: 70%
2. **Add `test:coverage` script** to `package.json`.
3. **Run coverage** to see current state.

#### Verification

| Check | Method |
|-------|--------|
| Coverage config is valid | `npx vitest run --coverage` |
| Thresholds are enforced | `npm run test:coverage` |

---

### Task 5: Add Service Tests

> **Skill**: `tdd` — Test-driven development workflow
> **Files**: `tests/services/downloads.test.ts` (new), `tests/services/self-update.test.ts` (new)
> **Priority**: P1 — improves reliability

#### Problem

`src/services/downloads.ts` and `src/services/self-update.ts` have 0 tests.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `tests/services/downloads.test.ts` | **Create** | Test download logic |
| `tests/services/self-update.test.ts` | **Create** | Test update check logic |
| `src/services/downloads.ts` | **Read** | Understand download API |
| `src/services/self-update.ts` | **Read** | Understand update API |

#### Implementation Steps

1. **Read the service files** to understand the API.
2. **Create test files** with unit tests for key functions.
3. **Run tests** to verify they pass.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/services/` |
| Typecheck passes | `npm run typecheck` |

---

## Verification Matrix

After all P1 tasks are complete:

| Check | Command | Expected |
|-------|---------|----------|
| TypeScript compiles | `npm run typecheck` | Exit 0 |
| ESLint passes | `npm run lint` | 0 errors |
| Prettier passes | `npm run format:check` | All formatted |
| All tests pass | `npm test` | Exit 0 |
| Coverage thresholds | `npm run test:coverage` | Meets thresholds |
| Build succeeds | `npm run build` | Exit 0 |
| CI workflow valid | `npx yaml-lint .github/workflows/ci.yml` | Valid YAML |

---

## Skill Mapping Summary

| Task | Skill | Why |
|------|-------|-----|
| Task 1: Provider health tests | `tdd` | Test-driven development for untested health check logic |
| Task 2: Structured logging | `diagnosing-bugs` | Improve diagnostics for error handling |
| Task 3: CI enforcement | `setup-pre-commit` | Set up CI workflow with enforcement |
| Task 4: Coverage thresholds | `tdd` | Configure test coverage thresholds |
| Task 5: Service tests | `tdd` | Test-driven development for untested services |

---

## Architectural Invariants Preserved

All P1 changes preserve the immutable rules from `.context/architecture-rules.md`:

1. ✅ Never mutate `~/.claude/settings.json`
2. ✅ `package.json` is source of truth for versioning
3. ✅ `BACKENDS.baseUrl` must not include `/v1`
4. ✅ All non-Anthropic models route through Vercel AI SDK
5. ✅ Always preserve error classifications
6. ✅ No manual `npm publish`

---

## Next Phases

| Phase | Priority | Tasks |
|-------|----------|-------|
| Phase 3 | P2 (Medium) | Dark mode, PWA, i18n, accessibility, ADRs, migration guide, update docs |
| Phase 4 | P3 (Low) | UI component tests, E2E tests, performance benchmarks, contribution guide |
