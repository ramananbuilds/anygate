import { describe, expect, it } from 'vitest';
import { EventEmitter } from 'node:events';
import { gzipSync, zstdCompressSync, deflateSync, brotliCompressSync } from 'node:zlib';
import type { IncomingMessage } from 'node:http';
import {
  readBody,
  pruneRateLimits,
  RequestBodyTooLargeError,
} from '../../src/shared/http.js';
import { MAX_REQUEST_BODY_BYTES } from '../../src/config/constants.js';

function mockRequest(body: Buffer, headers: Record<string, string> = {}): IncomingMessage {
  const req = new EventEmitter() as unknown as IncomingMessage;
  (req as unknown as { headers: Record<string, string> }).headers = headers;
  queueMicrotask(() => {
    req.emit('data', body);
    req.emit('end');
  });
  return req;
}

describe('readBody content-encoding decoding', () => {
  const payload = JSON.stringify({ model: 'gpt-4o', input: 'hello' });

  it('returns plain bodies unchanged', async () => {
    const out = await readBody(mockRequest(Buffer.from(payload)));
    expect(JSON.parse(out)).toEqual({ model: 'gpt-4o', input: 'hello' });
  });

  it('decompresses zstd request bodies (Codex Desktop openai provider)', async () => {
    const out = await readBody(mockRequest(zstdCompressSync(Buffer.from(payload)), { 'content-encoding': 'zstd' }));
    expect(JSON.parse(out)).toEqual({ model: 'gpt-4o', input: 'hello' });
  });

  it('decompresses gzip request bodies', async () => {
    const out = await readBody(mockRequest(gzipSync(Buffer.from(payload)), { 'content-encoding': 'gzip' }));
    expect(JSON.parse(out)).toEqual({ model: 'gpt-4o', input: 'hello' });
  });

  it('treats identity encoding as plain text', async () => {
    const out = await readBody(mockRequest(Buffer.from(payload), { 'content-encoding': 'identity' }));
    expect(JSON.parse(out)).toEqual({ model: 'gpt-4o', input: 'hello' });
  });

  it('decodes deflate and brotli request bodies', async () => {
    const deflated = await readBody(mockRequest(deflateSync(Buffer.from(payload)), { 'content-encoding': 'deflate' }));
    expect(JSON.parse(deflated)).toEqual(JSON.parse(payload));

    const brotli = await readBody(mockRequest(brotliCompressSync(Buffer.from(payload)), { 'content-encoding': 'br' }));
    expect(JSON.parse(brotli)).toEqual(JSON.parse(payload));
  });
});

describe('readBody decompression bomb protection', () => {
  // ~64 KB of zeros compresses to a few hundred bytes but expands to 10+ MB.
  const bombPayload = Buffer.alloc(12 * 1024 * 1024, 0);

  it('rejects gzip bodies whose DECOMPRESSED size exceeds the cap', async () => {
    await expect(
      readBody(mockRequest(gzipSync(bombPayload), { 'content-encoding': 'gzip' }))
    ).rejects.toThrow(RequestBodyTooLargeError);
  });

  it('rejects zstd bodies whose DECOMPRESSED size exceeds the cap', async () => {
    await expect(
      readBody(mockRequest(zstdCompressSync(bombPayload), { 'content-encoding': 'zstd' }))
    ).rejects.toThrow(RequestBodyTooLargeError);
  });

  it('still accepts compressed bodies that expand to just under the cap', async () => {
    const big = JSON.stringify({ input: 'x'.repeat(512 * 1024) }); // well under the 10 MB cap
    const out = await readBody(mockRequest(gzipSync(Buffer.from(big)), { 'content-encoding': 'gzip' }));
    expect(out.length).toBe(big.length);
  });

  it('aborts raw bodies larger than MAX_REQUEST_BODY_BYTES during streaming', async () => {
    const oversized = Buffer.alloc(MAX_REQUEST_BODY_BYTES + 1);
    let destroyed = false;
    const req = new EventEmitter() as unknown as IncomingMessage;
    (req as unknown as { headers: Record<string, string> }).headers = {};
    (req as unknown as { destroy: () => void }).destroy = () => {
      destroyed = true;
    };
    queueMicrotask(() => {
      req.emit('data', oversized);
    });

    await expect(readBody(req)).rejects.toThrow(RequestBodyTooLargeError);
    expect(destroyed).toBe(true);
  });
});
