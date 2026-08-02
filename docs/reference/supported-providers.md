# Reference: Supported Providers

> Comprehensive list of built-in providers, authentication methods, and SDK packages.

| Provider | Auth Type | Vercel AI SDK Package | Notes |
|----------|-----------|------------------------|-------|
| Anthropic | API Key / None | `@ai-sdk/anthropic` | Native Anthropic `/v1/messages` format |
| OpenCode Zen / Go | OpenCode Key | N/A (Direct Proxy) | Built-in cloud endpoints |
| OpenAI | API Key / OAuth | `@ai-sdk/openai` | Chat Completions & Responses API |
| Google Gemini | API Key | `@ai-sdk/google` | Gemini API |
| Google Vertex AI | ADC / gcloud | `@ai-sdk/google-vertex` | Application Default Credentials |
| Groq | API Key | `@ai-sdk/groq` | Fast Llama/Mistral inference |
| Mistral | API Key | `@ai-sdk/mistral` | Mistral models |
| NVIDIA | API Key | `@ai-sdk/openai` | NVIDIA NIM endpoints |
| Ollama | None / API Key | `ollama-ai-provider` | Local models (default `http://127.0.0.1:11434`) |
| OpenRouter | API Key | `@openrouter/ai-sdk-provider` | Multi-model aggregator |
| Agent Router | API Key | `@ai-sdk/anthropic` | Credit-based multi-model gateway. Registered in Anthropic format (see note below) |
| DeepSeek | API Key | `@ai-sdk/deepseek` | DeepSeek V3 / R1 models |
| Cerebras | API Key | `@ai-sdk/cerebras` | Ultra-fast inference |
| Cohere | API Key | `@ai-sdk/cohere` | Command R / R+ models |
| Together AI | API Key | `@ai-sdk/togetherai` | Open-source model hosting |
| Perplexity | API Key | `@ai-sdk/openai` | Perplexity Sonar search models |
| GitHub Copilot | OAuth | N/A | Device flow authentication |
| xAI (Grok) | OAuth / API Key | `@ai-sdk/xai` | Grok models |
| Custom Endpoint | User Defined | Custom Base URL | OpenAI or Anthropic format |

> **Agent Router note**: Registered as `@ai-sdk/anthropic` against `https://agentrouter.org`
> so requests travel the native Anthropic `/v1/messages` path. This is deliberate: the
> gateway's `sensitive_words` content filter runs only on its OpenAI chat/completions relay,
> so the Anthropic path avoids spurious HTTP 500 `sensitive_words_detected` errors from
> client system prompts. The template also carries the `User-Agent: claude-cli/1.0.0 (external, cli)`
> and `x-app: cli` headers the gateway requires, and its signup link is a referral link
> granting $50 in bonus credits.
