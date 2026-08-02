# Phase 3 Implementation Plan — P2 Maintainability & Extensibility

> **Version**: 0.5.13 → 0.5.14
> **Scope**: P2 (Medium Priority) items from CODEBASE_ANALYSIS.md
> **Status**: Ready for execution
> **Prerequisite**: Phase 2 (P1) complete and merged to `dev`

---

## Pre-Flight Checklist

| # | Prerequisite | Source | Verification |
|---|-------------|--------|-------------|
| 1 | Phase 1 (P0) merged to `dev` | Git history | ✅ Done |
| 2 | Phase 2 (P1) merged to `dev` | Git history | ✅ Done |
| 3 | `npm run typecheck` passes | CLAUDE.md | Run `npm run typecheck` |
| 4 | `npm test` passes (key tests) | CLAUDE.md | Run `npx vitest run tests/gateway/ tests/services/` |
| 5 | `npm run lint` passes | CLAUDE.md | Run `npm run lint` |
| 6 | `npm run build` succeeds | CLAUDE.md | Run `npm run build` |

---

## P2 Tasks

### Task 1: Audit & Consolidate Dead Code in `src/engine/` and `src/providers/`

> **Skill**: `codebase-design` — Deep module design and seam identification
> **Files**: `src/engine/routing/health.ts`, `src/providers/opencode-serve.ts`, `src/services/provider-health.ts`
> **Priority**: P2 — reduces maintenance, improves runtime simplicity

#### Problem

`src/engine/` contains only `routing/health.ts` (a simple in-memory health map re-exported by `src/services/provider-health.ts`). The repository map says these are "Routing & selection engine" but the actual routing logic lives in `src/gateway/proxy/` and `src/registry/provider-catalog.ts`. The engine files appear to be either unused or legacy — they should be audited for usage.

`src/providers/` contains only `opencode-serve.ts` — a single driver. The analysis says "per-vendor stubs removed" but the directory structure suggests it may be a leftover from a larger refactor.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/engine/routing/health.ts` | **Read** | Understand health check primitives |
| `src/services/provider-health.ts` | **Read** | Understand service-layer re-export |
| `src/providers/opencode-serve.ts` | **Read** | Understand OpenCode serve driver |
| `src/engine/routing/health.ts` | **Move** | Consolidate into `src/services/provider-health.ts` |
| `src/engine/` | **Remove** | Delete empty directory after consolidation |

#### Implementation Steps

1. **Read `src/engine/routing/health.ts`** to understand the health check primitives.
2. **Read `src/services/provider-health.ts`** to understand the service-layer re-export.
3. **Consolidate** the health check logic directly into `src/services/provider-health.ts`, removing the indirection through `src/engine/routing/health.ts`.
4. **Update imports** in `tests/services/provider-health.test.ts` to import from `src/services/provider-health.ts` instead of `src/engine/routing/health.ts`.
5. **Delete `src/engine/`** directory after consolidation.
6. **Read `src/providers/opencode-serve.ts`** to determine if it should be moved to `src/gateway/providers/` or kept.
7. **Run tests** to verify nothing breaks.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/services/provider-health.test.ts` |
| Typecheck passes | `npm run typecheck` |
| `src/engine/` removed | `ls src/engine/` fails |

---

### Task 2: Add `src/utils/` Tests

> **Skill**: `tdd` — Test-driven development workflow
> **Files**: `tests/utils/*.test.ts` (new), `src/utils/*.ts`
> **Priority**: P2 — improves reliability

#### Problem

`src/utils/` has 11 files (`agent-io.ts`, `array.ts`, `crypto.ts`, `files.ts`, `http.ts`, `index.ts`, `json.ts`, `network.ts`, `paths.ts`, `string.ts`, `time.ts`) with 0 tests. These are pure helper functions that should be tested.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/utils/array.ts` | **Read** | Array helpers |
| `src/utils/crypto.ts` | **Read** | Crypto helpers |
| `src/utils/files.ts` | **Read** | File system helpers |
| `src/utils/http.ts` | **Read** | HTTP helpers |
| `src/utils/json.ts` | **Read** | JSON helpers |
| `src/utils/network.ts` | **Read** | Network helpers |
| `src/utils/paths.ts` | **Read** | Path helpers |
| `src/utils/string.ts` | **Read** | String helpers |
| `src/utils/time.ts` | **Read** | Time helpers |
| `tests/utils/` | **Create** | Test files for each utility module |

#### Implementation Steps

1. **Read each utility file** to understand the API.
2. **Create test files** in `tests/utils/` with unit tests for key functions.
3. **Run tests** to verify they pass.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/utils/` |
| Typecheck passes | `npm run typecheck` |

---

