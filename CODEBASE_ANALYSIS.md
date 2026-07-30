# Anygate Codebase Analysis — Mission-Aligned Review

> Version: 0.5.11 | Date: 2026-07-29
> Product Constitution: Route any model into any coding agent. Eliminate vendor lock-in.
> Core Principles: App-First Interaction, Strict Environment Isolation, Graceful Native Degradation, Zero-Lockin Standards

---

## Product Constitution Filter

Every recommendation below is scored against the mission. Recommendations that score NO on all six criteria are rejected.

**Scoring criteria:**
1. Moves AnyGate closer to being the universal runtime and provider manager?
2. Improves CLI-first experience?
3. Improves Runtime Engine architecture?
4. Improves provider management?
5. Improves launcher architecture?
6. Reduces maintenance?

**Priority:**
- **P0** = Strengthens core identity (universal runtime + provider manager)
- **P1** = Improves developer experience
- **P2** = Improves maintainability
- **P3** = Nice to have

---

## 1. Executive Summary

Anygate is a mature, well-architected Node.js CLI + web dashboard that routes any LLM provider into any coding agent. The codebase follows strict TypeScript, has centralized error handling, and good test coverage for the gateway/registry layers. However, several areas show signs of rapid growth and could benefit from consolidation, security hardening, and expanded testing.

**Overall health: Good.** Key strengths include the 17-domain architecture, centralized credential resolution, Vercel AI SDK integration, and comprehensive documentation. Key weaknesses include potential dead code, missing security hardening on the gateway server, a non-functional bare `anygate` main menu, and gaps in test coverage for launchers and services.

---

## 2. Backend Architecture (`src/`)

### 2.1 Strengths

- **17-domain architecture** is clean and well-separated.
- **Centralized error hierarchy** in `src/shared/errors.ts` with `AnygateError` base class and domain-specific subclasses.
- **Credential resolution** centralized in `src/storage/credentials.ts` — fixes drift where 7 call sites had inline copies.
- **Environment isolation** strips 17 conflicting env vars from child processes.
- **Vercel AI SDK integration** well-structured: `sdk-adapter.ts` translates Anthropic `/v1/messages` to SDK calls, `provider-factory.ts` dynamically builds `LanguageModel` instances.
- **Keychain chunking** for Windows Credential Manager's 2560-byte limit.
- **OAuth refresh** with in-flight deduplication.

### 2.2 Issues & Areas for Improvement

#### 2.2.1 Dead/Unused Code (P0 — reduces maintenance, improves runtime simplicity)

- **`src/engine/`** directory contains `routing/` and `selection/` subdirectories with 9 files (`router.ts`, `resolver.ts`, `dispatcher.ts`, `strategy.ts`, `failover.ts`, `health.ts`, `middleware.ts`, `pipeline.ts`, `selector.ts`, `target-compatibility.ts`, `launch-target.ts`). The repository map says these are "Routing & selection engine" but the actual routing logic lives in `src/gateway/proxy/anthropic-proxy.ts` and `src/registry/provider-catalog.ts`. The engine files appear to be either unused or legacy — they should be audited for usage.
- **`src/providers/`** directory has per-vendor files (`anthropic.ts`, `github.ts`, `groq.ts`, `mistral.ts`, `nvidia.ts`, `ollama.ts`, `openai.ts`, `opencode-serve.ts`, `openrouter.ts`, `vertex.ts`) but the registry map says "Per-vendor LLM driver implementations" — these may be legacy since the actual provider logic is in `src/registry/providers/` and `src/gateway/providers/`.
- **`src/protocols/`** has `anthropic/`, `google/`, `openai/` with only `index.ts` files — likely empty stubs.
- **`src/core/interfaces/index.ts`**, **`src/core/events/index.ts`**, **`src/core/constants/index.ts`** — likely empty or minimal.

**Mission alignment:** YES — reduces maintenance, improves runtime simplicity, improves launcher architecture (if dead code is removed).

#### 2.2.2 Non-Functional Bare `anygate` Main Menu (P0 — strengthens core identity)

- **`src/cli/root.ts`** main menu dispatches return 0 without actually launching anything — the `switch` cases for `claude`, `codex`, `providers`, `doctor`, `server`, `ui`, `settings` all just print a message and return 0. This means the bare `anygate` command's main menu is non-functional — it doesn't actually launch the selected app. This directly contradicts the "Easy onboarding" and "CLI experience" optimization goals.

