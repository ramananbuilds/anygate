import { describe, it, expect } from 'vitest';

import {
  collectCloudCodeToAnthropic,
  streamCloudCodeToAnthropic,
  type CloudCodeUsage,
} from '../src/gateway/antigravity/cloudcode-to-anthropic.js';

// Minimal fake Response that exposes a text body (unary path).
function fakeTextResponse(body: string): Response {
  return new Response(body) as Response;
}

// Minimal fake Response that streams SSE lines (streaming path).
function fakeStreamResponse(lines: string[]): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line + '\n'));
      }
      controller.close();
    },
  });
  return new Response(stream) as Response;
}

describe('cloudcode-to-anthropic usage extraction', () => {
  it('collectCloudCodeToAnthropic returns usageMetadata token counts', async () => {
    const sse =
      'data: {"response":{"candidates":[{"content":{"parts":[{"text":"hi"}]},' +
      '"finishReason":"STOP"}],"usageMetadata":{"promptTokenCount":12,"candidatesTokenCount":7,"totalTokenCount":19}}}\n\n';
    const res = await collectCloudCodeToAnthropic(fakeTextResponse(sse), 'gemini-flash', () => {});
    const usage = res as unknown as CloudCodeUsage;
    expect(usage.inputTokens).toBe(12);
    expect(usage.outputTokens).toBe(7);
    expect((res.usage as { input_tokens: number; output_tokens: number }).input_tokens).toBe(12);
  });

  it('streamCloudCodeToAnthropic returns usage from the final SSE chunk', async () => {
    const lines = [
      'data: {"response":{"candidates":[{"content":{"parts":[{"text":"hello"}]}}]}}',
      'data: {"response":{"candidates":[{"content":{"parts":[]},"finishReason":"STOP"}],"usageMetadata":{"promptTokenCount":40,"candidatesTokenCount":25,"totalTokenCount":65}}}',
    ];
    // Capture written SSE so we don't rely on a real socket.
    let written = '';
    const fakeRes = {
      writeHead() {},
      write(chunk: string) { written += chunk; return true; },
      end() {},
    } as unknown as import('node:http').ServerResponse;

    const usage = await streamCloudCodeToAnthropic(fakeRes, fakeStreamResponse(lines), 'gemini-flash', () => {});
    expect(usage.inputTokens).toBe(40);
    expect(usage.outputTokens).toBe(25);
    // The client SSE must still carry the output token count in message_delta.
    expect(written).toContain('"output_tokens":25');
  });
});
