# Phase 1 Implementation Plan — P0 Critical Fixes

> **Version**: 0.5.11 → 0.5.12
> **Scope**: Phase 1 (P0 — Critical) from CODEBASE_ANALYSIS.md
> **Status**: Ready for execution
> **Skills Required**: `diagnosing-bugs`, `simplify`, `setup-pre-commit`, `security-review`

---

## Pre-Flight Checklist

Before kicking off Phase 1, the following prerequisites must be completed. These follow the instructions in `CLAUDE.md`, `AGENTS.md`, `.context/architecture-rules.md`, `.context/coding-standards.md`, and `.context/current-focus.md`.

### Prerequisites

| # | Prerequisite | Source | Verification |
|---|-------------|--------|-------------|
| 1 | Read `CLAUDE.md` — release workflow, key constraints, commands | `CLAUDE.md` | ✅ Done |
| 2 | Read `AGENTS.md` — domain directory breakdown, test structure | `AGENTS.md` | ✅ Done |
| 3 | Read `.context/architecture-rules.md` — immutable rules (no settings.json mutation, package.json is source of truth, BACKENDS.baseUrl must not include /v1, all non-Anthropic routes through Vercel AI SDK, preserve error classifications, no manual npm publish) | `.context/architecture-rules.md` | ✅ Done |
| 4 | Read `.context/coding-standards.md` — ESM only, .js extensions required, no `any` unless strictly required, async/await preferred, every new module must include Vitest tests | `.context/coding-standards.md` | ✅ Done |
| 5 | Read `.context/current-focus.md` — development checklist: update docs/ and .context/ when features change | `.context/current-focus.md` | ✅ Done |
| 6 | Read `.context/vision.md` — core design principles (app-first interaction, strict env isolation, graceful native degradation, zero-lockin standards) | `.context/vision.md` | ✅ Done |
| 7 | Read `.context/repository-map.md` — authoritative file-by-file inventory | `.context/repository-map.md` | ✅ Done |
| 8 | Verify `npm run typecheck` passes on current code | `CLAUDE.md` | Run `npm run typecheck` |
| 9 | Verify `npm test` passes on current code | `CLAUDE.md` | Run `npm test` |
| 10 | Verify `npm run build` succeeds on current code | `CLAUDE.md` | Run `npm run build` |

### Branch Strategy

Following the release workflow in `CLAUDE.md`:

```bash
git checkout -b phase1-critical-fixes
```

All Phase 1 work happens on this branch. No commits until all tasks are complete and verified.

---

## Task 1: Fix Bare `anygate` Main Menu Dispatch

> **Skill**: `diagnosing-bugs` — Bug diagnosis workflow
> **Files**: `src/cli/root.ts`, `src/cli/index.ts`, `src/cli/claude.ts`, `src/cli/codex.ts`, `src/cli/server.ts`, `src/cli/ui.ts`, `src/cli/providers.ts`, `src/cli/doctor.ts`
> **Priority**: P0 — Critical

### Problem

`src/cli/root.ts` `runMainMenu()` (lines 310-410) shows an interactive menu but the switch cases for `claude`, `codex`, `providers`, `doctor`, `server`, `ui`, `settings` all just print a message via `gateOutro()` and return 0. The actual launch logic is never invoked.

The `dispatchCommand` function in `src/cli/index.ts` already has all command handlers registered. The fix is to construct the appropriate `ParsedArgs` and call `dispatchCommand` instead of returning 0.

### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/cli/root.ts` | **Modify** | Replace `return 0` stubs with `dispatchCommand()` calls |
| `src/cli/index.ts` | **Read** | Verify `dispatchCommand` and `commands` registry |
| `src/cli/claude.ts` | **Read** | Understand `handleClaudeCommand` signature |
| `src/cli/codex.ts` | **Read** | Understand `handleCodexCommand` signature |
| `src/cli/server.ts` | **Read** | Understand `handleServerCommand` signature |
| `src/cli/ui.ts` | **Read** | Understand `handleUiCommand` signature |
| `src/cli/providers.ts` | **Read** | Understand `handleProvidersCommand` signature |
| `src/cli/doctor.ts` | **Read** | Understand `handleDoctorCommand` signature |

### Implementation Steps

