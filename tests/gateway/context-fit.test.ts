import { describe, it, expect } from 'vitest';
import {
  fitContextWindow,
  estimateContextTokens,
} from '../../src/gateway/context/context-fit.js';
import {
  resolveContextWindowFromModel,
  translateRequest,
} from '../../src/gateway/adapters/sdk-adapter.js';
import type { AnthropicMsg } from '../../src/gateway/adapters/sdk-adapter.js';

// 1 char ~=1/4 token, so ~400 chars ~= 100 tokens. Keep window tight in tests.

function msg(role: 'user' | 'assistant' | 'system', text: string): AnthropicMsg {
  return { role, content: text };
}

describe('fitContextWindow', () => {
  it('is a no-op when the conversation already fits', () => {
    const messages = [msg('user', 'hello'), msg('assistant', 'hi')];
    const out = fitContextWindow(messages, 'sys', 200_000, 1024);
    expect(out.trimmed).toBe(false);
    expect(out.dropped).toBe(0);
    expect(out.messages).toHaveLength(2);
  });

  it('drops oldest messages first to fit the window', () => {
    // 5 user/assistant pairs, each ~100 tokens (400 chars). Window allows ~2.
    const messages: AnthropicMsg[] = [];
    for (let i = 0; i < 5; i++) {
      messages.push(msg('user', 'x'.repeat(400) + ` q${i}`));
      messages.push(msg('assistant', 'y'.repeat(400) + ` a${i}`));
    }
    const out = fitContextWindow(messages, 'sys', 1000, 0);
    expect(out.trimmed).toBe(true);
    expect(out.dropped).toBeGreaterThan(0);
    // Most recent messages must survive.
    const last = out.messages[out.messages.length - 1] as { content: string };
    expect(last.content).toContain('a4');
    // System prompt is never trimmed.
    expect(out.system).toBe('sys');
  });

  it('keeps tool_use / tool_result pairs intact', () => {
    const messages: AnthropicMsg[] = [
      { role: 'user', content: 'x'.repeat(400) + ' first' },
      { role: 'assistant', content: [{ type: 'tool_use', id: 'call_1', name: 'Read', input: { path: 'a' } }] },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'call_1', content: 'file body' }] },
      { role: 'assistant', content: 'y'.repeat(400) + ' last' },
    ];
    const out = fitContextWindow(messages, 'sys', 1000, 0);
    // If the oldest message was dropped, both halves of the tool pair must be gone.
    const hasUse = out.messages.some(m =>
      Array.isArray(m.content) && m.content.some(b => (b as { type?: string }).type === 'tool_use'));
    const hasResult = out.messages.some(m =>
      Array.isArray(m.content) && m.content.some(b => (b as { type?: string }).type === 'tool_result'));
    expect(hasUse).toBe(hasResult);
  });

  it('does not trim when maxOutputTokens leaves no room for input', () => {
    const messages = [msg('user', 'x'.repeat(400)), msg('assistant', 'y'.repeat(400))];
    // Window = 600 (~150 tokens), maxOutput = 1000 → no room at all.
    const out = fitContextWindow(messages, 'sys', 600, 1000);
    expect(out.trimmed).toBe(false);
    expect(out.dropped).toBe(0);
  });
});

describe('estimateContextTokens', () => {
  it('sums system + messages by chars/4', () => {
    const messages = [msg('user', 'x'.repeat(400)), msg('assistant', 'y'.repeat(800))];
    // system 400 chars (100) + 400 (100) + 800 (200) = 400
    expect(estimateContextTokens('x'.repeat(400), messages)).toBe(400);
  });
});

// ── 85% safety margin ──────────────────────────────────────────────────────

describe('fitContextWindow — 85% safety margin', () => {
  it('trims when input exceeds 85% of the window (but fits without the margin)', () => {
    // 7 messages of ~100 tokens each = ~700 tokens total.
    // Without the 85% margin: usable ≈ 743 (1000 - 256 - 1) → all fit, no trim.
    // With the 85% margin: usable ≈ 593 (850 - 256 - 1) → trimming kicks in.
    const messages: AnthropicMsg[] = [];
    for (let i = 0; i < 7; i++) {
      messages.push(msg('user', 'x'.repeat(400) + ` msg${i}`));
    }
    const out = fitContextWindow(messages, 'sys', 1000, 0);
    expect(out.trimmed).toBe(true);
    expect(out.dropped).toBeGreaterThan(0);
  });

  it('does not trim when input is within 85% of the window', () => {
    // 4 messages of ~100 tokens = ~400 tokens.
    // 85% margin: usable ≈ 593 → 400 ≤ 593, no trim.
    const messages: AnthropicMsg[] = [];
    for (let i = 0; i < 4; i++) {
      messages.push(msg('user', 'x'.repeat(400) + ` msg${i}`));
    }
    const out = fitContextWindow(messages, 'sys', 1000, 0);
    expect(out.trimmed).toBe(false);
    expect(out.dropped).toBe(0);
  });

  it('applies 85% margin so input at 90% of window gets trimmed', () => {
    // 9 messages of ~100 tokens = ~900 tokens.
    // Window = 1000 → 90% utilization. With 85% margin (safeWindow=850), this should trim.
    // Without margin: usable = 1000 - 256 - 0 = 744 → 900 > 744, would also trim.
    // But let's test with a larger window where 90% fits without margin but not with it.
    // Window = 2000 → 90% = 1800. Without margin: usable = 2000 - 256 = 1744 → 1800 > 1744, trims.
    // With margin: safeWindow = 1700, usable = 1700 - 256 = 1444 → 1800 > 1444, trims more.
    // Let's use a case where 85% margin matters:
    // 17 messages of ~100 tokens = ~1700 tokens. Window = 2000.
    // Without margin: usable = 2000 - 256 = 1744 → 1700 ≤ 1744, NO trim.
    // With margin: safeWindow = 1700, usable = 1700 - 256 = 1444 → 1700 > 1444, TRIM.
    const messages: AnthropicMsg[] = [];
    for (let i = 0; i < 17; i++) {
      messages.push(msg('user', 'x'.repeat(400) + ` m${i}`));
    }
    const out = fitContextWindow(messages, 'sys', 2000, 0);
    expect(out.trimmed).toBe(true);
    expect(out.dropped).toBeGreaterThan(0);
  });
});

