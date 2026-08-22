# anygate — Full Repository Audit

**Repo:** `E:\anygate` (github.com/ramananbuilds/anygate) · **Version:** 0.6.2 · **Date:** 2026-08-22
**Scope:** security, scalability/reliability, provider & model-routing correctness, token/cost governance, code quality, testing, CI, repo hygiene.

---

## Executive summary

anygate is a well-engineered local LLM gateway with unusually good fundamentals: strict TypeScript that compiles clean, 1,482 green tests wired into CI, OS-keychain credential storage, log redaction, `0600` config files, fail-closed network-mode setup, and ADR-quality architecture docs. However, the audit found **two release-blocker-class issues** (source files imported by committed code that are *not committed*, and a body-size/decompression DoS gap), plus a systemic gap in exactly the areas you asked about: **there is no token budgeting, no spend capping, no retry/failover between providers, and the Anthropic-passthrough path — the primary path for Claude Code OAuth users — records zero usage analytics.**

| Area | Grade | One-line verdict |
|---|---|---|
| Security posture | **B−** | Strong keychain/redaction instincts; timing-unsafe compare, plaintext password fallback, decompress-bomb & rate-limit bypass gaps |
| Provider & model routing | **B** | Thoughtful translation/adapters; silent alias-fallback and silent tool-truncation can surprise users |
| Token & cost governance | **D** | Dashboard-only analytics; passthrough uncounted; no budgets, caps, or alerts anywhere |
| Scalability & reliability | **C+** | No upstream timeouts, no retries/failover/circuit breaker, sync I/O on hot paths, unbounded logs |
| Code quality | **B+** | Strict TS clean, clear layering; dead module, scattered console.*, 8 empty catches |
| Testing & CI | **A−** | 145 files / 1,490 cases green, publish gated; no audit job, no coverage threshold, no negative-path e2e for network auth |
| Dependencies | **B** | Runtime deps clean; dev chain carries 1 critical (vitest 2.x) + 5 high advisories |
| Repo hygiene | **C** | `dist/` tracked in git, untracked imported sources, scratch files at root |

**Overall: B−** — ship-quality core with a broken safety net around cost control and a repo-state landmine.

---

## Metrics

- **Source:** 734 TS files, ~43,262 LOC in `src/` (+ Svelte 5 UI in `src/ui/app`, excluded from root tsconfig)
- **Tests:** 145 test files, 1,482 passed / 8 skipped (~44 s) · `tsc --noEmit` exit 0 · eslint configured
- **Runtime deps:** 24 (19 are `@ai-sdk/*` provider packages — the routing backbone) · dev: 14
- **Largest files:** `src/ui/api.ts` (1,836), `src/apps/codex/responses-adapter.ts` (1,488), `src/gateway/adapters/sdk-adapter.ts` (715), `src/gateway/proxy/anthropic-proxy.ts` (674), `src/gateway/server/router.ts` (628)

---

## 🔴 Critical

### C1. Untracked source files imported by committed code — fresh clones cannot build
`src/gateway/providers/stream-sanitizer.ts` is **not in HEAD** (verified: `git cat-file -e HEAD:…` fails), yet committed `src/gateway/providers/provider-factory.ts:14` does `import { makeSanitizingFetch } from './stream-sanitizer.js'`. Same for `src/registry/data/templates/openai.json` — template loading globs `templates/*.json` (`src/registry/loader/data-loader.ts:51`), so a fresh clone silently loses the OpenAI provider template. Anyone cloning the GitHub repo gets a broken build / missing provider.
**Fix:** commit both files immediately; add a CI step (`git clean -xdn`-style check or `git status --porcelain` guard) that fails when tracked imports reference untracked files.

### C2. Request-body cap and content-decoding are DoS-able
`readBody()` (`src/shared/http.ts:33-55`) buffers up to **50 MB per request in RAM**, and only afterwards does `readJson()` (`router.ts:600-610`) enforce `MAX_REQUEST_BODY_BYTES` = 10 MB (`src/config/constants.ts:72`) — the effective cap is 4× the intended one, held concurrently per request. Worse, `decodeRequestBody()` uses `zlib.gunzipSync/inflateSync/brotliDecompressSync/zstdDecompressSync` with **no output-size bound** — a small compressed body can expand to gigabytes (decompression bomb) before any size check runs.
**Fix:** abort the stream as soon as running total > 10 MB (before concat), and decode in bounded chunks (or reject encodings whose decoded length exceeds `MAX_REQUEST_BODY_BYTES` via streaming inflate with a byte counter).