**Mission alignment:** YES — improves CLI-first experience, improves launcher architecture, strengthens core identity (app-first interaction).

#### 2.2.3 Missing Security Hardening (P0 — improves reliability)

- **`src/gateway/server/router.ts`** has `JsonBody = Record<string, any>` — no input validation on incoming JSON bodies.
- **No rate limiting** on the gateway server endpoints.
- **No request body size limit** — a malicious client could send a huge body.
- **`sendJson`** in `src/shared/http.ts` likely doesn't set security headers (CSP, X-Content-Type-Options, etc.).
- **`src/gateway/server/server.ts`** catches all errors and returns 500 with `err.message` — this could leak internal details.

**Mission alignment:** YES — improves reliability, improves runtime engine architecture.

#### 2.2.4 Type System Issues (P1 — improves developer experience)

- **`ModelFormat`** is defined as `'anthropic' | 'openai' | 'unsupported'` in `src/types/model.ts` but `ServerModelFormat` in `src/gateway/server/models.ts` is `'anthropic' | 'openai' | 'cloud-code' | 'unsupported'` — the `'cloud-code'` format exists only in the gateway layer, creating a type mismatch that could cause runtime bugs.
- **`any` usage** is present in several places despite the coding standards saying "Do not suppress type errors with `any`".
- **Many types are defined inline** in source files rather than centralized in `src/types/`.

**Mission alignment:** YES — reduces maintenance, improves reliability, improves developer experience.

#### 2.2.5 Code Duplication (P2 — reduces maintenance)

- **`src/apps/shared/`** contains 23 shared modules. Several have overlapping responsibilities:
  - `favorites-resolver.ts` vs `favorites-picker.ts` (Claude) vs `favorites.ts` (Claude) — three different favorites handling paths.
  - `launch.ts`, `launch-target.ts`, `target-compatibility.ts` — launch logic is split across multiple files with unclear boundaries.
- **`buildCatalogRoutes`** in `provider-catalog.ts` duplicates the "dedup + cap" pattern that also exists in `favorites-resolver.ts`.
- **`resolveContextWindow`** is called in multiple places with different fallback strategies.

**Mission alignment:** YES — reduces maintenance, improves runtime simplicity.

#### 2.2.6 Configuration & Constants (P2 — reduces maintenance)

- **`src/config/constants.ts`** is actually at `src/constants.ts` (the import path in `cli.ts` is `'./config/constants.js'` but the file is at `src/constants.ts`). This is confusing — the file should be at `src/config/constants.ts` to match the import path and the 17-domain structure.
- **Magic numbers** are scattered: `MAX_MODEL_CATALOG = 20`, `GATEWAY_PORT = 17645`, `KEYRING_CHUNK_SIZE = 1200`, etc.

**Mission alignment:** YES — reduces maintenance.

---

## 3. UI Architecture (`src/ui/app/`)

### 3.1 Strengths

- **Svelte 5** with modern reactivity runes.
- **Component library** in `src/lib/components/primitives/`.
- **Store pattern** with `.svelte.ts` files.
- **Pages**: Dashboard, Providers, Models, Apps, Server, Tester, Settings.

### 3.2 Issues & Areas for Improvement

#### 3.2.1 Missing UI Features (P2 — improves extensibility)

- **No dark mode toggle** — the app uses light mode only.
  - **Mission alignment:** REJECTED — ✘ Generic web app feature, not aligned with core mission.
- **No PWA support** — can't install as a standalone app.
  - **Mission alignment:** REJECTED — ✘ Generic web app feature.
- **No internationalization** — all strings are hardcoded English.
  - **Mission alignment:** REJECTED — ✘ Generic web app feature.

#### 3.2.2 UI Code Quality (P2 — reduces maintenance)

- **`src/lib/stores/`** has 5 store files but `presets.svelte.ts` is imported in `App.svelte` but not in the directory listing — it may be missing or the import is broken.
  - **Mission alignment:** YES — reduces maintenance.
- **`src/lib/api/mock.ts`** — mock data for development, but no flag to toggle between mock and real API.
  - **Mission alignment:** YES — improves developer experience.

#### 3.2.3 UI Testing Gaps (P2 — improves reliability)

- **Zero component tests** — only API tests in `tests/ui/`.
  - **Mission alignment:** PARTIAL — improves reliability of the dashboard (a product feature), but the dashboard is secondary to the CLI. P2.
