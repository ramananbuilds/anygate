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
| DeepSeek | API Key | `@ai-sdk/deepseek` | DeepSeek V3 / R1 models |
| Cerebras | API Key | `@ai-sdk/cerebras` | Ultra-fast inference |
| Cohere | API Key | `@ai-sdk/cohere` | Command R / R+ models |
| Together AI | API Key | `@ai-sdk/togetherai` | Open-source model hosting |
| Perplexity | API Key | `@ai-sdk/openai` | Perplexity Sonar search models |
| GitHub Copilot | OAuth | N/A | Device flow authentication |
| xAI (Grok) | OAuth / API Key | `@ai-sdk/xai` | Grok models |
| Custom Endpoint | User Defined | Custom Base URL | OpenAI or Anthropic format |
