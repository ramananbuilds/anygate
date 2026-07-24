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

Three providers use OAuth device code authorization:

#### GitHub Copilot
```text
requestGithubDeviceCode()
  → POST https://github.com/login/device/code
  → Return { device_code, user_code, verification_uri }
  → User visits URL, enters code
  → pollGithubDeviceCodeToken(device_code)
  → Returns access_token
```

#### OpenAI
```text
requestOpenAiDeviceCode()
  → POST to OpenAI device code endpoint
  → Return { device_code, user_code, verification_uri }
  → pollOpenAiDeviceCodeToken(device_code)
  → Returns OAuth tokens (access + refresh)
```

#### xAI (Grok)
```text
requestXaiDeviceCode()
  → POST to xAI device code endpoint
  → pollXaiDeviceCodeToken(device_code)
  → Returns API key or OAuth token
```

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
