import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, pruneRateLimits } from '../../src/shared/http.js';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../../src/config/constants.js';

describe('rate limiter stale-entry eviction', () => {
  beforeEach(() => {
    pruneRateLimits(Date.now() + 10 * RATE_LIMIT_WINDOW_MS);
  });

  afterEach(() => {
    // Leave the store empty so other suites start from a clean slate.
    pruneRateLimits(Date.now() + 10 * RATE_LIMIT_WINDOW_MS);
  });

  it('drops entries older than 2x the window when pruning', () => {
    checkRateLimit('evict-stale-client');

    const now = Date.now();
    const fresh = pruneRateLimits(now + 1.5 * RATE_LIMIT_WINDOW_MS); // still inside 2x window
    expect(fresh).toBe(0);

    // Stale threshold: resetAt (now + window) must be older than prune-time - 2x window,
    // i.e. the entry only becomes prunable once 3 full windows have elapsed.
    const pruned = pruneRateLimits(now + 3 * RATE_LIMIT_WINDOW_MS + RATE_LIMIT_WINDOW_MS / 2);
    expect(pruned).toBeGreaterThanOrEqual(1);
  });

  it('keeps active clients rate-limit state across a prune that only removes stale entries', () => {
    const clientId = 'evict-active-client';
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(clientId);
    }
    expect(checkRateLimit(clientId).allowed).toBe(false);

    // Prune "now" — the client's window has not expired, so it must survive.
    pruneRateLimits();
    expect(checkRateLimit(clientId).allowed).toBe(false);
  });
});
