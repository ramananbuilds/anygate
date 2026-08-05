# Authentication

> OAuth device flows, PKCE, keyring adapters, and token lifecycle management.

## Location

```text
src/auth/
├── github.ts              # GitHub Copilot device code flow
├── openai.ts              # OpenAI device code flow
├── xai.ts                 # xAI (Grok) device code flow
├── claude-code.ts         # Claude Code PKCE auth flow
├── claude-code-identity.ts # Claude Code CLI identity resolution
├── claude-identity.ts     # Claude session identity & billing injection
├── antigravity-oauth.ts   # Antigravity Google OAuth flow
├── pkce.ts                # PKCE challenge generation utilities
├── callback-server.ts     # Local HTTP callback server for OAuth redirects
├── refresh.ts             # Stored token refresh orchestration
├── refresh-http.ts        # HTTP token refresh requests
├── responses-websocket.ts # ChatGPT Codex WebSocket transport (Responses-Lite)
└── types.ts               # Token, credential, and OAuth type definitions
```

## Auth Strategies

### API Key Authentication

The simplest path — user provides an API key, anygate stores it in the OS keyring:

```text
anygate providers add → pick template → enter API key
  → validateApiKey(key, baseUrl)     // test against provider API
  → saveProviderCredential(id, key)  // OS keyring via @napi-rs/keyring
```

### OAuth Device Code Flows

Three providers use OAuth device code authorization. Each has **two** distinct
endpoints — the device-code request and the token poll — which are easy to conflate;
GitHub's differ by a single path segment, and pointing the poll at the wrong one
produces an HTML error page rather than a protocol error.

#### GitHub Copilot
```text
requestGithubDeviceCode()
  → POST https://github.com/login/device/code
  → Return { device_code, user_code, verification_uri }
  → User visits URL, enters code
  → pollGithubDeviceCodeToken(device_code)
    → POST https://github.com/login/oauth/access_token   (NOT /login/auth/...)
    → Returns a ghu_ OAuth user token
  → exchangeForCopilotToken(ghu_token)
    → GET https://api.github.com/copilot_internal/v2/token
    → Returns a short-lived Copilot session token
```

The stored `refresh` value is the long-lived `ghu_` token, not an OAuth refresh
token: renewal re-exchanges it for a fresh Copilot session token. Requests also
require the `Editor-Version` header, which the template carries.

#### OpenAI
```text
requestOpenAiDeviceCode()
  → POST https://auth.openai.com/api/accounts/deviceauth/usercode
  → Return { device_auth_id, user_code, interval }
  → pollOpenAiDeviceCodeToken(...)
    → POST https://auth.openai.com/api/accounts/deviceauth/token
    → 403/404 mean "not yet authorized" — keep polling
    → On success, exchange the authorization_code at /auth/token
  → Returns OAuth tokens (access + refresh)
```

#### xAI (Grok)
```text
requestXaiDeviceCode()
  → POST https://auth.x.ai/oauth2/device/code
  → pollXaiDeviceCodeToken(device_code)
    → POST https://auth.x.ai/oauth2/token
  → Returns OAuth tokens (access + refresh)
```

**Error handling.** Poll loops must not parse responses with a swallowing
`.json().catch(() => ({}))`: a non-JSON body (HTML error page, proxy failure) then
becomes an empty object indistinguishable from a valid pending response, and the
real cause is lost. Read the body as text, parse it explicitly, and include the HTTP
status plus an excerpt in any thrown error. A non-JSON body should fail immediately
rather than polling to the deadline — an endpoint not speaking the device-flow
protocol will not begin speaking it.

**Template resolution.** After tokens are saved, `upsertOAuthProvider()` needs a
template to build the registry entry. Do not assume stripping `-oauth` yields one:
`xai-oauth` shares `xai.json`, but `openai-oauth` has no bare-id counterpart. The
resolver tries the bare id, then the id as given, then the registry id. A provider
that resolves to no template throws *after* its credential is persisted, stranding
the user signed in with no usable provider.

### PKCE Flow (Claude Code)

For Claude Code authentication:

```text
generatePKCE()
  → { codeVerifier, codeChallenge }  // SHA-256 + base64url
  → Build authorization URL with code_challenge
  → Start local callback server (callbackServer.ts)
  → User completes auth in browser
  → Callback receives authorization code
  → Exchange code + codeVerifier for tokens
```

### Antigravity OAuth

