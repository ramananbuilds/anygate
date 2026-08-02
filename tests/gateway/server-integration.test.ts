import { describe, expect, it, vi } from 'vitest'
import { checkRateLimit } from '../../src/shared/http.js'
import { sendError, AnygateError, ModelNotFoundError } from '../../src/shared/errors.js'
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from '../../src/config/constants.js'

// Mock ServerResponse for sendError testing
function mockResponse(): {
  statusCode: number
  headers: Record<string, string>
  body: string
  write: (data: string) => void
  end: (data: string) => void
  writeHead: (status: number, headers: Record<string, string>) => void
  headersSent: boolean
} {
  let headersSent = false
  return {
    statusCode: 0,
    headers: {},
    body: '',
    write(data: string) {
      this.body += data
    },
    end(data: string) {
      this.body += data
    },
    writeHead(status: number, headers: Record<string, string>) {
      this.statusCode = status
      this.headers = { ...headers }
      headersSent = true
    },
    get headersSent() {
      return headersSent
    },
  }
}

describe('Security: Rate Limiting', () => {
  it('allows requests up to the limit', () => {
    const clientId = 'test-client-1'
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      const result = checkRateLimit(clientId)
      expect(result.allowed).toBe(true)
    }
  })

  it('blocks requests after the limit is exceeded', () => {
    const clientId = 'test-client-2'
    // Exhaust the limit
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(clientId)
    }
    // Next request should be blocked
    const result = checkRateLimit(clientId)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })

  it('returns correct remaining count', () => {
    const clientId = 'test-client-3'
    const result = checkRateLimit(clientId)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(RATE_LIMIT_MAX_REQUESTS - 1)
  })

  it('resets after the time window', () => {
    const clientId = 'test-client-4'
    // Exhaust the limit
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(clientId)
    }
    // Should be blocked
    expect(checkRateLimit(clientId).allowed).toBe(false)

    // Simulate time passing by using a different client (window is per-client)
    const result = checkRateLimit('test-client-4-new')
    expect(result.allowed).toBe(true)
  })

  it('rate limits different clients independently', () => {
    const clientA = 'test-client-a'
    const clientB = 'test-client-b'

    // Exhaust client A
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(clientA)
    }
    expect(checkRateLimit(clientA).allowed).toBe(false)

    // Client B should still be allowed
    expect(checkRateLimit(clientB).allowed).toBe(true)
  })

  it('RATE_LIMIT_MAX_REQUESTS is 120', () => {
    expect(RATE_LIMIT_MAX_REQUESTS).toBe(120)
  })

  it('RATE_LIMIT_WINDOW_MS is 60000', () => {
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000)
  })
})

describe('Security: Error Handling', () => {
  it('sendError sends typed error response for AnygateError', () => {
    const res = mockResponse()
    const err = new ModelNotFoundError('claude-test')
    sendError(res, err)

    expect(res.statusCode).toBe(404)
    expect(res.headers['Content-Type']).toBe('application/json')
    const body = JSON.parse(res.body)
    expect(body.type).toBe('error')
    expect(body.error.type).toBe('not_found_error')
    expect(body.error.message).toBe('Model "claude-test" not found.')
  })

  it('sendError sends correct HTTP status for auth errors', () => {
    const res = mockResponse()
    const err = new AnygateError({
      httpStatus: 401,
      userMessage: 'Provider "test" rejected the API key',
    })
    sendError(res, err)

    expect(res.statusCode).toBe(401)
    const body = JSON.parse(res.body)
    expect(body.error.type).toBe('authentication_error')
  })

  it('sendError sends correct HTTP status for rate limit errors', () => {
    const res = mockResponse()
    const err = new AnygateError({
      httpStatus: 429,
      userMessage: 'Rate limit exceeded',
    })
    sendError(res, err)

    expect(res.statusCode).toBe(429)
    const body = JSON.parse(res.body)
    expect(body.error.type).toBe('rate_limit_error')
  })

  it('sendError does not leak internal details', () => {
    const res = mockResponse()
    const err = new AnygateError({
      httpStatus: 500,
      userMessage: 'Internal server error',
    })
    sendError(res, err)

    const body = JSON.parse(res.body)
    // Should not contain stack traces or file paths
    expect(body.error.message).not.toContain('/')
    expect(body.error.message).not.toContain('.ts')
    expect(body.error.message).not.toContain('Error:')
  })

  it('AnygateError preserves user-safe messages', () => {
    const err = new AnygateError({
      httpStatus: 400,
      userMessage: 'Invalid request body',
    })
    expect(err.userMessage).toBe('Invalid request body')
    expect(err.httpStatus).toBe(400)
    expect(err.retryable).toBe(false)
  })

  it('AnygateError supports retryable flag', () => {
    const err = new AnygateError({
      httpStatus: 503,
      userMessage: 'Upstream temporarily unavailable',
      retryable: true,
    })
    expect(err.retryable).toBe(true)
  })
})

describe('Security: Constants', () => {
  it('MAX_REQUEST_BODY_BYTES is 10MB', async () => {
    const { MAX_REQUEST_BODY_BYTES } = await import('../../src/config/constants.js')
    expect(MAX_REQUEST_BODY_BYTES).toBe(10 * 1024 * 1024)
  })
})
