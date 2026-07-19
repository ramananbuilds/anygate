// Trim an Anthropic-format conversation to fit a model's context window.
//
// When a claude-app (or any SDK-routed) session grows past the upstream model's
// context window, the request would otherwise be rejected (and, historically,
// silently produce an empty stream). This helper drops the *oldest* messages
// while preserving:
//   - the system prompt (never trimmed)
//   - the most recent messages, so the model still has recent context
//   - tool_use / tool_result pairs intact (dropping one half of a pair breaks
//     the SDK tool loop and upstream validation)
//
// The estimate is intentionally conservative (chars / 4 ~= tokens) so we never
// *under*-trim. This mirrors how every long-session client behaves — Antigravity
// "keeps going" only because it routes to Gemini's 1M–2M window; for small
// free models (Nemotron 131K, etc.) trimming is the only way to keep going.

import type { AnthropicMsg, AnthropicBlock } from './sdk-adapter.js';

const CHARS_PER_TOKEN = 4;
const RESERVE_TOKENS = 256; // breathing room for request framing / overhead

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function messageTokens(msg: AnthropicMsg): number {
  if (typeof msg.content === 'string') return estimateTokens(msg.content);
  let total = 0;
  for (const block of msg.content as AnthropicBlock[]) {
    if (typeof block.text === 'string') {
      total += estimateTokens(block.text);
    }
    if (block.source?.data) {
      // base64 image — rough overhead; images are large, so count a floor.
      total += Math.max(512, estimateTokens(block.source.data));
    }
    if (typeof block.input === 'object' && block.input !== null) {
      try {
        total += estimateTokens(JSON.stringify(block.input));
      } catch {
        /* ignore */
      }
    }
  }
  return total;
}

/** Total estimated tokens for an already-trimmed system + message set. Exported for callers that clamp max output. */
export function estimateContextTokens(system: string | undefined, messages: AnthropicMsg[]): number {
  let total = estimateTokens(system ?? '');
  for (const msg of messages) total += messageTokens(msg);
  return total;
}

export interface FitContextResult {
  system: string | undefined;
  messages: AnthropicMsg[];
  /** true if any messages were dropped to fit. */
  trimmed: boolean;
  /** number of messages removed from the front. */
  dropped: number;
}

/**
 * Trim `messages` (keeping `system` always) so that
 * systemTokens + keptMessageTokens + maxOutputTokens + reserve <= contextWindow.
 *
 * `system` is passed separately because callers fold inline role:'system'
 * messages into it before calling. We preserve the most recent messages and
 * never split a tool_use/tool_result pair.
 */
export function fitContextWindow(
  messages: AnthropicMsg[],
  system: string | undefined,
  contextWindow: number,
  maxOutputTokens: number,
): FitContextResult {
  const systemTokens = estimateTokens(system ?? '');
  const budget = contextWindow - maxOutputTokens - RESERVE_TOKENS;
  if (budget <= 0) {
    // Window is too small to fit output alone — return everything and let the
    // upstream produce its own (visible) error rather than silently dropping all.
    return { system, messages, trimmed: false, dropped: 0 };
  }
  const usable = budget - systemTokens;
  if (usable <= 0) {
    return { system, messages, trimmed: false, dropped: 0 };
  }

  // Work from the back: keep the newest messages that fit.
  const kept: AnthropicMsg[] = [];
  let used = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]!;
    const cost = messageTokens(msg);
    if (used + cost > usable && kept.length > 0) break;
    kept.unshift(msg);
    used += cost;
  }

  const toolUseIds = new Set<string>();
  const toolResultIds = new Set<string>();
  for (const msg of kept) {
    if (!Array.isArray(msg.content)) continue;
    for (const b of msg.content as AnthropicBlock[]) {
      if (b.type === 'tool_use' && b.id) toolUseIds.add(b.id);
      if (b.type === 'tool_result' && b.tool_use_id) toolResultIds.add(b.tool_use_id);
    }
  }
  // If a tool_result references a dropped tool_use, the orphan result must go too.
  const orphanResult = kept.filter(msg => {
    if (!Array.isArray(msg.content)) return false;
    return (msg.content as AnthropicBlock[]).some(b => b.type === 'tool_result' && b.tool_use_id && !toolUseIds.has(b.tool_use_id));
  });
  // If a tool_use references a dropped tool_result, the orphan use must go too.
  const orphanUse = kept.filter(msg => {
    if (!Array.isArray(msg.content)) return false;
    return (msg.content as AnthropicBlock[]).some(b => b.type === 'tool_use' && b.id && !toolResultIds.has(b.id));
  });

  let trimmedMessages = kept;
  if (orphanResult.length || orphanUse.length) {
    const dropIds = new Set<string>();
    for (const msg of [...orphanResult, ...orphanUse]) {
      for (const b of msg.content as Array<{ id?: string; tool_use_id?: string }>) {
        if (b.id) dropIds.add(b.id);
        if (b.tool_use_id) dropIds.add(b.tool_use_id);
      }
    }
    trimmedMessages = trimmedMessages.filter(msg =>
      !msg.content || !Array.isArray(msg.content) ||
      !(msg.content as AnthropicBlock[]).some(b => (b.id && dropIds.has(b.id)) || (b.tool_use_id && dropIds.has(b.tool_use_id))),
    );
  }

  const dropped = messages.length - trimmedMessages.length;
  return {
    system,
    messages: trimmedMessages,
    trimmed: dropped > 0,
    dropped,
  };
}