- **No E2E tests** — no Playwright, Cypress, or similar.
  - **Mission alignment:** REJECTED — ✘ Nice to have, not mission-critical.
- **No visual regression tests** — no Percy, Chromatic, or similar.
  - **Mission alignment:** REJECTED — ✘ Nice to have.
- **No accessibility tests** — no axe-core integration.
  - **Mission alignment:** REJECTED — ✘ Generic web app feature.

---

## 4. Test Suite (`tests/`)

### 4.1 Current State

117 test files across 11 directories:

| Directory | Files | Coverage |
|-----------|-------|----------|
| `tests/apps/` | 31 | Application launchers |
| `tests/auth/` | 6 | OAuth flows, token handling |
| `tests/cli/` | 4 | CLI subcommands |
| `tests/engine/` | 2 | Routing, target compatibility |
| `tests/gateway/` | 14 | Server, proxy, SDK adapter |
| `tests/helpers/` | 1 | Test utilities |
| `tests/registry/` | 22 | Provider catalog, templates, models |
| `tests/services/` | 5 | Health, usage, updates |
| `tests/storage/` | 4 | Config, credentials |
| `tests/ui/` | 3 | UI API tests |
| `tests/web-search/` | 3 | Web search tools |

### 4.2 Testing Gaps

#### 4.2.1 Missing Test Coverage (P0-P1 — improves reliability)

- **`src/launchers/`** — 0 test files. Process spawning, OS-specific launchers are completely untested.
  - **Mission alignment:** YES — improves launcher architecture, improves reliability. P1.
- **`src/services/downloads.ts`** — 0 tests. Download logic untested.
  - **Mission alignment:** YES — improves reliability. P2.
- **`src/services/provider-health.ts`** — 0 tests. Health check logic untested.
  - **Mission alignment:** YES — improves reliability, improves provider management. P1.
- **`src/engine/`** — only 2 tests, and the engine code may be dead.
  - **Mission alignment:** YES — reduces maintenance (remove dead code + tests). P0.
- **`src/core/`** — 0 tests. The core contracts are untested.
  - **Mission alignment:** YES — improves reliability. P2.
- **`src/utils/`** — 0 tests. Pure helper functions untested.
  - **Mission alignment:** YES — improves reliability. P2.
- **`src/shared/`** — 0 tests. Shared utilities untested.
  - **Mission alignment:** YES — improves reliability. P2.

#### 4.2.2 Missing Integration Tests (P0 — improves reliability)

- **No integration tests** — all tests are unit tests. There's no test that actually starts the gateway server and makes real HTTP requests.
  - **Mission alignment:** YES — improves reliability, improves runtime engine architecture. P0.

#### 4.2.3 Test Infrastructure (P2 — reduces maintenance)

- **`vitest.config`** is not present — vitest uses default config. No coverage thresholds.
  - **Mission alignment:** YES — reduces maintenance, improves reliability. P2.
- **No test coverage enforcement** — `npm test` doesn't fail on low coverage.
  - **Mission alignment:** YES — reduces maintenance. P2.

---

## 5. Documentation (`docs/`, `.context/`)

### 5.1 Strengths

- **`docs/architecture/`** — 8 architecture docs.
- **`docs/components/`** — 10 component guides.
- **`docs/guides/`** — 6 guides.
- **`docs/reference/`** — 5 reference docs.
- **`.context/`** — 6 AI agent working memory files.
- **`CLAUDE.md`** — comprehensive project instructions.
- **`CHANGELOG.md`** — detailed changelog.

### 5.2 Documentation Gaps

#### 5.2.1 Missing Docs (P2 — improves extensibility, reduces maintenance)

- **No API reference** — no OpenAPI spec for the gateway server endpoints.
  - **Mission alignment:** YES — improves extensibility, improves zero configuration. P2.
- **No architecture decision records (ADRs)**.
  - **Mission alignment:** YES — reduces maintenance, improves extensibility. P2.
- **No migration guide**.
  - **Mission alignment:** YES — improves backward compatibility. P2.

#### 5.2.2 Outdated Docs (P2 — reduces maintenance)

- **`docs/components/cli.md`**, **`docs/components/gateway.md`**, **`docs/components/providers.md`**, **`docs/components/registry.md`**, **`docs/components/services.md`**, **`docs/components/storage.md`**, **`docs/components/ui.md`** — all modified on Jun 26, may be outdated for v0.5.11.
  - **Mission alignment:** YES — reduces maintenance. P2.