### Task 3: Add `src/shared/` Tests

> **Skill**: `tdd` — Test-driven development workflow
> **Files**: `tests/shared/*.test.ts` (new), `src/shared/*.ts`
> **Priority**: P2 — improves reliability

#### Problem

`src/shared/` has 9 files (`errors.ts`, `events.ts`, `http.ts`, `index.ts`, `logger.ts`, `prompts.ts`, `redact.ts`, `schemas.ts`, `validators.ts`) with 0 dedicated tests (some are tested indirectly via gateway tests). The `logger.ts` was recently enhanced with JSON output and should have dedicated tests.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/shared/logger.ts` | **Read** | Enhanced logger with JSON output |
| `src/shared/errors.ts` | **Read** | Error hierarchy |
| `src/shared/redact.ts` | **Read** | Credential redaction |
| `src/shared/validators.ts` | **Read** | Input validators |
| `src/shared/schemas.ts` | **Read** | Schema definitions |
| `tests/shared/` | **Create** | Test files for shared modules |

#### Implementation Steps

1. **Read `src/shared/logger.ts`** to understand the enhanced logger API.
2. **Create `tests/shared/logger.test.ts`** with tests for:
   - JSON output mode (`ANYGATE_LOG_FORMAT=json`)
   - Log level filtering (`ANYGATE_LOG_LEVEL`)
   - Error object logging with stack traces
   - Structured fields
   - Human-readable output mode
3. **Read `src/shared/redact.ts`** and create tests for credential redaction.
4. **Read `src/shared/validators.ts`** and create tests for input validation.
5. **Run tests** to verify they pass.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/shared/` |
| Typecheck passes | `npm run typecheck` |

---

### Task 4: Add Architecture Decision Records (ADRs)

> **Skill**: `domain-modeling` — Build and sharpen a project's domain model
> **Files**: `docs/adr/` (new directory), `docs/adr/*.md`
> **Priority**: P2 — reduces maintenance, improves extensibility

#### Problem

No architecture decision records (ADRs) exist. ADRs document key architectural decisions, making it easier for new contributors to understand why certain choices were made.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `docs/adr/001-provider-routing.md` | **Create** | ADR: Vercel AI SDK for non-Anthropic providers |
| `docs/adr/002-environment-isolation.md` | **Create** | ADR: Strip conflicting env vars from child processes |
| `docs/adr/003-gateway-server.md` | **Create** | ADR: Gateway server architecture and security |
| `docs/adr/004-credential-resolution.md` | **Create** | ADR: Centralized credential resolution |
| `docs/adr/005-structured-logging.md` | **Create** | ADR: Structured JSON logging with ANYGATE_LOG_LEVEL |

#### Implementation Steps

1. **Create `docs/adr/` directory**.
2. **Create ADR 001**: Provider routing through Vercel AI SDK.
3. **Create ADR 002**: Environment variable isolation for child processes.
4. **Create ADR 003**: Gateway server architecture and security model.
5. **Create ADR 004**: Centralized credential resolution.
6. **Create ADR 005**: Structured JSON logging.
7. **Update `docs/architecture/overview.md`** to reference ADRs.

#### Verification

| Check | Method |
|-------|--------|
| ADR files exist | `ls docs/adr/` |
| Overview references ADRs | `grep -r "adr" docs/architecture/overview.md` |

---

### Task 5: Add Migration Guide

> **Skill**: `domain-modeling` — Build and sharpen a project's domain model
> **Files**: `docs/guides/migration.md` (new)
> **Priority**: P2 — improves backward compatibility

#### Problem

No migration guide exists. Users upgrading from older versions need guidance on breaking changes and migration steps.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `docs/guides/migration.md` | **Create** | Migration guide for v0.5.x |
| `CHANGELOG.md` | **Read** | Review changelog for breaking changes |

#### Implementation Steps

1. **Read `CHANGELOG.md`** to identify breaking changes.
2. **Create `docs/guides/migration.md`** with:
   - Version upgrade matrix
   - Breaking changes per version
   - Migration steps for each breaking change
   - Common issues and troubleshooting
3. **Update `docs/guides/index.md`** to link to the migration guide.

#### Verification

| Check | Method |
|-------|--------|
| Migration guide exists | `ls docs/guides/migration.md` |
| Links from guides index | `grep "migration" docs/guides/index.md` |

---

### Task 6: Add API Reference (OpenAPI Spec)

> **Skill**: `codebase-design` — Deep module design and seam identification
> **Files**: `docs/reference/openapi.yaml` (new)
> **Priority**: P2 — improves extensibility, zero configuration

#### Problem

