# Project Vision & Philosophy

> Route any model into any coding agent.

## Mission

anygate eliminates vendor lock-in for AI coding tools. Developers should be free to use Claude Code, Codex, Gemini CLI, or Antigravity with whichever provider, model, or self-hosted endpoint best fits their needs — without manually hacking configuration files or wrestling with conflicting environment variables.

## Core Design Principles

1. **App-First Interaction**: Users launch their tool of choice (`anygate claude`, `anygate codex`, `anygate gemini`, `anygate antigravity`), and anygate manages protocol compatibility behind the scenes.
2. **Strict Environment Isolation**: Never corrupt global configuration files or persistent shell environments. Strip conflicting env vars for the child process duration only.
3. **Graceful Native Degradation**: Utilize native OS keychains via `@napi-rs/keyring` when available, with automatic fallback to local shell profile exports in headless environments.
4. **Zero-Lockin Standards**: Leverage standard protocol translations (Vercel AI SDK, Anthropic `/v1/messages`, OpenAI Responses API).
