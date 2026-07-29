// Shared HTTP helpers for local proxy servers.
import type { IncomingMessage, ServerResponse } from 'node:http'
import * as zlib from 'node:zlib'
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../config/constants.js'

/**
 * Decode a request body honoring Content-Encoding. Codex Desktop's built-in
 * `openai` provider zstd-compresses request bodies; without this they reach the
 * proxy as binary and JSON.parse fails with "Invalid JSON body".
 */
function decodeRequestBody(raw: Buffer, encoding?: string | string[]): string {
  const enc = (Array.isArray(encoding) ? encoding.join(',') : (encoding ?? '')).toLowerCase().trim()
  if (!enc || enc === 'identity') return raw.toString()
  switch (enc) {
    case 'gzip':
    case 'x-gzip':
      return zlib.gunzipSync(raw).toString()
    case 'deflate':
      return zlib.inflateSync(raw).toString()
    case 'br':
      return zlib.brotliDecompressSync(raw).toString()
    case 'zstd':
      if (typeof zlib.zstdDecompressSync !== 'function') {
        throw new Error('zstd request encoding requires Node >= 22.15')
      }
      return zlib.zstdDecompressSync(raw).toString()
    default:
      // Unknown/unsupported encoding — best-effort raw decode.
      return raw.toString()
  }
}

export function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalSize = 0
    req.on('data', (c: Buffer) => {
      totalSize += c.length
      if (totalSize > 50 * 1024 * 1024) {
        reject(new Error('Request body too large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(decodeRequestBody(Buffer.concat(chunks), req.headers['content-encoding']))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
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

/**
 * Check if a client has exceeded the rate limit.
 * Returns `{ allowed: true }` if the request is allowed, or `{ allowed: false, resetAt }` if rate-limited.
 */
export function checkRateLimit(clientId: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
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