// ── resolveContextWindowFromModel ───────────────────────────────────────────

describe('resolveContextWindowFromModel', () => {
  it('returns a positive context window for known model ids', () => {
    // GPT-OSS heuristic → 131 072
    expect(resolveContextWindowFromModel('gpt-oss-120b')).toBe(131_072);
    // GPT-4 heuristic → 128 000
    expect(resolveContextWindowFromModel('gpt-4-turbo')).toBe(128_000);
    // Gemini-1.5-flash heuristic → 1 000 000 (gemini-1.5-pro is 2M via a more specific rule)
    expect(resolveContextWindowFromModel('gemini-1.5-flash')).toBe(1_000_000);
    // Claude-3 heuristic → 200 000
    expect(resolveContextWindowFromModel('claude-3-opus-20240229')).toBe(200_000);
  });

  it('returns the default 200k window for unknown model ids', () => {
    expect(resolveContextWindowFromModel('totally-unknown-model-xyz')).toBe(200_000);
  });

  it('uses provider default for unknown model from known provider', () => {
    // 'totally-unknown-model-xyz' has no heuristic, but poolside provider default is 262_112.
    expect(resolveContextWindowFromModel('totally-unknown-model-xyz', 'poolside')).toBe(262_112);
    expect(resolveContextWindowFromModel('totally-unknown-model-xyz', 'google')).toBe(1_000_000);
    expect(resolveContextWindowFromModel('totally-unknown-model-xyz', 'openai')).toBe(128_000);
  });

  it('resolves poolside/laguna-s-2.1 from models.dev cache', () => {
    // The bundled models.dev cache contains poolside models with context windows.
    // poolside/laguna-s-2.1 has context 1_048_576 in the cache.
    const result = resolveContextWindowFromModel('poolside/laguna-s-2.1');
    expect(result).toBeGreaterThan(0);
    expect(result).toBe(1_048_576);
  });

  it('gpt-oss models resolve to 131072 via heuristic', () => {
    expect(resolveContextWindowFromModel('gpt-oss-120b')).toBe(131_072);
    expect(resolveContextWindowFromModel('gpt-oss-20b')).toBe(131_072);
  });
});

// ── integration: translateRequest → fitContextWindow ─────────────────────────

describe('translateRequest — context fitting integration', () => {
  it('trims messages to fit an explicit contextWindow with the 85% margin', () => {
    const big = 'x'.repeat(400) + ' ';
    const messages = [
      { role: 'user' as const, content: big + 'old1' },
      { role: 'assistant' as const, content: big + 'old2' },
      { role: 'user' as const, content: big + 'mid' },
      { role: 'assistant' as const, content: big + 'recent' },
    ];
    const params = translateRequest({
      model: 'nemotron-free',
      system: 'system prompt',
      messages,
      max_tokens: 4000,
    }, '@ai-sdk/google', { contextWindow: 1000 });
    // Most recent message survives; oldest dropped.
    expect((params.messages.at(-1) as any).content[0].text).toContain('recent');
    // maxOutputTokens clamped to fit the (small) window after input.
    expect(typeof params.maxOutputTokens === 'number').toBe(true);
    if (typeof params.maxOutputTokens === 'number') {
      expect(params.maxOutputTokens).toBeLessThanOrEqual(4000);
    }
  });

  it('falls back to model lookup when contextWindow is not passed', () => {
    // gpt-oss-120b → 131 072 context window via heuristics.
    // A tiny message should not be trimmed, but fitting must still run.
    const params = translateRequest({
      model: 'gpt-oss-120b',
      system: 'be brief',
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 256,
    }, '@ai-sdk/google');
    expect(params.system).toBe('be brief');
    expect(params.messages).toHaveLength(1);
    expect(params.maxOutputTokens).toBe(256);
  });

  it('uses explicit contextWindow over model lookup', () => {
    // Pass a tiny window explicitly — should trim even though the model
    // (gpt-oss-120b) has a 131k window. Use max_tokens=0 so the budget
    // (850 - 0 - 256 = 594) is positive and trimming can actually occur.
    const big = 'x'.repeat(400) + ' ';
    const messages: AnthropicMsg[] = [];
    for (let i = 0; i < 7; i++) {
      messages.push({ role: 'user', content: big + `msg${i}` });
    }
    const params = translateRequest({
      model: 'gpt-oss-120b',
      system: 'sys',
      messages,
      max_tokens: 0,
    }, '@ai-sdk/google', { contextWindow: 1000 });
    // With contextWindow=1000 (safeWindow=850, usable≈593), 7 messages (~700 tokens)
    // should be trimmed. Without the explicit window (131k), no trimming would occur.
    expect(params.messages.length).toBeLessThan(7);
    expect((params.messages.at(-1) as any).content[0].text).toContain('msg6');
  });
});