1. **Read all command handler signatures** to understand what `ParsedArgs` each expects.
2. **Modify `runMainMenu()` switch cases** to construct minimal `ParsedArgs` and call `dispatchCommand`:
   - `claude` → `{ ...emptyParsed('claude'), claudeArgs: [] }`
   - `codex` → `{ ...emptyParsed('codex'), claudeArgs: [] }`
   - `providers` → `{ ...emptyParsed('providers'), claudeArgs: [] }`
   - `doctor` → `{ ...emptyParsed('doctor') }`
   - `server` → `{ ...emptyParsed('server') }`
   - `ui` → `{ ...emptyParsed('ui') }`
   - `settings` → `{ ...emptyParsed('settings') }` (if a settings handler exists, otherwise map to `providers` or show a message)
3. **Import `dispatchCommand`** from `./index.js` in `root.ts`.
4. **Import `emptyParsed`** helper or construct `ParsedArgs` inline.
5. **Preserve the `onboarding` case** which already calls `runOnboardingFlow()`.
6. **Preserve the `quit` case** which calls `gateOutro('Goodbye!')`.

### Verification

| Check | Method |
|-------|--------|
| TypeScript compiles | `npm run typecheck` |
| Existing tests pass | `npm test` |
| Menu dispatch works | Manual: `anygate` → select "Launch Claude" → should dispatch to claude handler |
| Onboarding still works | Manual: `anygate` (first run) → onboarding flow |
| Quit still works | Manual: `anygate` → select "Quit" → exits cleanly |

### Docs Updates (per `.context/current-focus.md`)

- Update `docs/components/cli.md` if it mentions the main menu behavior
- Update `.context/current-focus.md` with the change summary
- Update `CHANGELOG.md` with the fix entry

---

## Task 2: Audit and Remove Dead Code

> **Skill**: `simplify` — Code simplification and cleanup
> **Files**: `src/engine/`, `src/providers/`, `src/protocols/`, `src/core/`, `src/launchers/`
> **Priority**: P0 — Critical

### Problem

Multiple directories contain dead code (files not imported anywhere in the codebase):

**Confirmed dead code (via grep for imports):**

| Directory | Files | Status |
|-----------|-------|--------|
| `src/engine/` | 10 of 11 files dead | Only `routing/health.ts` used by `src/services/provider-health.ts` |
| `src/providers/` | 8 of 10 files dead | Only `opencode-serve.ts` used; `index.ts` not imported |
| `src/protocols/` | 3 files dead | No imports anywhere |
| `src/core/` | 4 subdirectories dead | All `index.ts` re-exports, no imports |
| `src/launchers/` | 8 files dead | No imports anywhere |

### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/engine/` | **Delete** (9 files) | `routing/router.ts`, `resolver.ts`, `dispatcher.ts`, `strategy.ts`, `failover.ts`, `middleware.ts`, `pipeline.ts`, `selection/selector.ts`, `selection/target-compatibility.ts`, `selection/launch-target.ts` |
| `src/engine/index.ts` | **Delete** | Not imported anywhere |
| `src/engine/routing/health.ts` | **Keep** | Used by `src/services/provider-health.ts` |
| `src/providers/anthropic.ts` | **Delete** | Dead |
| `src/providers/groq.ts` | **Delete** | Dead |
| `src/providers/mistral.ts` | **Delete** | Dead |
| `src/providers/nvidia.ts` | **Delete** | Dead |
| `src/providers/github.ts` | **Delete** | Dead |
| `src/providers/openrouter.ts` | **Delete** | Dead |
| `src/providers/vertex.ts` | **Delete** | Dead |
| `src/providers/ollama.ts` | **Delete** | Dead |
| `src/providers/index.ts` | **Delete** | Not imported |
| `src/protocols/` | **Delete** (3 files + 3 dirs) | `index.ts`, `anthropic/index.ts`, `openai/index.ts`, `google/index.ts` |
| `src/core/` | **Delete** (4 dirs) | `constants/`, `errors/`, `events/`, `interfaces/` — all re-exports, no imports |
| `src/launchers/` | **Delete** (8 files) | `app-launcher.ts`, `desktop.ts`, `index.ts`, `launch.ts`, `linux.ts`, `macos.ts`, `native-launcher.ts`, `shared.ts`, `terminal.ts`, `windows.ts` |
| `tests/engine/` | **Delete** (2 files) | Tests for dead code |

