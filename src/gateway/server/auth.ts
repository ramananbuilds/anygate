import { timingSafeEqual } from 'node:crypto'
import { createHash } from 'node:crypto'

/** API keys and bearer tokens must be single-line — strip accidental paste noise. */
export function sanitizeCredential(value: string | null | undefined): string | null {
  if (!value) return null
  const firstLine = value.trim().split(/\r?\n/)[0]?.trim()
  return firstLine || null
}

/**
 * Constant-time string equality. Both sides are hashed with SHA-256 first so
 * the comparison always runs over equal-length digests — otherwise
 * crypto.timingSafeEqual throws on length mismatch and leaks the secret's
 * length through a timing side channel.
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  const da = createHash('sha256').update(a, 'utf8').digest()
  const db = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(da, db)
}

export function isAuthorized(request: Request, serverPassword: string | null): boolean {
  if (serverPassword === null) return true

  const bearerToken = extractBearerToken(request.headers.get('authorization'))
  if (bearerToken !== null && timingSafeEqualStrings(bearerToken, serverPassword)) return true

  const apiKey = sanitizeCredential(request.headers.get('x-api-key'))
  return apiKey !== null && timingSafeEqualStrings(apiKey, serverPassword)
}

export function extractBearerToken(value: string | null): string | null {
  if (!value) return null
  const normalized = value.replace(/\r?\n/g, ' ').trim()
  const match = /^Bearer\s+(\S+)/i.exec(normalized)
  return sanitizeCredential(match?.[1])
}
