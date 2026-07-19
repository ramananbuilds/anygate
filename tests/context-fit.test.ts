import { describe, it, expect } from 'vitest';
import {
  fitContextWindow,
  estimateContextTokens,
} from '../src/gateway/context-fit.js';
import type { AnthropicMsg } from '../src/gateway/sdk-adapter.js';

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