### Implementation Steps

1. **Verify each file is truly dead** — already confirmed via grep (no imports from `src/` or `tests/`).
2. **Check `src/engine/routing/health.ts`** is the only file kept — it's imported by `src/services/provider-health.ts`.
3. **Check `src/providers/opencode-serve.ts`** is kept — it's imported by 5 files.
4. **Delete dead files** using `git rm` to preserve git history.
5. **Delete dead test files** in `tests/engine/`.
6. **Run typecheck** to ensure no broken imports.
7. **Run tests** to ensure nothing breaks.

### Verification

| Check | Method |
|-------|--------|
| TypeScript compiles | `npm run typecheck` |
| All tests pass | `npm test` |
| No broken imports | `npm run typecheck` with no errors |
| Build succeeds | `npm run build` |

### Docs Updates

- Update `.context/repository-map.md` to remove dead directories
- Update `AGENTS.md` to remove dead directory entries
- Update `CLAUDE.md` if it references dead directories
- Update `CHANGELOG.md` with the cleanup entry

---

## Task 3: Add ESLint + Prettier

> **Skill**: `setup-pre-commit` — Set up pre-commit hooks
> **Files**: `.eslintrc.js` (new), `.prettierrc` (new), `package.json` (modify), `.claude/settings.local.json` (may need permission updates)
> **Priority**: P0 — Critical

### Problem

No linting or formatting configuration exists. The coding standards in `.context/coding-standards.md` require strict TypeScript, no `any`, and ESM conventions, but there's no automated enforcement.

### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `.eslintrc.js` | **Create** | ESLint config with TypeScript support |
| `.prettierrc` | **Create** | Prettier config matching existing style |
| `package.json` | **Modify** | Add `lint`, `format`, `lint:fix` scripts; add `eslint` and `prettier` devDependencies |
| `.gitignore` | **Modify** | Ensure `.env` is ignored (already should be) |
| `.claude/settings.local.json` | **Modify** | Add `Bash(npm run lint *)` to permissions allowlist |

### Implementation Steps

1. **Create `.eslintrc.js`** with:
   - `@typescript-eslint/parser` for TypeScript
   - `@typescript-eslint/eslint-plugin` for TypeScript rules
   - `eslint-config-prettier` to disable conflicting rules
   - Rules: no `any` (warn), no unused vars, consistent type imports, ESM conventions
2. **Create `.prettierrc`** matching existing code style:
   - 2-space indent
   - Single quotes
   - No semicolons (matching existing code)
   - Trailing commas (es5)
   - Print width 100
3. **Add scripts to `package.json`**:
   - `"lint": "eslint src/ --ext .ts"`
   - `"lint:fix": "eslint src/ --ext .ts --fix"`
   - `"format": "prettier --write \"src/**/*.ts\""`
   - `"format:check": "prettier --check \"src/**/*.ts\""`
4. **Add devDependencies**:
   - `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-config-prettier`, `prettier`
5. **Install dependencies**: `npm install`
6. **Run lint** to identify issues: `npm run lint`
7. **Fix lint errors** in source files
8. **Set up pre-commit hook** using `setup-pre-commit` skill

### Verification

| Check | Method |
|-------|--------|
| ESLint config is valid | `npm run lint` runs without config errors |
| Prettier config is valid | `npm run format:check` runs |
| Lint passes | `npm run lint` exits 0 |
| Format passes | `npm run format:check` exits 0 |
| Typecheck still passes | `npm run typecheck` |
| Tests still pass | `npm test` |

### Docs Updates

- Update `CLAUDE.md` with lint/format commands
- Update `AGENTS.md` with lint/format commands
- Update `.context/coding-standards.md` to reference ESLint/Prettier
- Update `CHANGELOG.md`

---

## Task 4: Add Security Hardening to Gateway Server

> **Skill**: `security-review` — Security review of changes
> **Files**: `src/gateway/server/router.ts`, `src/shared/http.ts`, `src/gateway/server/server.ts`
> **Priority**: P0 — Critical

### Problem

The gateway server has several security gaps:

