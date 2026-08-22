// openai.ts — native OpenAI ChatGPT Plus/Pro OAuth (device code + browser auth, ported from OpenCode)

import { positiveSecondsToMs, sleepMs } from './pkce.js'
import type { OAuthTokenResponse } from './types.js'
import { VERSION } from '../config/constants.js'
import { postOAuthRefresh } from './refresh-http.js'
import { generatePkce, generateOAuthState } from './pkce.js'
import { startCallbackServer } from './callback-server.js'

const CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann'
export const ISSUER = 'https://auth.openai.com'
const OAUTH_POLLING_SAFETY_MARGIN_MS = 3_000
const DEVICE_CODE_DEFAULT_EXPIRES_MS = 5 * 60 * 1000

export interface OpenAiIdTokenClaims {
  chatgpt_account_id?: string
  organizations?: Array<{ id: string }>
  'https://api.openai.com/auth'?: { chatgpt_account_id?: string }
}

export interface OpenAiDeviceCodeData {
  device_auth_id: string
  user_code: string
  interval: string
  expires_in?: number
}

export interface OpenAiBrowserAuthParams {
  authUrl: string
  codeVerifier: string
  oauthState: string
}

export function extractOpenAiAccountId(tokens: OAuthTokenResponse): string | undefined {
  const token = tokens.id_token ?? tokens.access_token
  if (!token) return undefined
  const parts = token.split('.')
  if (parts.length !== 3) return undefined
  try {
    const claims = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString()) as OpenAiIdTokenClaims
    return (
      claims.chatgpt_account_id ??
      claims['https://api.openai.com/auth']?.chatgpt_account_id ??
      claims.organizations?.[0]?.id
    )
  } catch {
    return undefined
  }
}

