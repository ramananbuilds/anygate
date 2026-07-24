# Reference: Configuration

> Preferences, file locations, and system constants reference.

## Configuration File Locations

- **User Preferences**: `~/.anygate/config.json`
- **Provider Registry**: `~/.anygate/providers.json`
- **Favorites Catalog**: `~/.anygate/favorites.json`
- **Analytics Log**: `~/.anygate/analytics.json`
- **Log Files**: `~/.anygate/logs/`

## Key Configuration Fields (`config.json`)

| Field | Type | Description |
|-------|------|-------------|
| `lastProvider` | string | Previously used provider ID for Claude Code |
| `lastModel` | string | Previously used model ID for Claude Code |
| `lastCodexProvider` | string | Previously used provider ID for Codex |
| `lastCodexModel` | string | Previously used model ID for Codex |
| `lastGeminiProvider` | string | Previously used provider ID for Gemini |
| `lastGeminiModel` | string | Previously used model ID for Gemini |
| `favoriteModels` | Array | Saved favorite models for catalog routing |
| `serverPassword` | string | Optional API key for network gateway mode |
| `serverListenMode` | `'local' \| 'network'` | Host binding mode (`127.0.0.1` vs `0.0.0.0`) |
| `serverMaskGatewayIds` | boolean | Mask model IDs for Claude Desktop |
