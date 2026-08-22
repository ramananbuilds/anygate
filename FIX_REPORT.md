# Anygate Audit Remediation Report

Full audit findings (C=critical, H=high) from CODEBASE_REVIEW.md and their remediation status.
Final state: `npx tsc --noEmit` clean · **149 test files / 1,516 passed + 8 skipped** (baseline 1,489 → +27 new tests).

| Finding | Status | Files | Change | Tests added | Commit |
|---|---|---|---|---|---|
| Phase0/M9 hygiene | ✅ done-by-prior-agent | scratch files, dist/ | Removed scratch/debug files; dist/ untracked | — | `9ff59fd` (snapshot) |
| C1: orphaned sources untracked | ✅ done-by-prior-agent | stream-sanitizer.ts, templates/openai.json | Staged into git so builds are reproducible | — | `9ff59fd` |
| C2: 50MB body buffer + unbounded zlib decompress (DoS) | ✅ done-by-prior-agent | src/shared/http.ts | Bounded body reads to MAX_REQUEST_BODY_BYTES; bounded decompression | eviction test fixed | `9ff59fd` |
| C3: plaintext server-password fallback | ✅ done-by-prior-agent | src/storage/config.ts | Fallback removed; keyring-only | config tests | `9ff59fd` |
| H1: non-timing-safe password compare | ✅ done-by-prior-agent | src/gateway/server/auth.ts | `timingSafeEqualStrings()` for all secret compares | 5 auth tests | `9ff59fd` |
| H2-partial: rate-limit eviction bug | ✅ done-by-prior-agent | src/shared/http.ts | pruneRateLimits fixed | tests/gateway/server-rate-limit-eviction.test.ts (2) | `9ff59fd` |
| **C4**: no recordUsage on Anthropic passthrough | ✅ | src/upstream-forward.ts, router.ts | `forwardAnthropicMessages` returns `AnthropicUsage`; SSE tee-scan (`scanAnthropicSseUsage`) awaits full stream; JSON path parses usage; router records at the new 5th site | tests/gateway/server-passthrough-usage.test.ts (2) | `31b3383` |
| **H2-final**: rate limit keyed on x-api-key (rotatable) | ✅ | router.ts ~157 | Keyed on `req.socket.remoteAddress` only | existing limiter tests | `636f129` |
| **C5**: no token budgets/spend caps anywhere | ✅ | NEW src/gateway/server/budget.ts, storage/config.ts (`getServerBudget`), types/config.ts (`server.budget`), router.ts (both handlers) | `BudgetTracker` with UTC day/month keys, persistence to `<home>/budget-state.json`, corrupt-file reset; 429 `budget_exceeded` when over cap; wired at every recordUsage site | tests/gateway/budget.test.ts (11): exceeded-day, day/month rollover, restart persistence, disabled-default, corrupt state | `7a8cb52` |
| **H3**: no upstream timeouts; client disconnects leak sockets | ✅ | upstream-forward.ts, config/constants.ts (`REQUEST_TIMEOUT_MS=600_000`), cloud-code-gateway.ts (~527) | AbortController on res close/error + timeout via Node<20-safe signal merge; abort → 504 Anthropic-style error if headers unsent, else destroy; antigravity fetch gets 30s header timeout | covered by gateway suite (304 green) | `5d15cfb` |
| **H4**: provider-health dead code; no retry/failover | ✅ | NEW src/gateway/server/upstream-resilience.ts, router.ts (both SDK branches) | Breaker: 2 consecutive 429/5xx → provider unhealthy 60s → non-streaming requests fail fast 502; success clears. Non-streaming retry ≤2 with exponential backoff before first byte. Feeds services/provider-health.ts (dead code now live) | tests/gateway/upstream-resilience.test.ts (14) | `ebe0735` |
| **H5**: silent alias fallback + silent tool truncation | ✅ | anthropic-proxy.ts, router.ts | Both surface `anthropic-warning` response header AND leading SSE comment frame (`: warning\n\n`) on streams; JSON paths get the header | existing proxy/router suites green | `1b7fd27` |
| **H6**: stale vitest 2.x; no dep-audit CI gate | ⚠️ partial | .github/workflows/ci.yml | Added `npm audit --omit=dev --audit-level=high` step (`continue-on-error` until baseline clean). vitest 4.x bump attempted → 47 files/67 tests broke under vitest 4 API changes → reverted; needs a dedicated migration PR | n/a (suite must stay green) | `da3d071` |

## Notes
- The usage-attribution source-scanning test was updated 4→5 recordUsage sites when C4 legitimately added the fifth.
- `isRetryableUpstreamError` intentionally does NOT reuse `upstreamHttpStatus()` (it defaults unknown errors to 500, which would make auth failures look retryable).
- Nothing pushed; all work is local commits on `main`.
- Follow-ups (not blocking v1 contract freeze): vitest 4 migration, UI budget page (V1_ROADMAP), per-key budgets.
