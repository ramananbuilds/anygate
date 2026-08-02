# Guide: Adding a New Provider

> Step-by-step guide to add a new SDK-backed provider template to anygate.

## Prerequisites

- The provider has an OpenAI-compatible or vendor-specific API
- A Vercel AI SDK package exists for it (e.g., `@ai-sdk/groq`)

## Steps

### 1. Create the Template JSON

Create a new file in `src/registry/data/templates/`:

```bash
# Example: adding a provider called "acme"
touch src/registry/data/templates/acme.json
```

```json
{
  "id": "acme",
  "name": "Acme AI",
  "authType": "api",
  "npm": "@ai-sdk/acme",
  "defaultBaseUrl": "https://api.acme.ai/v1",
  "modelsPath": "/v1/models",
  "signupUrl": "https://acme.ai/signup",
  "urlPlaceholder": "https://api.acme.ai/v1",
  "modelSource": "api-list",
  "supported": true
}
```

### Template Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique provider identifier |
| `name` | Yes | Display name |
| `authType` | Yes | `'api'`, `'oauth'`, or `'none'` |
| `npm` | Yes | Vercel AI SDK package name |
| `defaultBaseUrl` | No | Default API endpoint |
| `modelsPath` | No | Model listing endpoint path |
| `modelSource` | Yes | How models are discovered |
| `supported` | Yes | Set `true` for public use |
| `signupUrl` | No | Where to get an API key |
| `signupNote` | No | One-line note rendered beside the signup link (e.g. referral bonus terms) |
| `headers` | No | Headers sent on every request to this provider. Use for endpoints that gate on client identity (a required `User-Agent`, an editor-version header, etc.) |
| `apiKeyOptional` | No | `true` for free/local providers |
| `staticModels` | No | Pre-defined models (for `static-seed`) |

### 2. Add Provider Metadata (Optional)

If the provider needs special metadata, create `src/registry/providers/acme/index.ts`:

```typescript
export const ACME_PROVIDER = {
  id: 'acme',
  name: 'Acme AI',
  npm: '@ai-sdk/acme',
};
```

Add the re-export to `src/registry/providers/index.ts`.

### 3. Add Provider Driver (Optional)

If the provider has non-standard configuration, create `src/providers/acme.ts`:

```typescript
export const ACME_DEFAULT_BASE_URL = 'https://api.acme.ai/v1';
export const ACME_MODELS_PATH = '/v1/models';
```

### 4. Test

```bash
npm run build
anygate providers add  # The new template should appear in the list
```

### 5. Add Tests

Create `tests/registry/acme-template.test.ts` to verify template loading and model fetching.

## Notes

- The template JSON is loaded automatically — no code registration needed
- Model format is classified by `classifyModelFormat()` based on the `npm` package
- The Vercel AI SDK handles provider-specific wire format quirks
- Test with `anygate providers add` to verify the full add flow
