# Component: Registry (`src/registry/`)

> Provider & model catalog management: templates, loading, sync, validation, and persistent storage.

## Structure

```text
src/registry/
├── data/
│   ├── templates/              # 19 JSON provider template files
│   └── providers/              # Zen/Go builtin provider definitions
├── loader/
│   ├── load.ts                 # Load registry providers with model enrichment
│   └── materializer.ts         # Materialize template data into provider objects
├── providers/
│   ├── anthropic/index.ts      # Anthropic provider metadata
│   ├── google/index.ts         # Google provider metadata
│   ├── groq/index.ts           # Groq provider metadata
│   ├── mistral/index.ts        # Mistral provider metadata
│   ├── nvidia/index.ts         # NVIDIA provider metadata
│   ├── ollama/index.ts         # Ollama provider metadata
│   ├── openai/index.ts         # OpenAI provider metadata
│   ├── vertex/index.ts         # Vertex AI provider metadata
│   ├── xai/index.ts            # xAI provider metadata
│   └── index.ts                # Central re-export
├── resolver/
│   └── resolve-template.ts     # Template and model ID resolvers
├── storage/
│   ├── io.ts                   # Load/save registry JSON file
│   ├── crud.ts                 # Add/remove/update provider entries
│   └── custom-endpoint.ts      # Custom endpoint provider handling
├── sync/
│   ├── refresh-models.ts       # Refresh model lists from provider APIs
│   └── refresh-credentials.ts  # Credential validity checking
├── templates/
│   ├── provider-templates.ts   # Template loading, filtering, types (ProviderTemplate)
│   └── add-template.ts         # Template-based provider addition flow
├── validation/
│   └── url-security.ts         # URL validation for custom endpoints
├── auth-broker.ts              # Auth delegation for registry operations
├── model-source.ts             # Model source resolution
├── models-dev.ts               # OpenCode cache model enrichment
├── opencode-auth.ts            # OpenCode OAuth credential helpers
├── pricing.ts                  # Model pricing data
├── provider-auth.ts            # Provider authentication flows
├── provider-catalog.ts         # Catalog resolution & favorites building
├── types.ts                    # Registry-specific types
├── upgrade.ts                  # Registry format migration
└── index.ts
```

## Key Exports

| Function | File | Purpose |
|----------|------|---------|
| `fetchProviderCatalog()` | `provider-catalog.ts` | Get all available providers+models |
| `loadRegistry()` | `storage/io.ts` | Read `~/.anygate/providers.json` |
| `addProviderFromTemplate()` | `templates/add-template.ts` | Add provider from template |
| `removeProviderFromRegistry()` | `storage/crud.ts` | Remove a provider |
| `refreshProviderModels()` | `sync/refresh-models.ts` | Refresh model list |
| `listSupportedTemplates()` | `templates/provider-templates.ts` | All available templates |
| `validateCustomEndpointUrl()` | `validation/url-security.ts` | Validate custom URLs |

## Dependencies

- **Imports from**: `config/`, `auth/`, `storage/`, `types/`, `gateway/providers/`
- **Imported by**: `apps/`, `cli/`, `gateway/`, `ui/`

## Architecture Reference

See [Architecture: Provider System](../architecture/provider-system.md)