1. **No security headers** — `sendJson` in `src/shared/http.ts` only sets `Content-Type: application/json`. Missing: `X-Content-Type-Options`, `X-Frame-Options`, `Cache-Control`, etc.
2. **No rate limiting** — No protection against abuse on gateway endpoints.
3. **Error handling leaks internals** — `src/gateway/server/router.ts` line 159-161: `sendJson(res, 500, { error: { message: err instanceof Error ? err.message : String(err) } })` — sends raw error messages to clients.
4. **No request body size limit on JSON parsing** — `readJson` in `router.ts` calls `readBody` which has a 50MB limit, but JSON parsing of large bodies can still cause DoS.

### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/shared/http.ts` | **Modify** | Add security headers to `sendJson`; add rate limiting helper |
| `src/gateway/server/router.ts` | **Modify** | Fix error handling to use `sendError`; add rate limiting middleware |
| `src/gateway/server/server.ts` | **Read** | Understand server startup for rate limiting config |
| `src/shared/errors.ts` | **Read** | Use `sendError` and `AnygateError` for consistent error handling |
| `src/config/constants.ts` | **Modify** | Add `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `MAX_REQUEST_BODY_BYTES` constants |

### Implementation Steps

#### Step 1: Add Security Headers to `sendJson`

Modify `src/shared/http.ts` `sendJson` to include security headers:

```typescript
export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(json),
  });
  res.end(json);
}
```

#### Step 2: Add Rate Limiting

Add a simple in-memory rate limiter to `src/shared/http.ts`:

```typescript
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  clientId: string,
  windowMs: number,
  maxRequests: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}
```

#### Step 3: Add Constants

Add to `src/config/constants.ts`:

```typescript
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 120; // 120 requests per minute per client
export const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024; // 10MB
```

#### Step 4: Fix Error Handling in `router.ts`

Replace line 159-161 in `src/gateway/server/router.ts`:

```typescript
// Before:
} catch (err) {
  sendJson(res, 500, { error: { message: err instanceof Error ? err.message : String(err) } });
}

