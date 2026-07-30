import { afterEach, describe, expect, it, vi } from 'vitest'
import { safeFetchJson } from '../../src/utils/http.js'

describe('safeFetchJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('parses valid JSON response', async () => {
    const mockFetch = vi.fn(
      async () => new Response(JSON.stringify({ data: 'test' }), { status: 200 })
    )
    vi.stubGlobal('fetch', mockFetch)

    const result = await safeFetchJson<{ data: string }>('https://example.com/api')

    expect(result).toEqual({ data: 'test' })
    expect(mockFetch).toHaveBeenCalledOnce()
  })

  it('returns null for non-OK response', async () => {
    const mockFetch = vi.fn(async () => new Response('Not Found', { status: 404 }))
    vi.stubGlobal('fetch', mockFetch)

    const result = await safeFetchJson('https://example.com/api')

    expect(result).toBeNull()
  })

  it('returns null when fetch throws', async () => {
    const mockFetch = vi.fn(async () => {
      throw new Error('Network error')
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await safeFetchJson('https://example.com/api')

    expect(result).toBeNull()
  })

  it('returns null when JSON parsing fails', async () => {
    const mockFetch = vi.fn(async () => new Response('not json', { status: 200 }))
    vi.stubGlobal('fetch', mockFetch)

    const result = await safeFetchJson('https://example.com/api')

    expect(result).toBeNull()
  })

  it('passes init options to fetch', async () => {
    const mockFetch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', mockFetch)

    const init = { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    await safeFetchJson('https://example.com/api', init)

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', init)
  })
})
