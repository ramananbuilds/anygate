import { Readable } from 'node:stream'
import type { ServerResponse } from 'node:http'
import { sanitizeCredential } from './gateway/server/auth.js'
import { CLAUDE_CODE_USER_AGENT } from './auth/claude-identity.js'
import { UpstreamUnreachableError } from './shared/errors.js'
import { REQUEST_TIMEOUT_MS as DEFAULT_REQUEST_TIMEOUT_MS } from './config/constants.js'

export function anthropicUpstreamHeaders(
  apiKey: string,
  stream = false,
  inboundBeta?: string,
  authType?: 'api' | 'oauth',
  claudeCodeSessionId?: string,
  extraHeaders?: Record<string, string>
): Record<string, string> {
  const key = sanitizeCredential(apiKey) ?? apiKey.trim()
  const isOAuth = authType === 'oauth'
  const headers: Record<string, string> = {
    ...extraHeaders,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    Authorization: `Bearer ${key}`,
    ...(isOAuth ? {} : { 'x-api-key': key }),
    ...(isOAuth ? { 'User-Agent': CLAUDE_CODE_USER_AGENT, 'x-app': 'cli' } : {}),
    ...(isOAuth && claudeCodeSessionId ? { 'X-Claude-Code-Session-Id': claudeCodeSessionId } : {}),
    ...(stream ? { Accept: 'text/event-stream' } : {}),
  }
  if (inboundBeta) {
    headers['anthropic-beta'] = inboundBeta
  }
  return headers
}

export async function fetchWithOAuthRetry<TResponse extends { status: number }>(
  apiKey: string,
  request: (apiKey: string) => Promise<TResponse>,
  refreshToken?: () => Promise<string | null>
): Promise<{ response: TResponse; apiKey: string; refreshed: boolean }> {
  let response = await request(apiKey)
  if (response.status !== 401 || !refreshToken) {
    return { response, apiKey, refreshed: false }
  }

  const refreshed = await refreshToken().catch(() => null)
  if (!refreshed || refreshed === apiKey) {
    return { response, apiKey, refreshed: false }
  }

  response = await request(refreshed)
  return { response, apiKey: refreshed, refreshed: true }
}

/** Usage parsed from an Anthropic response (message_start / message_delta events). */
export interface AnthropicUsage {
  inputTokens: number
  outputTokens: number
}

/**
 * Tee-scan raw Anthropic SSE chunks for token usage without altering the
 * forwarded bytes. `message_start` carries input_tokens, `message_delta`
 * carries output_tokens; later values win (deltas accumulate upstream).
 */
export function scanAnthropicSseUsage(
  chunkText: string,
  usage: { inputTokens: number; outputTokens: number }
): void {
  for (const line of chunkText.split('\n')) {
    const t = line.startsWith('data:') ? line.slice(5).trim() : line.trim()
    if (!t || t === '[DONE]') continue
    try {
      const obj = JSON.parse(t) as {
        message?: { usage?: { input_tokens?: number; output_tokens?: number } }
        usage?: { input_tokens?: number; output_tokens?: number }
      }
      const startUsage = obj.message?.usage
      if (startUsage) {
        usage.inputTokens = startUsage.input_tokens ?? usage.inputTokens
        if (typeof startUsage.output_tokens === 'number')
          usage.outputTokens = startUsage.output_tokens
        continue
      }
      const deltaUsage = obj.usage
      if (deltaUsage && typeof deltaUsage.output_tokens === 'number') {
        usage.outputTokens = deltaUsage.output_tokens
      }
    } catch {
      // Not a JSON SSE line — ignore.
    }
  }
}

