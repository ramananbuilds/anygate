# Reference: Supported Providers

> Comprehensive list of built-in providers, authentication methods, and SDK packages.
>
> Generated from the templates in `src/registry/data/templates/`. Those JSON files are
> the source of truth — if this table and a template disagree, the template wins and
> this page needs updating.

## Added via `anygate providers add`

| Provider | Auth Type | Vercel AI SDK Package | Base URL | Notes |
|----------|-----------|------------------------|----------|-------|
| Agent Router | API Key | `@ai-sdk/anthropic` | `https://agentrouter.org` | Credit-based multi-model gateway. Registered in Anthropic format (see note below) |
| Anthropic | API Key | `@ai-sdk/anthropic` | `https://api.anthropic.com` | Native Anthropic `/v1/messages` format |
| Cerebras | API Key | `@ai-sdk/cerebras` | `https://api.cerebras.ai/v1` | Ultra-fast inference |
| Cohere | API Key | `@ai-sdk/cohere` | `https://api.cohere.com/v1` | Command R / R+ models |
| DeepInfra | API Key | `@ai-sdk/deepinfra` | `https://api.deepinfra.com/v1/openai` | Open-source model hosting |
| DeepSeek | API Key | `@ai-sdk/openai-compatible` | `https://api.deepseek.com/v1` | DeepSeek V3 / R1 models |
| Fireworks AI | API Key | `@ai-sdk/openai-compatible` | `https://api.fireworks.ai/inference/v1` | OpenAI-compatible endpoint |
| Groq | API Key | `@ai-sdk/groq` | `https://api.groq.com/openai/v1` | Fast Llama/Mistral inference; tool count capped at 128 |
| Kilo Code | API Key *(optional)* | `@ai-sdk/openai-compatible` | `https://api.kilo.ai/api/gateway` | Free models available without a key |
| LM Studio | API Key *(optional)* | `@ai-sdk/openai-compatible` | `http://127.0.0.1:1234/v1` | Local server; prompts for your base URL |
| Mistral | API Key | `@ai-sdk/mistral` | `https://api.mistral.ai/v1` | Mistral models |
| Nvidia | API Key | `@ai-sdk/openai-compatible` | `https://integrate.api.nvidia.com/v1` | NVIDIA NIM endpoints |
| Ollama | API Key *(optional)* | `@ai-sdk/openai-compatible` | `http://127.0.0.1:11434/v1` | Local server; prompts for your base URL (see note below) |
| OpenCode Zen / Go | OpenCode Key | `@ai-sdk/openai-compatible` | `https://opencode.ai/zen` | Built-in cloud endpoints |
| OpenRouter | API Key | `@openrouter/ai-sdk-provider` | `https://openrouter.ai/api/v1` | Multi-model aggregator |
| OVHcloud AI Endpoints | API Key | `@ai-sdk/openai-compatible` | `https://api.endpoints.kepler.ai.cloud.ovh.net/v1` | EU-hosted inference |
| Perplexity | API Key | `@ai-sdk/perplexity` | `https://api.perplexity.ai` | Perplexity Sonar search models |
| SambaNova | API Key | `@ai-sdk/openai-compatible` | `https://api.sambanova.ai/v1` | OpenAI-compatible endpoint |
| Scaleway | API Key | `@ai-sdk/openai-compatible` | `https://api.scaleway.ai/v1` | EU-hosted inference |
| Together AI | API Key | `@ai-sdk/togetherai` | `https://api.together.xyz/v1` | Open-source model hosting |
| Venice AI | API Key | `venice-ai-sdk-provider` | `https://api.venice.ai/api/v1` | Privacy-focused inference |
| xAI | API Key | `@ai-sdk/xai` | `https://api.x.ai/v1` | Grok models |
| Custom Endpoint | User Defined | `@ai-sdk/openai-compatible` or `@ai-sdk/anthropic` | User supplied | OpenAI or Anthropic format; supports custom headers |

Providers already present in your registry are excluded from the add list — both in
`anygate providers add` and the web dashboard's **Add provider** dialog.

## Added via OAuth (`anygate providers auth <id>`)

| Provider | Auth Type | Vercel AI SDK Package | Base URL | Notes |
|----------|-----------|------------------------|----------|-------|
| GitHub Copilot | OAuth | `@ai-sdk/openai-compatible` | `https://api.githubcopilot.com` | Device flow authentication |
| OpenAI (ChatGPT) | OAuth | `@ai-sdk/openai` | `https://api.openai.com/v1` | ChatGPT Codex backend; Responses API |
| xAI Grok (SuperGrok) | OAuth | `@ai-sdk/xai` | `https://api.x.ai/v1` | Subscription token — carries account risk |
| Claude Code (Anthropic subscription) | OAuth | `@ai-sdk/anthropic` | `https://api.anthropic.com` | Subscription token — carries account risk |
| Antigravity (Google Cloud Code Assist) | OAuth | `@ai-sdk/openai-compatible` | `https://antigravity.google` | Subscription token — carries account risk |

## Cloud credentials (imported or env-configured)

These are `manual-only`: their model lists are not refreshed automatically, and they
are not offered in the interactive add flow.

| Provider | Auth Type | Vercel AI SDK Package | Notes |
|----------|-----------|------------------------|-------|
| Amazon Bedrock | AWS credentials | `@ai-sdk/amazon-bedrock` | Import from OpenCode or configure env auth |
| Azure OpenAI | API Key | `@ai-sdk/azure` | Deployment-specific base URL |
| Google Vertex AI | ADC / gcloud | `@ai-sdk/google-vertex` | Application Default Credentials |

> **Agent Router note**: Registered as `@ai-sdk/anthropic` against `https://agentrouter.org`
> so requests travel the native Anthropic `/v1/messages` path. This is deliberate: the
> gateway's `sensitive_words` content filter runs only on its OpenAI chat/completions relay,
> so the Anthropic path avoids spurious HTTP 500 `sensitive_words_detected` errors from
> client system prompts. The template also carries the `User-Agent: claude-cli/1.0.0 (external, cli)`
> and `x-app: cli` headers the gateway requires, and its signup link is a referral link
> granting $50 in bonus credits.

> **Ollama / LM Studio note**: these are self-hosted, so the add flow asks for your base
> URL rather than assuming the default port, and accepts plaintext `http://` for loopback
> and private-network addresses after an explicit confirmation. No API key is required.
>
> Their context window is a **server** setting, not a model property: Ollama serves
> `num_ctx` — 4096 unless you raise it — and silently truncates anything longer. Anygate
> therefore reports the server's limit rather than a model's trained maximum, since
> over-reporting causes silent truncation that looks like incoherent output instead of an
> error. Export `OLLAMA_CONTEXT_LENGTH` (the same variable `ollama serve` reads) if you
> have raised your server default.
