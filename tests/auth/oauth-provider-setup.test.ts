// Regression tests for the OAuth provider failures (GitHub Copilot, OpenAI ChatGPT,
// xAI SuperGrok).
//
// Three defects, two of which made sign-in impossible:
//
//   1. src/auth/github.ts posted to /login/auth/access_token instead of
//      /login/oauth/access_token. GitHub answers the wrong path with HTTP 422 and
//      an HTML error page; the poll loop's `.json().catch(() => ({}))` turned that
//      into an empty object carrying neither `error` nor `access_token`, so every
//      attempt fell through to a bare "GitHub device authorization failed".
//      Copilot OAuth could never complete, and the message named no cause.
//
//   2. upsertOAuthProvider derived a template id by stripping "-oauth"
//      unconditionally, so openai-oauth resolved to "openai" — but no openai.json
//      exists, only openai-oauth.json. getTemplateById returned undefined and the
//      function threw "is not in your registry and has no template" *after* the
//      tokens were already written to the keychain, leaving the user signed in
//      with no provider and failing identically on every retry.
//
//   3. Both device-code poll loops swallowed non-JSON error bodies, which is what
//      made (1) undiagnosable. They now report the status and a body excerpt.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pollGithubDeviceCodeToken } from '../../src/auth/github.js'
import { pollXaiDeviceCodeToken } from '../../src/auth/xai.js'
import { resolveOAuthTemplateForTest } from '../../src/registry/provider-auth.js'
import { toOAuthRegistryId } from '../../src/registry/loader/import-build.js'
import { getTemplateById } from '../../src/registry/templates/provider-templates.js'
import { NATIVE_OAUTH_PROVIDER_IDS } from '../../src/auth/types.js'

const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

/** Response double that behaves like a real one for both .json() and .text(). */
function jsonResponse(body: unknown, init?: { ok?: boolean; status?: number }) {
  const text = JSON.stringify(body)
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    json: async () => JSON.parse(text),
    text: async () => text,
  }
}

/** A non-JSON body — what a misrouted endpoint actually returns. */
function htmlResponse(status: number) {
  const body = '<!DOCTYPE html><html><head><title>Oh no &middot; GitHub</title></head></html>'
  return {
    ok: false,
    status,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON')
    },
    text: async () => body,
  }
}

const device = {
  device_code: 'dc_123',
  user_code: 'UC-456',
  verification_uri: 'https://github.com/login/device',
  expires_in: 900,
  interval: 1,
}

describe('GitHub Copilot device-code token endpoint', () => {
  beforeEach(() => mockFetch.mockReset())

  it('posts to /login/oauth/access_token', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ access_token: 'ghu_123' }))
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: 'tid_456' }))

    await pollGithubDeviceCodeToken(device, { sleep: async () => {}, now: () => 0 })

    // /login/auth/access_token returns HTTP 422 + HTML; only /login/oauth/ works.
    expect(mockFetch.mock.calls[0]?.[0]).toBe('https://github.com/login/oauth/access_token')
  })

  it('reports status and body when the endpoint returns non-JSON', async () => {
    mockFetch.mockResolvedValueOnce(htmlResponse(422))

    const err = await pollGithubDeviceCodeToken(device, {
      sleep: async () => {},
      now: () => 0,
    }).catch((e: Error) => e)

    // The old code saw {} here and reported nothing actionable.
    expect(String(err)).toMatch(/non-JSON/)
    expect(String(err)).toMatch(/422/)
    expect(String(err)).toMatch(/access_token/) // names the URL it called
  })

  it('fails fast on a non-JSON body instead of polling to the deadline', async () => {
    mockFetch.mockResolvedValue(htmlResponse(422))
    const sleep = vi.fn().mockResolvedValue(undefined)

    await pollGithubDeviceCodeToken(device, { sleep, now: () => 0 }).catch(() => {})

    // An endpoint not speaking device-flow will never start speaking it.
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it('still treats authorization_pending as a retry', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'authorization_pending' }))
    mockFetch.mockResolvedValueOnce(jsonResponse({ access_token: 'ghu_123' }))
    mockFetch.mockResolvedValueOnce(jsonResponse({ token: 'tid_456' }))
    const sleep = vi.fn().mockResolvedValue(undefined)

    const res = await pollGithubDeviceCodeToken(device, { sleep, now: () => 0 })

    expect(res.access_token).toBe('tid_456')
    expect(res.refresh_token).toBe('ghu_123')
    expect(sleep).toHaveBeenCalledTimes(1)
  })
})