/** Gateway an Anthropic /v1/messages response (JSON or SSE) to the client. */
export async function forwardAnthropicMessages(
  res: ServerResponse,
  messagesUrl: string,
  body: Record<string, unknown>,
  apiKey: string,
  clientWantsStream: boolean,
  inboundBeta?: string,
  authType?: 'api' | 'oauth',
  log?: (message: string) => void,
  claudeCodeSessionId?: string,
  extraHeaders?: Record<string, string>,
  refreshToken?: () => Promise<string | null>,
  onTokenRefreshed?: (token: string) => void,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS
): Promise<AnthropicUsage> {
  const usage: AnthropicUsage = { inputTokens: 0, outputTokens: 0 }
  // H3: abort the upstream fetch when (a) the client disconnects, or (b) the
  // request exceeds timeoutMs. AbortSignal.any needs Node ≥20; engines allow
  // 18, so combine signals via a manual relay instead.
  const disconnectController = new AbortController()
  const onClientGone = () => disconnectController.abort()
  res.on('close', onClientGone)
  res.on('error', onClientGone)
  const timeoutController = new AbortController()
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs)
  const combinedSignal = disconnectController.signal.aborted
    ? disconnectController.signal
    : connectAbortSignals(disconnectController.signal, timeoutController.signal)
  try {
    return await forwardInner(combinedSignal)
  } finally {
    clearTimeout(timer)
    res.off('close', onClientGone)
    res.off('error', onClientGone)
  }

  function connectAbortSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
    // Minimal polyfill of AbortSignal.any for Node <20.
    const merged = new AbortController()
    const relay = () => merged.abort()
    if (a.aborted || b.aborted) {
      merged.abort()
      return merged.signal
    }
    a.addEventListener('abort', relay, { once: true })
    b.addEventListener('abort', relay, { once: true })
    return merged.signal
  }

  async function forwardInner(signal: AbortSignal): Promise<AnthropicUsage> {
    const doFetch = (key: string) =>
      fetch(messagesUrl, {
        method: 'POST',
        headers: anthropicUpstreamHeaders(
          key,
          clientWantsStream,
          inboundBeta,
          authType,
          claudeCodeSessionId,
          extraHeaders
        ),
        body: JSON.stringify(body),
        signal,
      })

    let upstreamRes: Response
    try {
      const retryResult = await fetchWithOAuthRetry(apiKey, doFetch, refreshToken)
      upstreamRes = retryResult.response
      if (retryResult.refreshed) onTokenRefreshed?.(retryResult.apiKey)
    } catch (err) {
      if (signal.aborted) {
        emitAborted(res, clientWantsStream)
        return usage
      }
      throw new UpstreamUnreachableError(err)
    }

    if (!upstreamRes.ok) {
      const errBody = await upstreamRes.text()
      log?.(`anthropic upstream ${upstreamRes.status}: ${errBody}`)
      res.writeHead(upstreamRes.status, {
        'Content-Type': upstreamRes.headers.get('content-type') || 'application/json',
      })
      res.end(errBody)
      return usage
    }

    if (clientWantsStream && upstreamRes.body) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      // Tee-scan the stream for usage so the gateway can record analytics without
      // altering a single forwarded byte. Await full consumption so callers get a
      // COMPLETE usage object (message_start carries input_tokens; the final
      // message_delta carries cumulative output_tokens) rather than a snapshot
      // taken before any bytes flowed.
      await new Promise<void>((resolve, reject) => {
        Readable.fromWeb(upstreamRes.body as Parameters<typeof Readable.fromWeb>[0])
          .on('data', (chunk: Buffer) => scanAnthropicSseUsage(chunk.toString('utf8'), usage))
          .on('error', err => {
            res.destroy()
            reject(err)
          })
          .on('end', () => resolve())
          .pipe(res)
      }).catch(() => {
        // Stream failed mid-flight — headers are already sent; nothing more to do.
      })
      return usage
    }

    if (!upstreamRes.body) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          type: 'error',
          error: { type: 'api_error', message: 'Upstream returned empty response body' },
        })
      )
      return usage
    }

    let text: string
    try {
      text = await upstreamRes.text()
    } catch {
      // Upstream body read failed (abort mid-read etc.).
      emitAborted(res, clientWantsStream)
      return usage
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          type: 'error',
          error: { type: 'api_error', message: 'Upstream response was not valid JSON' },
        })
      )
      return usage
    }
    // Non-streaming Anthropic responses carry usage on the top-level message body.
    const parsedUsage = (parsed as { usage?: { input_tokens?: number; output_tokens?: number } })
      .usage
    if (parsedUsage) {
      usage.inputTokens = parsedUsage.input_tokens ?? 0
      usage.outputTokens = parsedUsage.output_tokens ?? 0
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(text).toString(),
    })
    res.end(text)
    return usage
  }
}

/** Emit an Anthropic-style error for aborted/timed-out upstream requests. */
function emitAborted(res: ServerResponse, clientWantsStream: boolean): void {
  if (res.headersSent || res.writableEnded || res.destroyed) {
    // Mid-stream abort: nothing sane to send; drop the connection.
    res.destroy()
    return
  }
  if (clientWantsStream) {
    res.writeHead(504, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        type: 'error',
        error: { type: 'timeout', message: 'Upstream request timed out or was aborted.' },
      })
    )
    return
  }
  res.writeHead(504, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      type: 'error',
      error: { type: 'timeout', message: 'Upstream request timed out or was aborted.' },
    })
  )
}