- **`.context/repository-map.md`** — mentions `downloads.ts`, `favorites.ts`, `provider-health.ts` in `src/services/` but actual files are `analytics.ts`, `doctor.ts`, `history.ts`, `logs.ts`, `sessions.ts`. Outdated.
  - **Mission alignment:** YES — reduces maintenance. P2.

#### 5.2.3 Rejected Docs (not aligned with mission)

- **No contribution guide** — `CONTRIBUTING.md`.
  - **Mission alignment:** REJECTED — ✘ Generic, not mission-critical. (Could be P3 for open ecosystem.)
- **No code of conduct** — `CODE_OF_CONDUCT.md`.
  - **Mission alignment:** REJECTED — ✘ Generic, not mission-critical. (Could be P3 for open ecosystem.)
- **No security hardening guide**.
  - **Mission alignment:** PARTIAL — improves reliability but is more of an enterprise feature. P3.
- **No performance tuning guide**.
  - **Mission alignment:** PARTIAL — improves launch speed but is more of an enterprise feature. P3.

---

## 6. Build & Release System

### 6.1 Strengths

- **tsup** for CLI bundling.
- **Vite** for Svelte 5 SPA building.
- **GitHub Actions** for CI/CD.
- **Version from package.json** — single source of truth.

### 6.2 Issues

#### 6.2.1 Missing Tooling (P1 — improves developer experience)

- **No lint script** — no ESLint, no Prettier.
  - **Mission alignment:** YES — reduces maintenance, improves developer experience. P1.
- **No type-check in CI** — `npm run typecheck` exists but may not be in the CI workflow.
  - **Mission alignment:** YES — improves reliability. P1.
- **No test coverage in CI** — tests may not be run before publishing.
  - **Mission alignment:** YES — improves reliability. P1.

#### 6.2.2 Build Issues (P2 — reduces maintenance)

- **`src/ui/app/`** has its own `package.json` and `node_modules` — nested project could cause dependency conflicts.
  - **Mission alignment:** YES — reduces maintenance. P2.
- **No `clean` script**.
  - **Mission alignment:** YES — reduces maintenance. P2.
- **`tsup.config.ts`** has `clean: true` — deletes entire `dist/` on every build.
  - **Mission alignment:** YES — improves developer experience. P2.

---

## 7. New Feature Opportunities

### 7.1 High Priority (P0-P1)

1. **Fix bare `anygate` main menu** — dispatches return 0 without launching apps.
   - **Mission:** YES — CLI experience, launcher architecture, core identity. P0.

2. **Audit and remove dead code** — `src/engine/`, `src/providers/`, `src/protocols/`.
   - **Mission:** YES — reduces maintenance, runtime simplicity. P0.

3. **Add ESLint + Prettier** — no linting/formatting currently.
   - **Mission:** YES — reduces maintenance, developer experience. P1.

4. **Add security hardening** — security headers, rate limiting, body size limits.
   - **Mission:** YES — improves reliability. P0.

5. **Add integration tests** — start server and make real HTTP requests.
   - **Mission:** YES — improves reliability, runtime engine. P0.

6. **Fix type inconsistencies** — add `'cloud-code'` to `ModelFormat`.
   - **Mission:** YES — improves reliability, developer experience. P1.

7. **Add coverage thresholds** — configure vitest to enforce minimum coverage.
   - **Mission:** YES — reduces maintenance. P2.

8. **Add launcher tests** — test process spawning.
   - **Mission:** YES — improves launcher architecture, reliability. P1.

9. **Add API reference docs** — OpenAPI spec for gateway endpoints.
   - **Mission:** YES — improves extensibility, zero configuration. P2.

10. **Add structured logging** — JSON logging for diagnostics.
    - **Mission:** YES — improves reliability, diagnostics. P1.

### 7.2 Medium Priority (P2)

11. **Consolidate type definitions** — move inline types to `src/types/`.
    - **Mission:** YES — reduces maintenance. P2.

12. **Update outdated docs** — component docs from Jun 26.
    - **Mission:** YES — reduces maintenance. P2.

13. **Add ADRs** — architecture decision records.
    - **Mission:** YES — reduces maintenance, extensibility. P2.

