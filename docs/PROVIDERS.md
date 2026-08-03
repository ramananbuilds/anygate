# Provider Configuration Guide

`anygate` uses a Native Provider Registry to store configuration and API keys securely in your OS keychain. This guide outlines all available providers, what they do, and common gotchas (like multiple variants of the same provider).

## Native Providers

When you run `anygate providers add`, you can select from the following templates. The CLI automatically configures the correct endpoint format (`@ai-sdk/openai-compatible` vs specific SDKs) and fetches available models.

### Anthropic
- **Description**: The official Anthropic API for Claude models.
- **Base URL**: `https://api.anthropic.com`
- **Known Issues**: None. Highly recommended for standard Claude access.

### OpenAI
- **Description**: The official OpenAI API for GPT models, o-series reasoning models, and Codex.
- **Base URL**: `https://api.openai.com/v1`

### Google Gemini
- **Description**: The official Google Generative Language API for Gemini models.
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/openai`

### Groq
- **Description**: Ultra-fast inference API hosting open-weight models (Llama, Mixtral).
- **Base URL**: `https://api.groq.com/openai/v1`

### Mistral
- **Description**: Official API for Mistral models.
- **Base URL**: `https://api.mistral.ai/v1`
- **Gotchas / Known Issues**: Mistral's free tier has strict API rate limits (HTTP 429). Tool-heavy coding sessions can burn through your quota very quickly due to parallel requests.

### Together AI
- **Description**: Platform for training, fine-tuning, and running open-source models.
- **Base URL**: `https://api.together.xyz/v1`

### Cerebras
- **Description**: High-speed AI inference platform powered by wafer-scale chips.
- **Base URL**: `https://api.cerebras.ai/v1`

### DeepInfra
- **Description**: Serverless inference for top open-source models.
- **Base URL**: `https://api.deepinfra.com/v1/openai`

### DeepSeek
- **Description**: API for DeepSeek's coding and chat models.
- **Base URL**: `https://api.deepseek.com/v1`

### Zhipu AI (GLM)
- **Description**: Chinese provider hosting the GLM model family.
- **Base URL**: `https://open.bigmodel.cn/api/paas/v4`

### Alibaba DashScope
- **Description**: Alibaba's model-as-a-service platform for Qwen and other models.
- **Base URL**: `https://dashscope.aliyuncs.com/compatible-mode/v1`

### xAI
- **Description**: API for Grok models.
- **Base URL**: `https://api.x.ai/v1`

### Perplexity
- **Description**: API for Perplexity's online models (Sonar).
- **Base URL**: `https://api.perplexity.ai`

### Cohere
- **Description**: API for Command models.
- **Base URL**: `https://api.cohere.com/compatibility/v1`

### OpenRouter
- **Description**: Unified API proxy providing access to dozens of different models.
- **Base URL**: `https://openrouter.ai/api/v1`

### Agent Router
- **Description**: Credit-based multi-model gateway (Claude, GPT, Gemini) behind one key.
- **Base URL**: `https://agentrouter.org`
- **Wire format**: Registered against `@ai-sdk/anthropic`, so requests go out as native Anthropic `/v1/messages`. This is deliberate — the gateway's content-moderation filter only scans its OpenAI `/v1/chat/completions` relay, so the OpenAI path returns HTTP 500 `sensitive_words_detected` on prompts that merely *mention* moderated topics (Claude Desktop's own system prompt trips it). The Anthropic path is not scanned. Serves the Claude launchers and Antigravity.
- **Gotchas**: The gateway rejects unrecognized clients with `401 unauthorized client detected`, so the template ships `User-Agent` and `x-app` headers. The signup link is a referral link that grants $50 in bonus credits over registering directly; this is disclosed in the CLI and dashboard.

### Local Models (Ollama & LM Studio)
- **Description**: Connects to locally running inference engines. Both are registered against `@ai-sdk/openai-compatible` and talk to the server's OpenAI-compatible `/v1` path.
- **Base URLs**: Both templates carry a `urlPrompt`, so the CLI and the dashboard ask for your own URL instead of assuming the default port (`http://127.0.0.1:11434/v1` for Ollama, `http://127.0.0.1:1234/v1` for LM Studio). Plaintext `http://` is accepted for loopback and private-network addresses after an explicit confirmation; anything else is rejected by the SSRF guard in `src/registry/validation/url-security.ts`.
- **API key**: Optional — leave it blank for a local server without auth. These providers materialize into the launchers with no stored credential at all, so you do not need a placeholder key.
- **Context window**: A **server** setting, not a model property. Ollama serves `num_ctx` — 4096 unless you raised it — and silently truncates anything longer, so anygate reports the server's limit rather than the model's trained maximum. Reporting `llama3.1:8b` as 131K against a 4096-token server produces truncation that reads as incoherent output instead of an error. Export `OLLAMA_CONTEXT_LENGTH` (the same variable `ollama serve` reads) if you have raised your server default.

---

## The Moonshot / Kimi Confusion

Moonshot AI has split their product into three separate platforms. They all share the "Kimi" name, but they use different billing systems, different base URLs, and their API keys **are not interchangeable**.

If you use the wrong provider template for your key, you will receive a `401 Invalid Authentication` or `Incorrect API key` error.

### 1. Moonshot (Kimi)
- **Platform**: Chinese Domestic Developer Platform (`platform.moonshot.cn`)
- **Base URL**: `https://api.moonshot.cn/v1`
- **Description**: The standard, pay-as-you-go developer platform for users in China. It provides access to the standard `moonshot-v1` models.

### 2. Moonshot Global (kimi.ai)
- **Platform**: Global Developer Platform (`platform.kimi.ai`)
- **Base URL**: `https://api.moonshot.ai/v1`
- **Description**: The standard, pay-as-you-go developer platform for international users. **Crucially**, the global platform also grants access to `kimi-k2.7-code` directly through the standard API, bypassing the need for a separate coding subscription. If you generated a key at `platform.kimi.ai`, use this provider!

### 3. Kimi Code (Subscription Required)
- **Platform**: Kimi Code Subscription Console (`www.kimi.com/code/console`)
- **Base URL**: `https://api.kimi.com/coding/v1`
- **Description**: A standalone monthly subscription product specifically geared towards coding agents. If you bought a monthly "Kimi Plus" or "Kimi Code" subscription, you must generate your API key directly from the coding console, and select this provider in `anygate`.

---

## Unsupported / Advanced Providers

- **Amazon Bedrock**: Currently requires AWS credentials rather than a simple API key. Use OpenCode's setup and then run `anygate providers import`.
- **Azure OpenAI**: Requires specific deployment URLs per model. Use OpenCode's setup and run `anygate providers import`.
- **Google Vertex AI**: Handled dynamically using `gcloud` Application Default Credentials via `anygate server --vertex`. No API key configuration is required in the registry.