// After:
} catch (err) {
  if (err instanceof AnygateError) {
    sendError(res, err);
  } else {
    // Log the full error server-side, send generic message to client
    console.error('Unhandled gateway error:', err);
    sendJson(res, 500, { error: { message: 'Internal server error' } });
  }
}
```

#### Step 5: Add Rate Limiting to Route Handler

In `routeRequest`, add rate limiting check after auth:

```typescript
const clientId = req.headers['x-api-key'] ?? req.socket.remoteAddress ?? 'unknown';
const rateLimit = checkRateLimit(String(clientId), RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS);
if (!rateLimit.allowed) {
  sendJson(res, 429, {
    error: { message: 'Rate limit exceeded' },
  }, { 'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) });
  return;
}
```

#### Step 6: Add Body Size Check

In `readJson`, add a size check before parsing:

```typescript
async function readJson(req: IncomingMessage): Promise<JsonBody | null> {
  try {
    const raw = await readBody(req);
    if (raw.length > MAX_REQUEST_BODY_BYTES) {
      return null; // Will result in 400 error
    }
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}
```

### Verification

| Check | Method |
|-------|--------|
| Security headers present | `curl -I http://localhost:17645/health` → check headers |
| Rate limiting works | Send 120+ requests rapidly → 429 response |
| Error handling doesn't leak | Trigger an error → response should be generic |
| Typecheck passes | `npm run typecheck` |
| Tests pass | `npm test` |
| Build succeeds | `npm run build` |

### Docs Updates

- Update `docs/architecture/gateway.md` with security hardening details
- Update `docs/architecture/authentication.md` with rate limiting info
- Update `CHANGELOG.md`

---

## Task 5: Fix Error Handling Consistency in `router.ts`

> **Skill**: `security-review` — Security review of changes
> **Files**: `src/gateway/server/router.ts`
> **Priority**: P0 — Critical

### Problem

The `routeRequest` function in `src/gateway/server/router.ts` (lines 159-161) catches all errors and sends `err.message` directly to the client. This can leak internal details (stack traces, file paths, internal service names). The codebase already has a proper error hierarchy in `src/shared/errors.ts` with `AnygateError`, `sendError`, and `formatUpstreamError` — these should be used consistently.

### Critical Files

| File | Action | Description |
|------|--------|-------------|
| `src/gateway/server/router.ts` | **Modify** | Fix catch block to use `sendError` for `AnygateError` instances |
| `src/shared/errors.ts` | **Read** | Understand `sendError`, `AnygateError`, `formatUpstreamError` |

### Implementation Steps

1. **Import `sendError` and `AnygateError`** from `src/shared/errors.ts` in `router.ts`.
2. **Replace the catch block** in `routeRequest`:
   - If `err instanceof AnygateError` → use `sendError(res, err)`
   - If `err` is an upstream error → use `formatUpstreamError(err)` and appropriate status
   - Otherwise → log server-side, send generic "Internal server error"
3. **Ensure all error paths** in `handleAnthropicMessages` and `handleOpenAIChatCompletions` use the same pattern (already mostly done, but verify).
4. **Add server-side logging** for non-`AnygateError` exceptions.

### Verification

| Check | Method |
|-------|--------|
| Error responses are safe | Trigger errors → verify no internal details in response |
| `AnygateError` responses use proper format | Verify `sendError` output format |
| Typecheck passes | `npm run typecheck` |
| Tests pass | `npm test` |

### Docs Updates

- Update `docs/architecture/gateway.md` with error handling policy
- Update `CHANGELOG.md`

---

## Verification Matrix

After all 5 tasks are complete, the following verification must pass:

| Check | Command | Expected |
|-------|---------|----------|
| TypeScript compiles | `npm run typecheck` | Exit 0, no errors |
| All tests pass | `npm test` | Exit 0, all tests pass |
| Build succeeds | `npm run build` | Exit 0, dist/ generated |
| Lint passes | `npm run lint` | Exit 0, no errors |
| Format check passes | `npm run format:check` | Exit 0 |
| Main menu dispatches | Manual: `anygate` → select item | Launches correct handler |
| Security headers present | `curl -I http://localhost:17645/health` | Headers include X-Content-Type-Options, X-Frame-Options |
| Error responses are safe | Trigger error | No internal details leaked |
| No dead code | `npm run typecheck` | No unused import errors |

---

## Release Workflow

Following `CLAUDE.md` release workflow:

```bash
# 1. All code changes + docs committed
npm run typecheck && npm test && npm run build

# 2. Bump version
npm version patch --no-git-tag-version  # 0.5.11 → 0.5.12

# 3. Rebuild dist
npm run build

# 4. Commit
git add -A && git commit -m "release: v0.5.12"

# 5. Tag and push (triggers CI → npm publish + GitHub Release)
git tag v0.5.12
git push --follow-tags
```

**DO NOT run `npm publish` locally** — publishing is handled by GitHub Actions.

---

## Skill Mapping Summary

| Task | Skill | Why |
|------|-------|-----|
| Task 1: Fix main menu | `diagnosing-bugs` | Bug diagnosis workflow — trace the dispatch issue, identify root cause (stubs returning 0), implement fix |
| Task 2: Remove dead code | `simplify` | Code simplification and cleanup — audit, identify dead code, remove safely |
| Task 3: Add ESLint/Prettier | `setup-pre-commit` | Set up pre-commit hooks — configure linting, formatting, and git hooks |
| Task 4: Security hardening | `security-review` | Security review — identify vulnerabilities, implement mitigations |
| Task 5: Fix error handling | `security-review` | Security review — prevent information leakage in error responses |

---

## Architectural Invariants Preserved

All Phase 1 changes preserve the immutable rules from `.context/architecture-rules.md`:

1. ✅ **Never mutate `~/.claude/settings.json`** — No changes to settings.json handling
2. ✅ **`package.json` is source of truth for versioning** — No manual version edits
3. ✅ **`BACKENDS.baseUrl` must not include `/v1`** — No changes to backend config
4. ✅ **All non-Anthropic models route through Vercel AI SDK** — No changes to routing
5. ✅ **Always preserve error classifications** — Using `AnygateError` and `sendError` consistently
6. ✅ **No manual `npm publish`** — Following release workflow

---

## Next Phases (Preview)

| Phase | Priority | Tasks |
|-------|----------|-------|
| Phase 2 | P1 (High) | Add integration tests, UI component tests, launcher tests, API reference docs, fix type inconsistencies, add coverage thresholds |
| Phase 3 | P2 (Medium) | Add dark mode, PWA support, i18n, accessibility improvements, structured logging, metrics endpoint, update outdated docs, add ADRs |
| Phase 4 | P3 (Low) | Add visual regression tests, E2E tests, property-based tests, chaos tests, performance benchmarks, contribution guide, code of conduct |
