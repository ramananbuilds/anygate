import { describe, it, expect } from 'vitest';
import {
  resolveContextWindow,
  contextWindowFromHeuristics,
  buildContextWindowIndex,
  lookupContextWindow,
  DEFAULT_CONTEXT_WINDOW,
  PROVIDER_DEFAULTS,
} from '../../src/apps/shared/context-window.js';

describe('contextWindowFromHeuristics', () => {
  it.each([
    ['gemini-3.5-flash', 1_000_000],
    ['gemini-2.5-pro', 2_000_000],
    ['claude-sonnet-4-6', 1_000_000],
    ['claude-opus-4-6', 1_000_000],
    ['claude-haiku-4-5', 200_000],
    ['claude-3-5-sonnet', 200_000],
    ['deepseek-v4-flash', 1_000_000],
    ['deepseek-chat', 64_000],
    ['gpt-5.4', 1_000_000],
    ['gpt-4o-mini', 128_000],
    ['qwen3.6-plus-free', 262_144],
    ['kimi-k2.6', 262_144],
    ['minimax-m2.7', 204_800],
    ['mistral-large', 262_144],
    ['llama-3.3-70b', 131_072],
    ['grok-4.20-0309-reasoning', 1_000_000],
    ['grok-4.5', 500_000],
    ['grok-4.5-latest', 500_000],
    ['grok-4', 131_072],
    ['grok-3-mini', 131_072],
    ['solar-mini', 32_768],
    ['totally-unknown-model-xyz', DEFAULT_CONTEXT_WINDOW],
  ])('%s → %i', (id, expected) => {
    expect(contextWindowFromHeuristics(id)).toBe(expected);
  });
});

describe('buildContextWindowIndex', () => {
  it('prefers opencode provider entries over other providers', () => {
    const index = buildContextWindowIndex({
      'github-copilot': { models: { 'claude-sonnet-4-6': { limit: { context: 200_000 } } } },
      opencode: { models: { 'claude-sonnet-4-6': { limit: { context: 1_000_000 } } } },
    });
    expect(index.get('claude-sonnet-4-6')).toBe(1_000_000);
  });

  it('uses max across providers when opencode keys are absent', () => {
    const index = buildContextWindowIndex({
      frogbot: { models: { 'gemini-2.5-flash': { limit: { context: 200_000 } } } },
      google: { models: { 'gemini-2.5-flash': { limit: { context: 1_048_576 } } } },
    });
    expect(index.get('gemini-2.5-flash')).toBe(1_048_576);
  });

  it('ignores entries without limit.context', () => {
    const index = buildContextWindowIndex({
      opencode: { models: { 'no-limit-model': { limit: {} } } },
    });
    expect(index.has('no-limit-model')).toBe(false);
  });
});

describe('resolveContextWindow', () => {
  it('falls back to heuristics for unknown models not in cache', () => {
    expect(resolveContextWindow('zzzz-nonexistent-model-id-99999')).toBe(DEFAULT_CONTEXT_WINDOW);
  });

  it('uses cache index values when present in fixture', () => {
    const index = buildContextWindowIndex({
      opencode: { models: { 'gemini-3.5-flash': { limit: { context: 1_048_576 } } } },
    });
    expect(index.get('gemini-3.5-flash')).toBe(1_048_576);
  });
});

// ── Provider-level defaults ────────────────────────────────────────────────────

describe('PROVIDER_DEFAULTS', () => {
  it('contains defaults for major providers', () => {
    expect(PROVIDER_DEFAULTS.poolside).toBe(262_112);
    expect(PROVIDER_DEFAULTS.google).toBe(1_000_000);
    expect(PROVIDER_DEFAULTS.openai).toBe(128_000);
    expect(PROVIDER_DEFAULTS.anthropic).toBe(200_000);
    expect(PROVIDER_DEFAULTS.nvidia).toBe(131_072);
    expect(PROVIDER_DEFAULTS.groq).toBe(131_072);
  });
});

describe('lookupContextWindow — provider defaults', () => {
  it('uses provider default when no heuristic or cache matches', () => {
    // 'totally-unknown-model-xyz' has no heuristic match, so with a providerId
    // it should fall back to the provider default instead of DEFAULT_CONTEXT_WINDOW.
    expect(lookupContextWindow('totally-unknown-model-xyz', 'poolside')).toBe(262_112);
    expect(lookupContextWindow('totally-unknown-model-xyz', 'google')).toBe(1_000_000);
    expect(lookupContextWindow('totally-unknown-model-xyz', 'openai')).toBe(128_000);
  });

  it('still returns DEFAULT_CONTEXT_WINDOW when no providerId is given', () => {
    expect(lookupContextWindow('totally-unknown-model-xyz')).toBe(DEFAULT_CONTEXT_WINDOW);
  });

  it('heuristic takes priority over provider default', () => {
    // gpt-oss-120b has a heuristic of 131_072, which should win over any provider default.
    expect(lookupContextWindow('gpt-oss-120b', 'poolside')).toBe(131_072);
    expect(lookupContextWindow('gpt-oss-120b', 'openai')).toBe(131_072);
  });

  it('models.dev cache takes priority over heuristic and provider default', () => {
    // The bundled models.dev cache contains 'poolside/laguna-s-2.1' with context 1_048_576.
    // This should be returned regardless of providerId.
    const result = lookupContextWindow('poolside/laguna-s-2.1', 'poolside');
    expect(result).toBe(1_048_576);
  });
});

describe('resolveContextWindow — providerId passthrough', () => {
  it('uses explicit value when provided', () => {
    expect(resolveContextWindow('model-x', 50_000, 'poolside')).toBe(50_000);
  });

  it('falls back to provider default when explicit is not a positive number', () => {
    expect(resolveContextWindow('model-x', undefined, 'poolside')).toBe(262_112);
    expect(resolveContextWindow('model-x', 0, 'poolside')).toBe(262_112);
    expect(resolveContextWindow('model-x', -1, 'poolside')).toBe(262_112);
  });

  it('falls back to DEFAULT_CONTEXT_WINDOW when no providerId and no match', () => {
    expect(resolveContextWindow('model-x', undefined, undefined)).toBe(DEFAULT_CONTEXT_WINDOW);
  });
});