```text
buildAntigravityAuthUrl(redirectUri)
  → Google OAuth URL for Cloud Code access
  → User authenticates with Google account
  → completeAntigravityExchange(code)
  → Returns OAuth tokens for Cloud Code API
```

## Token Storage

### OS Keyring (Primary)

```typescript
// @napi-rs/keyring provides cross-platform access
import { Entry } from '@napi-rs/keyring';

// Store
new Entry('anygate', providerId).setPassword(credential);

// Retrieve
const cred = new Entry('anygate', providerId).getPassword();
```

| Platform | Backend |
|----------|---------|
| macOS | Keychain |
| Windows | Credential Manager |
| Linux | Secret Service API (GNOME Keyring / KWallet) |

### Fallback (Shell Profile)

When the native keyring module is unavailable:
- Offer to append `export OPENCODE_API_KEY=...` to `~/.zshrc` or `~/.bashrc`
- Session-only storage (environment variable, lost on shell exit)

## Token Refresh

Stored OAuth credentials support automatic refresh:

```text
oauthCredentialShouldRefresh(credential)
  → Check expiry timestamp
  → If expired: refreshStoredOAuthCredential(credential)
    → POST refresh_token to provider's token endpoint
    → Update stored credential
    → Return fresh access_token
```

## Claude Code Child-Process Authentication

Claude Code reads auth from environment variables, not files. anygate's
`buildChildEnv()` (`src/config/env.ts`) prepares these for every Claude Code
launch:

```text
ANTHROPIC_BASE_URL    → provider endpoint (or http://127.0.0.1:<proxy-port> when proxied)
ANTHROPIC_API_KEY     → credential key (provider key for direct, proxy token for proxied)
ANTHROPIC_AUTH_TOKEN  → same value as ANTHROPIC_API_KEY
ANTHROPIC_MODEL       → selected model ID (with [1m] suffix for 1M context windows)
CLAUDE_CODE_MAX_CONTEXT_TOKENS → resolved context window
```

### Env Var Conflict Stripping

`CONFLICTING_ENV_VARS` (Vertex, Bedrock, AWS, Foundry, stale Anthropic configs)
are deleted from the child env to prevent cross-auth-mode leakage, then the
active values above are re-set. All Anthropic auth env vars are stripped —
including `ANTHROPIC_AUTH_TOKEN` — so that a stale OAuth token from the host
shell cannot override anygate's launch configuration.

### Claude Code v2.x Session Auth

Claude Code v2.1.221+ checks `ANTHROPIC_AUTH_TOKEN` for session-level auth
even when `ANTHROPIC_API_KEY` is set (which only controls the "API Usage
Billing" banner). Without `ANTHROPIC_AUTH_TOKEN`, Claude Code shows
"Not logged in" and rejects all message requests despite the banner indicating
billing mode is active. `buildChildEnv()` sets `ANTHROPIC_AUTH_TOKEN` to the
same key value to satisfy this check.

### Proxy vs Direct Passthrough

All anthropic-format models now route through the local proxy (`startProxy`),
which ensures:
- Provider template headers (e.g. `x-app: cli` for Agent Router) are forwarded
- Claude Code identity injection (`injectClaudeIdentity`, `selectBetaFlags`)
- Proper header handling on both streaming and non-streaming requests

Direct passthrough (bypassing the proxy) previously omitted provider template
headers, causing 401s on gateways that require them.

## Claude Identity Injection

For proxy-routed models, anygate injects Claude Code identity headers and system prompt lines:

- `CLAUDE_CODE_CLI_VERSION` — reported version string
- `injectClaudeCodeBillingSystemLine()` — billing context for metered models
- `injectClaudeIdentity()` — Claude Code session identity
- `selectBetaFlags()` — Anthropic beta feature flags

## WebSocket Transport (Responses-Lite)

For ChatGPT desktop app (Codex), some models use WebSocket transport:

```text
responses-websocket.ts
  → Connect to wss://chatgpt.com/backend-api/codex/responses
  → Send Responses-Lite requests over WebSocket
  → Receive streaming responses
  → Translate to Anthropic SSE for proxy compatibility
```

Constants:
- `CODEX_RESPONSES_LITE_WS_URL` — WebSocket endpoint
- `CODEX_RESPONSES_LITE_VERSION` — version header
- `CODEX_RESPONSES_WEBSOCKETS_BETA` — opt-in beta flag

---

**See also:**
- [Provider System](provider-system.md) — credential resolution and storage
- [Gateway](gateway.md) — how auth tokens are used at request time
- [Reference: Supported Providers](../reference/supported-providers.md) — auth type per provider