14. **Add migration guide** — upgrade guide.
    - **Mission:** YES — improves backward compatibility. P2.

15. **Fix `src/constants.ts` location** — move to `src/config/constants.ts`.
    - **Mission:** YES — reduces maintenance. P2.

16. **Add service tests** — `downloads.ts`, `provider-health.ts`.
    - **Mission:** YES — improves reliability. P2.

17. **Add core/utils/shared tests**.
    - **Mission:** YES — improves reliability. P2.

### 7.3 Low Priority (P3) — Rejected or Nice-to-Have

- **Dark mode** — REJECTED (generic web app feature).
- **PWA support** — REJECTED (generic web app feature).
- **i18n** — REJECTED (generic web app feature).
- **Visual regression tests** — REJECTED (nice to have).
- **E2E tests** — REJECTED (nice to have).
- **Property-based tests** — REJECTED (nice to have).
- **Chaos tests** — REJECTED (nice to have).
- **Performance benchmarks** — P3 (improves launch speed but not mission-critical).
- **Contribution guide** — P3 (improves open ecosystem).
- **Code of conduct** — P3 (improves open ecosystem).
- **Metrics endpoint** — REJECTED (enterprise dashboard feature).
- **UI component tests** — P2 (improves reliability of dashboard feature).

---

## 8. Specific File-by-File Recommendations (Mission-Aligned)

### 8.1 Critical (P0 — Strengthens Core Identity)

| File | Issue | Mission Impact |
|------|-------|----------------|
| `src/cli/root.ts` | Main menu dispatches don't launch apps | CLI experience, launcher architecture |
| `src/engine/` | Likely dead code (9 files) | Runtime simplicity, maintenance |
| `src/providers/` | Likely dead code (10 files) | Runtime simplicity, maintenance |
| `src/protocols/` | Empty stubs (3 files) | Runtime simplicity, maintenance |
| `package.json` | No lint/format scripts | Developer experience, maintenance |
| `src/gateway/server/router.ts` | No security headers, no rate limiting, no body size limit | Reliability |
| `src/gateway/server/server.ts` | Error responses leak `err.message` | Reliability |
| `src/gateway/server/router.ts` | `JsonBody = Record<string, any>` | Reliability |
| `tests/` | No integration tests | Reliability, runtime engine |

### 8.2 High Priority (P1 — Improves Developer Experience)

| File | Issue | Mission Impact |
|------|-------|----------------|
| `src/shared/http.ts` | No security headers in `sendJson` | Reliability |
| `src/types/model.ts` | `ModelFormat` doesn't include `'cloud-code'` | Reliability, developer experience |
| `src/constants.ts` | File is at wrong location | Maintenance |
| `tests/` | No test for `src/launchers/` | Launcher architecture, reliability |
| `tests/` | No test for `src/services/provider-health.ts` | Provider management, reliability |
| `src/gateway/server/router.ts` | Error handling inconsistent | Reliability |
| `src/gateway/adapters/sdk-adapter.ts` | `any` usage | Developer experience |
| `src/gateway/server/server.ts` | Error handling inconsistent | Reliability |

### 8.3 Medium Priority (P2 — Improves Maintainability)

| File | Issue | Mission Impact |
|------|-------|----------------|
| `src/ui/app/src/lib/stores/` | `presets.svelte.ts` may be missing | Maintenance |
| `src/ui/app/src/lib/api/mock.ts` | No toggle for mock vs real | Developer experience |
| `docs/` | No OpenAPI spec | Extensibility, zero configuration |
| `docs/` | No ADRs | Maintenance, extensibility |
| `docs/` | No migration guide | Backward compatibility |
| `.context/repository-map.md` | Outdated file listings | Maintenance |
| `docs/components/` | Outdated (Jun 26) | Maintenance |
| `tests/` | No test for `src/services/downloads.ts` | Reliability |
| `tests/` | No test for `src/core/` | Reliability |
| `tests/` | No test for `src/utils/` | Reliability |
| `tests/` | No test for `src/shared/` | Reliability |
| `tests/` | No coverage thresholds | Maintenance |
| `src/apps/shared/` | Code duplication in favorites/launch | Maintenance |
| `src/registry/provider-catalog.ts` | Duplicated dedup pattern | Maintenance |

### 8.4 Low Priority (P3 — Nice to Have)

