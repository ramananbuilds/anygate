# Component: Auth (`src/auth/`)

> OAuth device flows, PKCE, keyring adapters, and token management.

## Structure

```text
src/auth/
├── github.ts              # GitHub Copilot device code flow
├── openai.ts              # OpenAI device code flow
├── xai.ts                 # xAI (Grok) device code flow
├── claude-code.ts         # Claude Code PKCE auth flow
├── claude-code-identity.ts # Claude Code CLI identity
├── claude-identity.ts     # Claude session identity & billing injection
├── antigravity-oauth.ts   # Antigravity Google OAuth (11KB)
├── pkce.ts                # PKCE challenge utilities
├── callback-server.ts     # Local OAuth callback HTTP server
├── refresh.ts             # Token refresh orchestration
├── refresh-http.ts        # HTTP token refresh
├── responses-websocket.ts # ChatGPT WebSocket transport (Responses-Lite)
└── types.ts               # Token/credential type definitions
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `requestGithubDeviceCode()` | `github.ts` | Start GitHub device code flow |
| `requestOpenAiDeviceCode()` | `openai.ts` | Start OpenAI device code flow |
| `requestXaiDeviceCode()` | `xai.ts` | Start xAI device code flow |
| `generatePKCE()` | `pkce.ts` | PKCE code challenge generation |
| `refreshStoredOAuthCredential()` | `refresh.ts` | Refresh expired token |
| `buildAntigravityAuthUrl()` | `antigravity-oauth.ts` | Build Google OAuth URL |

## Dependencies

- **Imports from**: `config/`, `types/`
- **Imported by**: `registry/`, `gateway/`, `apps/`, `cli/`, `ui/`

## Architecture Reference

See [Architecture: Authentication](../architecture/authentication.md)