No API reference exists for the gateway server endpoints. An OpenAPI spec would help users understand the available endpoints and their parameters.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `docs/reference/openapi.yaml` | **Create** | OpenAPI 3.0 spec for gateway endpoints |
| `src/gateway/server/router.ts` | **Read** | Review endpoint definitions |

#### Implementation Steps

1. **Read `src/gateway/server/router.ts`** to understand all endpoints.
2. **Create `docs/reference/openapi.yaml`** with:
   - `/health` endpoint
   - `/models` endpoint
   - `/anthropic/v1/models` endpoint
   - `/openai/v1/models` endpoint
   - `/anthropic/v1/messages` endpoint
   - `/openai/v1/chat/completions` endpoint
3. **Update `docs/reference/index.md`** to link to the OpenAPI spec.

#### Verification

| Check | Method |
|-------|--------|
| OpenAPI spec exists | `ls docs/reference/openapi.yaml` |
| Valid YAML | `npx yaml-lint docs/reference/openapi.yaml` |

---

### Task 7: Update Outdated Documentation

> **Skill**: `domain-modeling` — Build and sharpen a project's domain model
> **Files**: `docs/components/*.md`, `.context/repository-map.md`
> **Priority**: P2 — reduces maintenance

#### Problem

Component docs from Jun 26 are outdated. The repository map is missing `src/engine/`, `src/services/`, `src/types/`, and `src/utils/` directories.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `docs/components/cli.md` | **Read** | CLI component docs |
| `docs/components/gateway.md` | **Read** | Gateway component docs |
| `docs/components/services.md` | **Read** | Services component docs |
| `docs/components/storage.md` | **Read** | Storage component docs |
| `.context/repository-map.md` | **Read** | Repository map |
| `docs/components/*.md` | **Update** | Update to reflect v0.5.13 |
| `.context/repository-map.md` | **Update** | Add missing directories |

#### Implementation Steps

1. **Read each component doc** to identify outdated content.
2. **Read `.context/repository-map.md`** to identify missing directories.
3. **Update component docs** to reflect current architecture.
4. **Update repository map** to include `src/engine/`, `src/services/`, `src/types/`, `src/utils/`.
5. **Verify** all docs are consistent with the current codebase.

#### Verification

| Check | Method |
|-------|--------|
| Component docs updated | `grep "0.5.13" docs/components/*.md` |
| Repository map updated | `grep "src/engine\|src/services\|src/types\|src/utils" .context/repository-map.md` |

---

### Task 8: Deduplicate Code in `src/apps/shared/`

> **Skill**: `simplify` — Review changed code for reuse, simplification, efficiency
> **Files**: `src/apps/shared/favorites-resolver.ts`, `src/apps/shared/favorites-picker.ts`, `src/apps/shared/launch.ts`
> **Priority**: P2 — reduces maintenance

#### Problem

`src/apps/shared/` contains 23 shared modules. Several have overlapping responsibilities:
- `favorites-resolver.ts` vs `favorites-picker.ts` (Claude) vs `favorites.ts` (Claude) — three different favorites handling paths.
- `launch.ts`, `launch-target.ts`, `target-compatibility.ts` — launch logic is split across multiple files with unclear boundaries.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/apps/shared/favorites-resolver.ts` | **Read** | Favorites resolver |
| `src/apps/shared/favorites-picker.ts` | **Read** | Favorites picker |
| `src/apps/shared/launch.ts` | **Read** | Launch logic |
| `src/apps/shared/launch-target.ts` | **Read** | Launch target |
| `src/apps/shared/target-compatibility.ts` | **Read** | Target compatibility |

#### Implementation Steps

1. **Read all favorites-related files** to understand the duplication.
2. **Identify common patterns** and create a unified favorites module.
3. **Consolidate launch logic** into a single `launch.ts` with clear boundaries.
4. **Update imports** in affected files.
5. **Run tests** to verify nothing breaks.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/apps/` |
| Typecheck passes | `npm run typecheck` |
| No duplicate imports | `grep -r "favorites-resolver\|favorites-picker" src/ | wc -l` |

---

### Task 9: Fix Duplicated Dedup Pattern in `src/registry/provider-catalog.ts`

> **Skill**: `simplify` — Review changed code for reuse, simplification, efficiency
> **Files**: `src/registry/provider-catalog.ts`, `src/apps/shared/favorites-resolver.ts`
> **Priority**: P2 — reduces maintenance

#### Problem