describe('xAI device-code polling', () => {
  beforeEach(() => mockFetch.mockReset())

  it('reports status and body when the response is not JSON', async () => {
    mockFetch.mockResolvedValueOnce(htmlResponse(502))

    const err = await pollXaiDeviceCodeToken(device, {
      sleep: async () => {},
      now: () => 0,
    }).catch((e: Error) => e)

    expect(String(err)).toMatch(/502/)
  })

  it('surfaces error_description when the provider supplies one', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse(
        { error: 'invalid_client', error_description: 'Client authentication failed' },
        { ok: false, status: 401 }
      )
    )

    const err = await pollXaiDeviceCodeToken(device, {
      sleep: async () => {},
      now: () => 0,
    }).catch((e: Error) => e)

    expect(String(err)).toMatch(/invalid_client/)
    expect(String(err)).toMatch(/Client authentication failed/)
  })

  it('gives an actionable message when the device code expired', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ error: 'expired_token' }, { ok: false, status: 400 })
    )

    const err = await pollXaiDeviceCodeToken(device, {
      sleep: async () => {},
      now: () => 0,
    }).catch((e: Error) => e)

    expect(String(err)).toMatch(/expired/)
    expect(String(err)).toMatch(/auth xai/)
  })

  it('still retries on authorization_pending and slow_down', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ error: 'authorization_pending' }, { ok: false, status: 400 })
    )
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ error: 'slow_down' }, { ok: false, status: 400 })
    )
    mockFetch.mockResolvedValueOnce(jsonResponse({ access_token: 'xai_tok' }))
    const sleep = vi.fn().mockResolvedValue(undefined)

    const res = await pollXaiDeviceCodeToken(device, { sleep, now: () => 0 })

    expect(res.access_token).toBe('xai_tok')
    expect(sleep).toHaveBeenCalledTimes(2)
  })
})

describe('OAuth provider template resolution', () => {
  it('resolves a template for every native OAuth provider', () => {
    // A provider whose template cannot be resolved throws *after* its tokens are
    // saved, so the user is signed in with nothing to show for it.
    for (const providerId of NATIVE_OAUTH_PROVIDER_IDS) {
      const { template } = resolveOAuthTemplateForTest(providerId)
      expect(template, `${providerId} resolves to no template`).toBeDefined()
    }
  })

  it('falls back to the -oauth id when no bare-id template exists', () => {
    // There is no openai.json — only openai-oauth.json.
    expect(getTemplateById('openai')).toBeUndefined()

    const { templateId, template } = resolveOAuthTemplateForTest('openai-oauth')

    expect(templateId).toBe('openai-oauth')
    expect(template?.npm).toBe('@ai-sdk/openai')
    expect(template?.defaultBaseUrl).toBe('https://api.openai.com/v1')
  })

  it('resolves the canonical id the same way as the registry id', () => {
    // `anygate providers auth openai` and `... openai-oauth` must behave alike.
    expect(resolveOAuthTemplateForTest('openai').templateId).toBe(
      resolveOAuthTemplateForTest('openai-oauth').templateId
    )
    expect(resolveOAuthTemplateForTest('xai').templateId).toBe(
      resolveOAuthTemplateForTest('xai-oauth').templateId
    )
  })

  it('prefers the shared bare-id template when one exists', () => {
    // xai.json backs both the API-key and OAuth entries; don't fork the catalog.
    expect(resolveOAuthTemplateForTest('xai-oauth').templateId).toBe('xai')
  })

  it('carries the client-identity headers Copilot requires', () => {
    // Copilot rejects requests without an Editor-Version header.
    const { template } = resolveOAuthTemplateForTest('github-copilot')
    expect(template?.headers?.['Editor-Version']).toBeTruthy()
  })

  it('maps each provider to its expected registry slot', () => {
    expect(toOAuthRegistryId('openai')).toBe('openai-oauth')
    expect(toOAuthRegistryId('xai')).toBe('xai-oauth')
    expect(toOAuthRegistryId('github-copilot')).toBe('github-copilot')
  })
})