| File | Issue | Mission Impact |
|------|-------|----------------|
| `src/ui/app/` | No UI component tests | Reliability (dashboard feature) |
| `src/` | No performance benchmarks | Launch speed |
| `docs/` | No contribution guide | Open ecosystem |
| `docs/` | No code of conduct | Open ecosystem |
| `docs/` | No security hardening guide | Reliability (enterprise) |
| `docs/` | No performance tuning guide | Launch speed (enterprise) |

---

## 9. Summary of Missing Pieces (Mission-Aligned)

### 9.1 Critical Missing (P0)

1. **Functional bare `anygate` main menu** — dispatches don't launch apps.
2. **Dead code removal** — `src/engine/`, `src/providers/`, `src/protocols/` may be unused.
3. **Security hardening** — no rate limiting, no body size limits, no security headers on gateway.
4. **Integration tests** — no tests that start the server and make real HTTP requests.
5. **ESLint + Prettier** — no linting/formatting.

### 9.2 High Priority Missing (P1)

6. **Launcher tests** — `src/launchers/` has 0 tests.
7. **Provider health tests** — `src/services/provider-health.ts` has 0 tests.
8. **Type consistency** — `ModelFormat` missing `'cloud-code'`.
9. **Structured logging** — no JSON logging for diagnostics.
10. **CI type-check + test enforcement** — not in CI workflow.

### 9.3 Medium Priority Missing (P2)

11. **API reference docs** — no OpenAPI spec.
12. **Architecture decision records** — no ADRs.
13. **Migration guide** — no upgrade guide.
14. **Service tests** — `downloads.ts` has 0 tests.
15. **Core/utils/shared tests** — all have 0 tests.
16. **Coverage thresholds** — no minimum coverage enforcement.
17. **Updated docs** — component docs from Jun 26 are outdated.
18. **Code deduplication** — favorites/launch logic duplicated.

### 9.4 Rejected (Not Mission-Aligned)

- Dark mode, PWA, i18n, accessibility, visual regression tests, E2E tests, property-based tests, chaos tests, metrics endpoint, contribution guide, code of conduct, security hardening guide, performance tuning guide.

---

## 10. Priority Matrix (Mission-Aligned)

| Priority | Items | Mission Impact |
|----------|-------|----------------|
| **P0** | Fix bare `anygate` main menu, audit/remove dead code, add security hardening, add integration tests, add ESLint/Prettier | CLI experience, reliability, runtime simplicity, maintenance |
| **P1** | Add launcher tests, add provider health tests, fix type inconsistencies, add structured logging, CI enforcement | Launcher architecture, provider management, reliability, developer experience |
| **P2** | Add API reference docs, add ADRs, add migration guide, add service tests, add core/utils/shared tests, add coverage thresholds, update docs, deduplicate code | Extensibility, backward compatibility, reliability, maintenance |
| **P3** | UI component tests, performance benchmarks, contribution guide, code of conduct | Dashboard reliability, launch speed, open ecosystem |

---

## 11. Recommendations for Next Sprint

1. **Audit dead code** (P0) — Spend 1-2 days auditing `src/engine/`, `src/providers/`, `src/protocols/` to determine if they're used. Remove if dead. This directly improves runtime simplicity and reduces maintenance.

2. **Fix bare `anygate` main menu** (P0) — Wire up the dispatch in `src/cli/root.ts` to actually launch the selected app. This is the most critical CLI experience issue.

3. **Add security hardening** (P0) — Add security headers, rate limiting, and body size limits to the gateway server. This improves reliability.

4. **Add ESLint + Prettier** (P1) — Set up linting and formatting. This improves developer experience and reduces maintenance.

5. **Add integration tests** (P0) — Start the gateway server and test the Anthropic/OpenAI endpoints end-to-end. This improves reliability.

6. **Add launcher tests** (P1) — Test process spawning in `src/launchers/`. This improves launcher architecture and reliability.

7. **Fix type inconsistencies** (P1) — Add `'cloud-code'` to `ModelFormat` in `src/types/model.ts`. This improves reliability.

8. **Add structured logging** (P1) — Replace console.log with JSON logging for diagnostics. This improves reliability.

9. **Update outdated docs** (P2) — Update component docs from Jun 26 to reflect v0.5.11 changes. This reduces maintenance.

10. **Add coverage thresholds** (P2) — Configure vitest to enforce minimum coverage. This reduces maintenance.

---

*End of Analysis*