`buildCatalogRoutes` in `provider-catalog.ts` duplicates the "dedup + cap" pattern that also exists in `favorites-resolver.ts`.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/registry/provider-catalog.ts` | **Read** | Review `buildCatalogRoutes` |
| `src/apps/shared/favorites-resolver.ts` | **Read** | Review dedup pattern |
| `src/utils/array.ts` | **Read** | Check for existing dedup helpers |

#### Implementation Steps

1. **Read both files** to understand the duplicated pattern.
2. **Extract a shared dedup utility** into `src/utils/array.ts`.
3. **Update both call sites** to use the shared utility.
4. **Run tests** to verify nothing breaks.

#### Verification

| Check | Method |
|-------|--------|
| Tests pass | `npx vitest run tests/registry/` |
| Typecheck passes | `npm run typecheck` |
| No duplicate dedup logic | `grep -rn "dedup\|unique" src/registry/provider-catalog.ts src/apps/shared/favorites-resolver.ts` |

---

### Task 10: Add UI API Mock Toggle

> **Skill**: `frontend-design` — Frontend design and component architecture
> **Files**: `src/ui/app/src/lib/api/mock.ts`, `src/ui/app/src/lib/stores/theme.svelte.ts`
> **Priority**: P2 — improves developer experience

#### Problem

`src/ui/app/src/lib/api/mock.ts` has mock data for development, but no flag to toggle between mock and real API.

#### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/ui/app/src/lib/api/mock.ts` | **Read** | Mock data |
| `src/ui/app/src/lib/api/index.ts` | **Read** | API client |
| `src/ui/app/src/lib/stores/theme.svelte.ts` | **Read** | Theme store (for pattern reference) |

#### Implementation Steps

1. **Read `mock.ts`** to understand the mock data structure.
2. **Add a `VITE_USE_MOCK_API` environment variable** to toggle mock vs real API.
3. **Update the API client** to check the flag and use mock data when enabled.
4. **Document the toggle** in `docs/guides/development.md`.

#### Verification

| Check | Method |
|-------|--------|
| Mock toggle works | `VITE_USE_MOCK_API=true npm --prefix src/ui/app run dev` |
| Real API still works | `VITE_USE_MOCK_API=false npm --prefix src/ui/app run dev` |

---

## Verification Matrix

After all P2 tasks are complete:

| Check | Command | Expected |
|-------|---------|----------|
| TypeScript compiles | `npm run typecheck` | Exit 0 |
| ESLint passes | `npm run lint` | 0 errors |
| Prettier passes | `npm run format:check` | All formatted |
| All tests pass | `npm test` | Exit 0 |
| Coverage thresholds | `npm run test:coverage` | Meets thresholds |
| Build succeeds | `npm run build` | Exit 0 |
| ADRs exist | `ls docs/adr/` | 5+ files |
| Migration guide exists | `ls docs/guides/migration.md` | File exists |
| OpenAPI spec exists | `ls docs/reference/openapi.yaml` | File exists |
| `src/engine/` removed | `ls src/engine/` | Fails |

---

## Skill Mapping Summary

| Task | Skill | Why |
|------|-------|-----|
| Task 1: Audit dead code | `codebase-design` | Deep module design and seam identification for consolidation |
| Task 2: Utils tests | `tdd` | Test-driven development for untested utility functions |
| Task 3: Shared tests | `tdd` | Test-driven development for shared utilities |
| Task 4: ADRs | `domain-modeling` | Document architectural decisions and domain model |
| Task 5: Migration guide | `domain-modeling` | Document version migration paths and domain changes |
| Task 6: API reference | `codebase-design` | Design API surface documentation |
| Task 7: Update docs | `domain-modeling` | Keep documentation consistent with domain model |
| Task 8: Deduplicate code | `simplify` | Review and simplify duplicated code |
| Task 9: Fix dedup pattern | `simplify` | Simplify duplicated dedup pattern |
| Task 10: UI mock toggle | `frontend-design` | Frontend component architecture and dev experience |

---

## Commit Strategy

Each stage should be committed separately with a clear message:

| Stage | Commit Message |
|-------|---------------|
| Task 1 | `refactor: consolidate src/engine/ into src/services/provider-health.ts` |
| Task 2 | `test: add src/utils/ test coverage` |
| Task 3 | `test: add src/shared/ test coverage` |
| Task 4 | `docs: add architecture decision records (ADRs)` |
| Task 5 | `docs: add migration guide` |
| Task 6 | `docs: add OpenAPI spec for gateway endpoints` |
| Task 7 | `docs: update outdated documentation and repository map` |
| Task 8 | `refactor: deduplicate favorites and launch code` |
| Task 9 | `refactor: extract shared dedup utility` |
| Task 10 | `ui: add API mock toggle for development` |

Use the `caveman-commit` skill for commit message generation if needed.

---

## Architectural Invariants Preserved

All P2 changes preserve the immutable rules from `.context/architecture-rules.md`:

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
| Phase 4 | P3 (Low) | UI component tests, E2E tests, performance benchmarks, contribution guide |