export async function requestOpenAiDeviceCode(): Promise<OpenAiDeviceCodeData> {
  const response = await fetch(`${ISSUER}/api/accounts/deviceauth/usercode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': `anygate/${VERSION}`,
    },
    body: JSON.stringify({ client_id: CLIENT_ID }),
  })
  if (!response.ok) {
    throw new Error('Failed to initiate OpenAI device authorization')
  }
  return response.json() as Promise<OpenAiDeviceCodeData>
}

export function openAiDeviceCodeUrl(): string {
  return `${ISSUER}/codex/device`
}

export async function pollOpenAiDeviceCodeToken(
  deviceData: OpenAiDeviceCodeData,
  opts?: { sleep?: (ms: number) => Promise<void>; now?: () => number }
): Promise<{ tokens: OAuthTokenResponse; accountId?: string }> {
  const sleep = opts?.sleep ?? sleepMs
  const now = opts?.now ?? (() => Date.now())
  const intervalMs = Math.max(parseInt(deviceData.interval, 10) || 5, 1) * 1000
  const deadline =
    now() + positiveSecondsToMs(deviceData.expires_in, DEVICE_CODE_DEFAULT_EXPIRES_MS)

  while (now() < deadline) {
    const response = await fetch(`${ISSUER}/api/accounts/deviceauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `anygate/${VERSION}`,
      },
      body: JSON.stringify({
        device_auth_id: deviceData.device_auth_id,
        user_code: deviceData.user_code,
      }),
    })

    if (response.ok) {
      const data = (await response.json()) as { authorization_code: string; code_verifier: string }
      const tokenResponse = await fetch(`${ISSUER}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: data.authorization_code,
          redirect_uri: `${ISSUER}/deviceauth/callback`,
          client_id: CLIENT_ID,
          code_verifier: data.code_verifier,
        }).toString(),
      })
      if (!tokenResponse.ok) {
        const detail = await tokenResponse.text().catch(() => '')
        throw new Error(
          `OpenAI token exchange failed (${tokenResponse.status})` +
            `${detail.trim() ? `: ${detail.replace(/\s+/g, ' ').trim().slice(0, 200)}` : ''}`
        )
      }
      const tokens = (await tokenResponse.json()) as OAuthTokenResponse
      return { tokens, accountId: extractOpenAiAccountId(tokens) }
    }

    // 404 means "not authorized yet" — keep polling.
    // 403 can be either "authorization pending" (normal, keep polling) or a
    // terminal error like "device auth not enabled" (surface immediately).
    // Distinguish by the error code in the JSON body.
    if (response.status === 403) {
      const detail = await response.text().catch(() => '')
      try {
        const parsed = JSON.parse(detail) as { error?: { code?: string } }
        if (parsed.error?.code === 'deviceauth_authorization_pending') break
      } catch { /* not JSON — treat as terminal below */ }
      if (detail.trim()) {
        const msg = detail.replace(/\s+/g, ' ').trim().slice(0, 300)
        throw new Error(`OpenAI device authorization failed (403): ${msg}`)
      }
    } else if (response.status !== 404) {
      const detail = await response.text().catch(() => '')
      throw new Error(
        `OpenAI device authorization failed (${response.status})` +
          `${detail.trim() ? `: ${detail.replace(/\s+/g, ' ').trim().slice(0, 200)}` : ''}`
      )
    }

    await sleep(
      Math.min(intervalMs + OAUTH_POLLING_SAFETY_MARGIN_MS, Math.max(0, deadline - now()))
    )
  }
  throw new Error(
  'OpenAI device authorization timed out — your account may not have device code authorization enabled. Enable it in ChatGPT Security Settings and try again, or use the CLI: anygate providers auth openai'
)
}

export async function refreshOpenAiAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
  return postOAuthRefresh(
    `${ISSUER}/auth/token`,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
    {
      contentType: 'form',
      errorPrefix: 'OpenAI token refresh failed',
      includeStatus: true,
    }
  )
}

export async function runOpenAiDeviceCodeFlow(
  onDeviceCode: (info: { url: string; userCode: string }) => void,
  opts?: { sleep?: (ms: number) => Promise<void>; now?: () => number }
): Promise<{ tokens: OAuthTokenResponse; accountId?: string }> {
  const deviceData = await requestOpenAiDeviceCode()
  onDeviceCode({ url: openAiDeviceCodeUrl(), userCode: deviceData.user_code })
  return pollOpenAiDeviceCodeToken(deviceData, opts)
}

/**
 * Build the browser-based ChatGPT OAuth authorization URL with PKCE.
 *
 * This uses the standard OAuth 2.0 authorization code flow with PKCE against
 * the OpenAI auth.openai.com authorization server. The user is directed to
 * chatgpt.com or auth.openai.com to sign in, then redirected back to the
 * localhost callback URL with an authorization code.
 *
 * @param redirectUri The localhost callback URI to receive the authorization code
 * @returns Parameters including authUrl, codeVerifier, and oauthState
 */
export async function buildOpenAiBrowserAuthUrl(redirectUri: string): Promise<OpenAiBrowserAuthParams> {
  const { verifier, challenge } = await generatePkce()
  const state = generateOAuthState()
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    // Prompt to force fresh sign-in if needed
    prompt: 'login',
  })
  return {
    authUrl: `${ISSUER}/v1/authorize?${params}`,
    codeVerifier: verifier,
    oauthState: state,
  }
}

/**
 * Exchange an authorization code for tokens (browser-based OAuth flow).
 *
 * This is the token exchange step of the browser-based OAuth flow.
 * It exchanges the authorization code + code_verifier for access/refresh tokens.
 *
 * @param code The authorization code from the callback
 * @param codeVerifier The PKCE code verifier
 * @returns OAuth token response with optional account ID extracted from JWT
 */
export async function exchangeOpenAiBrowserToken(
  code: string,
  codeVerifier: string
): Promise<{ tokens: OAuthTokenResponse; accountId?: string | undefined }> {
  const tokenResponse = await fetch(`${ISSUER}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${ISSUER}/deviceauth/callback`,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }).toString(),
  })

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text().catch(() => '')
    throw new Error(
      `OpenAI token exchange failed (${tokenResponse.status})` +
        `${detail.trim() ? `: ${detail.replace(/\s+/g, ' ').trim().slice(0, 200)}` : ''}`
    )
  }

  const tokens = (await tokenResponse.json()) as OAuthTokenResponse
  return { tokens, accountId: extractOpenAiAccountId(tokens) }
}

/**
 * Legacy: Initiate the device code flow (deprecated in favor of browser flow).
 *
 * This is the OLD device code flow that requires users to enable device code
 * authorization in ChatGPT Security Settings. Kept for backward compatibility.
 *
 * @deprecated Use the browser-based flow for standard ChatGPT login
 */
export async function runOpenAiLegacyDeviceCodeFlow(
  onDeviceCode: (info: { url: string; userCode: string }) => void,
  opts?: { sleep?: (ms: number) => Promise<void>; now?: () => number }
): Promise<{ tokens: OAuthTokenResponse; accountId?: string }> {
  const deviceData = await requestOpenAiDeviceCode()
  onDeviceCode({ url: openAiDeviceCodeUrl(), userCode: deviceData.user_code })
  return pollOpenAiDeviceCodeToken(deviceData, opts)
}
