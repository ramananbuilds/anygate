import { describe, it, expect } from 'vitest';
import {
  safeJsonParse,
  upstreamHttpStatus,
  sendError,
  AnygateError,
  CredentialUnavailableError,
  ModelNotFoundError,
} from '../src/core/errors.js';
import { redactTraceLine, redactTraceLog } from '../src/core/redact.js';

describe('safeJsonParse', () => {
  it('returns parsed object on valid JSON', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
  });

  it('returns typed fallback on invalid JSON', () => {
    expect(safeJsonParse('not json')).toBeNull();
    expect(safeJsonParse('not json', { a: 1 })).toEqual({ a: 1 });
  });

  it('returns fallback for empty / null / undefined input', () => {
    expect(safeJsonParse('')).toBeNull();
    expect(safeJsonParse(null)).toBeNull();
    expect(safeJsonParse(undefined)).toBeNull();
    expect(safeJsonParse('   ')).toBeNull();
  });

  it('does not throw on malformed JSON', () => {
    expect(() => safeJsonParse('{bad')).not.toThrow();
  });
});

describe('upstreamHttpStatus (no message sniffing)', () => {
  it('reads a known status code off the error object', () => {
    expect(upstreamHttpStatus({ statusCode: 400 })).toBe(400);
    expect(upstreamHttpStatus({ statusCode: 401 })).toBe(401);
    expect(upstreamHttpStatus({ statusCode: 403 })).toBe(403);
    expect(upstreamHttpStatus({ statusCode: 404 })).toBe(404);
    expect(upstreamHttpStatus({ statusCode: 429 })).toBe(429);
  });

  it('reads httpStatus off an AnygateError subclass', () => {
    expect(upstreamHttpStatus(new CredentialUnavailableError('p'))).toBe(401);
    expect(upstreamHttpStatus(new ModelNotFoundError('m'))).toBe(404);
  });

  it('does NOT sniff the error message for a status', () => {
    expect(upstreamHttpStatus({ message: 'Provider returned HTTP 429.' })).toBe(500);
    expect(upstreamHttpStatus({ message: 'HTTP 400 bad request' })).toBe(500);
  });

  it('defaults to 500 for unrecognized / out-of-range codes', () => {
    expect(upstreamHttpStatus({ statusCode: 418 })).toBe(500);
    expect(upstreamHttpStatus(null)).toBe(500);
    expect(upstreamHttpStatus(undefined)).toBe(500);
    expect(upstreamHttpStatus('string error')).toBe(500);
  });
});

describe('redactTraceLine / redactTraceLog', () => {
  it('redacts bearer tokens', () => {
    const out = redactTraceLine('Authorization: Bearer eyJsecretvalue');
    expect(out).toContain('[REDACTED]');
    expect(out).not.toContain('eyJsecretvalue');
  });

  it('redacts sk- prefixed keys', () => {
    expect(redactTraceLine('key=sk-abc1234567890')).toBe('key=sk-[REDACTED]');
  });

  it('redacts ai-za / gsk keys', () => {
    expect(redactTraceLine('AIza12345678901234567890x')).toBe('AIza[REDACTED]');
    expect(redactTraceLine('gsk_abcdefghijklmnopqrstuvwx')).toBe('gsk_[REDACTED]');
  });

  it('redacts a full multi-line log', () => {
    const log = redactTraceLog('Bearer sk-line123456789012345\nplain line\nx-api-key: "sk-abc1234567890"');
    expect(log).not.toContain('sk-line123456789012345');
    expect(log).not.toContain('sk-abc1237890');
  });

  it('leaves non-secret lines untouched', () => {
    expect(redactTraceLine('model=claude-opus-4 status=200')).toBe('model=claude-opus-4 status=200');
  });
});

describe('sendError', () => {
  it('writes an Anthropic-style error body with the error status', () => {
    const res: any = {
      headersSent: false,
      statusCode: 0,
      body: undefined as unknown,
      setHeader() {},
      writeHead(status: number) { this.statusCode = status; },
      write(data: string) {
        this.body = (this.body as string) ?? '' + data;
      },
      end(data?: string) {
        if (data !== undefined) this.body = data;
      },
    };
    sendError(res, new CredentialUnavailableError('acme'));
    expect(res.statusCode).toBe(401);
    const parsed = JSON.parse(res.body as string);
    expect(parsed.error.type).toBe('authentication_error');
    expect(parsed.error.message).toContain('acme');
  });

  it('writes a streaming error when headers are already sent', () => {
    const res: any = {
      headersSent: true,
      sent: '' as string,
      write(data: string) {
        this.sent += data;
      },
      end() {
        this.ended = true;
      },
      ended: false,
    };
    sendError(res, new ModelNotFoundError('gpt-9'));
    expect(res.sent).toContain('"type":"error"');
    expect(res.sent).toContain('not_found_error');
    expect(res.ended).toBe(true);
  });
});

describe('AnygateError base class', () => {
  it('carries httpStatus, retryable, userMessage', () => {
    const err = new AnygateError({ httpStatus: 429, retryable: true, userMessage: 'slow down' });
    expect(err.httpStatus).toBe(429);
    expect(err.retryable).toBe(true);
    expect(err.userMessage).toBe('slow down');
    expect(err).toBeInstanceOf(Error);
  });
});