### C3. Gateway server password falls back to plaintext file — meaningless on Windows
`setSavedServerPassword()` (`src/storage/config.ts:218-233`) writes the network-mode server password into `~/.anygate/config.json` whenever the OS keyring is unavailable, protected only by POSIX `mode: 0o600` (`config.ts:24-31`) — **which Node cannot enforce on Windows** (this machine's platform), leaving it readable by other local processes/users. That password is the *only* thing guarding a `0.0.0.0`-bound gateway (`server.ts:407,508`) that proxies paid model traffic.
**Fix:** never persist to config.json — require the keyring (prompt with instructions) or derive-and-store a key via DPAPI/Keytar-equivalent; treat plaintext fallback as a hard error in network mode.

### C4. Anthropic passthrough traffic is invisible to usage accounting
In `routeRequest` → `handleAnthropicMessages` (`router.ts:238-290`), the `modelFormat === 'anthropic'` branch forwards directly via `forwardAnthropicMessages()` and **never calls `recordUsage()`** — while every SDK branch does (`router.ts:351,367,468,484`). This is the main path for Claude Code OAuth and Anthropic-compatible endpoints, so dashboards materially under-report tokens for exactly the users who care most. (The separate Claude-Desktop proxy *does* count — `anthropic-proxy.ts:425-456` — making the omission easy to miss.)
**Fix:** parse the final SSE `message_delta` / JSON `usage` in the passthrough return path and feed `recordUsage()` like the SDK branches.

### C5. No budget/token enforcement anywhere (by design today — flag it)
Grepping the tree: `budget` appears 13 times, all comments/types — there are **no spend caps, no per-provider/per-model token ceilings, no max_tokens clamps at the gateway boundary, no alerts**. Analytics (`storage/analytics.ts`) is purely retrospective. Combined with C4, a runaway agent session (or a leaked network-mode password) can burn unbounded credits with no tripwire. For a product whose pitch is "route any model," budget guardrails are table stakes.
**Fix (phased):** ① enforce an optional per-request `max_tokens` ceiling per provider; ② add daily/monthly token budgets per provider+app with `429 budget_exceeded` responses; ③ surface burn-rate warnings in the UI dashboard.

---

## 🟠 High

### H1. Timing-unsafe secret comparison
`isAuthorized()` (`gateway/server/auth.ts:8-15`) compares bearer/`x-api-key` values with `===`. Local-network exposure makes exploitation harder, but the fix is trivial: hash both sides or use `crypto.timingSafeEqual`.

### H2. Rate limiter is keyed on an attacker-controlled header and never evicted
`router.ts:156-169` keys `checkRateLimit()` on `x-api-key` header (client-chosen) falling back to socket address; `shared/http.ts:89` keeps a module-global `Map` with **no eviction** — every unique key lives forever (slow memory leak), and rotating the header resets the bucket entirely. Fix: key on socket remote address (real client identity), bucket per IP with periodic sweep, and move the store behind an interface if multi-instance embedding is ever planned.

### H3. Zero timeouts/abort propagation on the forwarding hot path
`forwardAnthropicMessages()` (`upstream-forward.ts:53-141`) does a bare `fetch()` with no `AbortSignal.timeout` and never listens for client `res.close` to cancel upstream. Across `src/` there are 34 `await fetch(` sites; only a handful of files use AbortController. A hung upstream pins the request indefinitely; abandoned Claude-Desktop sessions keep burning upstream tokens after the user closes the window.
**Fix:** wrap upstream calls with a configurable connect/headers timeout, and pipe client disconnect → `AbortController.abort()`.

### H4. No retry, backoff, or provider failover — and the health module is dead code
A 429/5xx from upstream surfaces straight to the client. `src/services/provider-health.ts` implements health tracking (`updateProviderHealth`, `isProviderHealthy`, circuit-breaker-shaped API) but **has zero callers** — it's an unfinished feature. For an aggregator gateway, automatic retry-with-backoff on idempotent failures and failover to a configured alternate model/provider is a core expectation.
**Fix:** wire provider-health into the router; add bounded retry (respect `Retry-After`) for GET/models and streaming-safe retry-before-first-byte for messages; optional `fallbackModel` route config.

### H5. Silent model-routing behaviors that surprise on cost
- Unknown model alias **silently falls back to the default route** (`proxy/anthropic-proxy.ts:296-309`) — a typo can route a session to an expensive default model with no client-visible signal.
- Tools beyond the provider cap are **silently truncated** (`router.ts:307-313`, logged only via plog) — agents lose tools mid-run with no error.
**Fix:** return a warning header/response field (`anthropic-warning`) or a non-fatal `error` event; make alias fallback opt-in.

### H6. Dev-dependency advisories incl. 1 critical; no audit gate
`npm audit`: **critical** in `vitest` (direct, fix = major bump to 4.1.11); **high** in brace-expansion, js-yaml, nanoid, postcss, socket.io-parser, vite/esbuild/vite-node (transitive). All are dev-chain (published bundle is clean — verified `files: ["dist"]` + runtime deps list), but CI has no `npm audit` step, so future *runtime* regressions would land unnoticed.
**Fix:** bump vitest to 4.x (major), add `npm audit --omit=dev || true` reporting job, consider `overrides` for the reachable transitives.

---

## 🟡 Medium

- **M1. Analytics file: unbounded growth + O(file) synchronous re-read per dashboard request** — `appendAtomic` appends forever; `readAnalyticsLog()` (`storage/analytics.ts:130-151`) `readFileSync`s and splits the whole JSONL on every `GET /api/analytics`, blocking the event loop as history grows. Add daily rotation + aggregate rollups.
- **M2. UI API has no Host-header validation** (`ui/api.ts`) — binds loopback with an ephemeral port and restricts CORS to loopback origins (good), but DNS-rebinding pages can still POST to `/api/keys`, `/api/providers/add`, `/api/server/start` because Origin is absent on non-CORS requests. Validate `Host` ∈ {localhost:port, 127.0.0.1:port}.
- **M3. `streamText({ onError: () => {} })` swallows mid-stream errors** (`sdk-adapter.ts:632,671`) — combined with fire-and-forget `.catch(() => {})` on result promises (636-640), partial failures can disappear without the router's post-start error event firing.
- **M4. Logging discipline** — 274 `console.*` sites (≈129 outside CLI entrypoints); `logger` exists but adapters/gateway mix raw console gated behind `ANYGATE_TRACE`. Route through the logger with levels.
- **M5. Eight empty catch blocks** (`apps/shared/update-check.ts:109,113`, `ui/command.ts:62,69`, `gemini/antigravity.ts:506`, `antigravity/cloud-code-gateway.ts:176`, UI mocks) — at minimum debug-log.
- **M6. `readJson()` conflates all failures** ("Invalid JSON body" 400 covers too-large, bad encoding, decompression errors) — return distinct statuses for debuggability.
- **M7. Context-fit image accounting undercounts** — `context-fit.ts` floors base64 images at ~512 estimated tokens; real vision tokens are far larger, so image-heavy sessions can still overflow and hit upstream 400s. Use per-model image-token constants.
- **M8. Fixed port 17645** — second instance dies with an unhandled EADDRINUSE-style error instead of failing gracefully or offering `--port`.
- **M9. `dist/` is tracked in git (46 files)** — currently generating M/D status churn (deleted/mutated chunk hashes). Build artifacts in VCS cause merge conflicts and risk shipping stale chunks; `.gitignore` it and rely on the existing `prepublishOnly` build gate.

## 🟢 Low

- Upstream non-OK bodies are proxied verbatim to clients (`upstream-forward.ts:90-98`) — occasionally leaks provider-account details; scrub known fields.
- Log-redaction prefix list (`shared/redact.ts`) covers sk-/sk-ant-/AIza/gsk_; providers with unprefixed keys (some Mistral/Together-style keys) pass through unredacted — consider redacting by config-known key values.
- `languageModelCache` and favorites caches are unbounded but catalog-bounded — fine; document assumption.
- Scratch files `provider-tmp.txt`, `pt.txt`, `template-check.txt` (BOM+CRLF copies of `provider-templates.ts`) at repo root — delete; they nearly became a secrets-scare pattern.
- Graceful shutdown doesn't drain active SSE streams (`waitForShutdown` → `close()`); clients get abrupt TCP resets.

---

## Testing & CI assessment

Strong: 145 files / 1,490 cases, all green; CI runs typecheck → lint → test → UI install → build on push/PR; publish workflow re-runs typecheck+test+build before `npm publish` and derives release notes from CHANGELOG.

Gaps:
1. **No negative-path integration test for network-mode auth** — password-required flows, rate-limit bypass via header rotation (H2), and oversized/compressed bodies (C2) are untested behaviors.
2. **No coverage thresholds** — `@vitest/coverage-v8` is installed but `vitest.config.ts` enforces none; gateway/router hot paths deserve floor thresholds.
3. **No dependency-audit CI job** (see H6).
4. **No cross-platform matrix** — Windows path/permission semantics differ (C3 was found precisely because of this), yet CI is ubuntu-only.

---

## Performance & scalability notes

The single-user local design is sound (Node http, streaming pipe-through, per-server `languageModelCache`). The scaling risks, in order of real-world impact:
1. Unbounded in-RAM request buffering + decompression (C2).
2. No upstream timeouts/disconnect propagation (H3) → hung sockets accumulate.
3. Sync filesystem I/O in request paths (`recordUsage` → `writeSync`; analytics full-file reads per dashboard poll) — acceptable now, degrades with history size (M1).
4. In-memory rate limiting & health maps are per-process globals — correct for the current embed-one-server model, a trap if two gateways ever share a process (module-level state in `shared/http.ts`, `services/provider-health.ts`).
5. No queuing/backpressure concept: N concurrent 50 MB bodies = N×50 MB resident, by construction.

---

## Done well

- Credential handling architecture: OS keychain first, centralized resolution (ADR 004), `sanitizeCredential` paste-noise stripping at every boundary, `redactTraceLine` applied to debug logs, trace files `chmod 0600`.
- Fail-closed server setup: network mode refuses to start without a password; local vs network binding explicit; discovery-ID masking for Claude Desktop.
- Layering rules are documented and mostly honored (core ↛ agents; gateway redaction doesn't import agents).
- Test suite quality: 1,490 fast unit tests including gateway auth, favorites-only catalogs, model-id path routing, and shutdown behavior.
- Docs culture: ADRs, per-app guides, PROVIDERS/MODEL-COMPATIBILITY references, AI-AGENTS contract.
- Stream resilience details born of real debugging: mid-stream Anthropic error events after headers sent (router.ts:384-393), Codex zstd body decoding, reasoning_content round-trip preservation for DeepSeek/Qwen/GLM.

---

## Prioritized remediation

| # | Action | Finding | Severity | Effort |
|---|---|---|---|---|
| 1 | Commit `stream-sanitizer.ts` + `templates/openai.json`; add untracked-import CI guard | C1 | 🔴 Blocker | XS |
| 2 | Enforce body cap during read; bound decompressed size | C2 | 🔴 Critical | S |
| 3 | Remove plaintext server-password fallback (hard-require keyring in network mode) | C3 | 🔴 Critical | S |
| 4 | Record usage on Anthropic passthrough path | C4 | 🔴 Critical | S |
| 5 | Design + ship token budgets/caps (per-provider daily/monthly, 429 on exceed) | C5 | 🔴 Critical | M |
| 6 | Upstream timeouts + client-disconnect abort | H3 | 🟠 High | M |
| 7 | Wire provider-health; add retry/backoff + optional failover route | H4 | 🟠 High | M |
| 8 | `timingSafeEqual` for server password compare | H1 | 🟠 High | XS |
| 9 | Rate limiter: key on socket addr, evict stale buckets | H2 | 🟠 High | XS |
| 10 | Surface alias-fallback & tool-truncation warnings to clients | H5 | 🟠 High | S |
| 11 | Bump vitest to 4.x; add npm-audit CI job | H6 | 🟠 High | S |
| 12 | Analytics rotation + rollups; async dashboard reads | M1 | 🟡 Med | M |
| 13 | Host-header validation on UI API | M2 | 🟡 Med | XS |
| 14 | Stop tracking `dist/`; delete scratch txt files | M9/Low | 🟡 Med | XS |
| 15 | Logger levels + empty-catch cleanup; distinct readJson errors | M3-M6 | 🟡 Med | S |
| 16 | Windows CI leg + network-auth e2e + coverage thresholds | Testing | 🟡 Med | M |

*X = extra-small, S = ≤ half day, M = 1–3 days.*
