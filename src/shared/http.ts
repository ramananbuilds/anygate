// Shared HTTP helpers for local proxy servers.
import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'
import * as zlib from 'node:zlib'
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUEST_BODY_BYTES,
} from '../config/constants.js'

/** Error thrown when a request body (raw or decompressed) exceeds the configured cap. */
export class RequestBodyTooLargeError extends Error {
  constructor(context: string) {
    super(`Request body too large (${context}, limit ${MAX_REQUEST_BODY_BYTES} bytes)`)
    this.name = 'RequestBodyTooLargeError'
  }
}

/**
 * Decode one chunk through a bounded streaming decompressor. The transform
 * emits `output` chunks; the caller counts every emitted byte and tears the
 * stream down as soon as the running total crosses `maxBytes`, so a small
 * compressed body cannot expand into gigabytes in memory (decompression bomb).
 */
function decodeBoundedChunk(
  createTransform: () => import('node:stream').Transform,
  chunk: Buffer,
  maxBytes: number
): string | Promise<string> {
  return new Promise((resolve, reject) => {
    const transform = createTransform()
    const outChunks: Buffer[] = []
    let total = 0
    let settled = false
    const finish = (err: Error | null) => {
      if (settled) return
      settled = true
      if (err) reject(err)
      else resolve(Buffer.concat(outChunks).toString())
    }
    transform.on('data', (out: Buffer) => {
      total += out.length
      if (total > maxBytes) {
        finish(new RequestBodyTooLargeError('decompressed'))
        transform.destroy()
        return
      }
      outChunks.push(out)
    })
    transform.on('error', err => finish(err))
    transform.on('end', () => finish(null))
    transform.end(chunk)
  })
}

interface DecoderSpec {
  label: string
  createTransform?: () => import('node:stream').Transform
}

function decoderFor(encoding: string): DecoderSpec {
  switch (encoding) {
    case 'gzip':
    case 'x-gzip':
      return { label: encoding, createTransform: () => zlib.createGunzip() }
    case 'deflate':
      return { label: encoding, createTransform: () => zlib.createInflate() }
    case 'br':
      return { label: encoding, createTransform: () => zlib.createBrotliDecompress() }
    case 'zstd':
      if (typeof zlib.createZstdDecompress !== 'function') {
        throw new Error('zstd request encoding requires Node >= 22.15')
      }
      return { label: encoding, createTransform: () => zlib.createZstdDecompress()! }
    default:
      // Unknown/unsupported encoding — best-effort raw decode.
      return { label: `${encoding || 'identity'} (passthrough)` }
  }
}

/**
 * Decompress a complete buffer with a hard bound on the DECOMPRESSED size.
 * Used by `decodeRequestBody` for single-shot decodes where the caller already
 * holds the full compressed payload in memory: each chunk is piped through a
 * streaming zlib transform whose output is counted, so expansion beyond
 * `maxBytes` aborts before the full plaintext is ever materialized.
 */
async function inflateBounded(
  raw: Buffer,
  spec: DecoderSpec,
  maxBytes: number
): Promise<string> {
  if (!spec.createTransform) return raw.toString()
  // Feed in slices so even "buffered" transforms see incremental input and the
  // output counter can trip between slices instead of after the whole body.
  const SLICE = 64 * 1024
  let text = ''
  for (let offset = 0; offset < raw.length || offset === 0; offset += SLICE) {
    const slice = raw.subarray(offset, Math.min(offset + SLICE, raw.length))
    const part = await decodeBoundedChunk(spec.createTransform, slice, maxBytes - Buffer.byteLength(text))
    text += part
    if (Buffer.byteLength(text) > maxBytes) {
      throw new RequestBodyTooLargeError(`decompressed (${spec.label})`)
    }
    if (offset + SLICE >= raw.length) break
  }
  return text
}

/**
 * Decode a request body honoring Content-Encoding. Codex Desktop's built-in
 * `openai` provider zstd-compresses request bodies; without this they reach the
 * proxy as binary and JSON.parse fails with "Invalid JSON body".
 */
async function decodeRequestBody(raw: Buffer, encoding?: string | string[]): Promise<string> {
  const enc = (Array.isArray(encoding) ? encoding.join(',') : (encoding ?? '')).toLowerCase().trim()
  if (!enc || enc === 'identity') return raw.toString()
  const spec = decoderFor(enc)
  return inflateBounded(raw, spec, MAX_REQUEST_BODY_BYTES)
}

export function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalSize = 0
    let settled = false
    const fail = (err: Error) => {
      if (settled) return
      settled = true
      reject(err)
      req.destroy()
    }
    req.on('data', (c: Buffer) => {
      totalSize += c.length
      if (totalSize > MAX_REQUEST_BODY_BYTES) {
        fail(new RequestBodyTooLargeError('compressed'))
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      decodeRequestBody(Buffer.concat(chunks), req.headers['content-encoding']).then(resolve, reject)
    })
    req.on('error', fail)
  })
}

export function extractApiKey(req: IncomingMessage): string | null {
  const xApiKey = req.headers['x-api-key']
  if (typeof xApiKey === 'string') return xApiKey
  const auth = req.headers['authorization']
  if (typeof auth === 'string') return auth.replace(/^Bearer\s+/i, '').trim()
  return null
}

export function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>
): void {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(json),
    ...extraHeaders,
  })
  res.end(json)
}

/** In-memory rate limiter for gateway endpoints. */
interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/** Prune stale buckets once the store grows past this many entries. */
const RATE_LIMIT_PRUNE_THRESHOLD = 10_000

/**
 * Drop buckets whose window expired more than 2x `RATE_LIMIT_WINDOW_MS` ago.
 * Called lazily when the store grows large; also exported for tests/interval use.
 */
export function pruneRateLimits(now = Date.now()): number {
  const staleBefore = now - 2 * RATE_LIMIT_WINDOW_MS
  let pruned = 0
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt < staleBefore) {
      rateLimitStore.delete(key)
      pruned++
    }
  }
  return pruned
}

/**
 * Check if a client has exceeded the rate limit.
 * Returns `{ allowed: true }` if the request is allowed, or `{ allowed: false, resetAt }` if rate-limited.
 */
export function checkRateLimit(clientId: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  if (rateLimitStore.size > RATE_LIMIT_PRUNE_THRESHOLD) {
    pruneRateLimits()
  }
  const now = Date.now()
  const entry = rateLimitStore.get(clientId)
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    }
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetAt: entry.resetAt }
}
