# 01 — Project Goal

> Route any model into any coding agent — launch tools, switch providers, and run local API gateways.

## The problem anygate solves

Modern AI coding agents each speak their **own** API dialect and expect a **specific** backend:

- Claude Code wants the Anthropic `/v1/messages` surface.
- OpenAI Codex wants the OpenAI Responses / chat-completions shape.
- Gemini CLI wants the Gemini `generateContent` shape.
- Antigravity wants Cloud Code's internal protocol.
- Claude Desktop (Cowork + Code) wants an Anthropic-compatible endpoint.

On top of that, providers are fragmented (Groq, Mistral, Together, OpenRouter,
Vertex, OpenCode Zen/Go…), API keys pile up, and environment variables
**collide** (Vertex AI, Bedrock, AWS, Foundry, stale Anthropic config).

**anygate is the universal adapter.** It presents one consistent surface to every
supported agent and silently translates between that agent's protocol and whichever
provider you actually want to use.

## The vision

1. **One CLI, every agent.** `anygate claude`, `anygate codex`, `anygate gemini`,
   `anygate claude-app`, `anygate codex-app` (alias `chatgpt`), `anygate agy` /
   `antigravity` / `antigravity-ide`, and a headless `--ai` mode — all from one binary.
2. **Any provider behind one surface.** Registry providers (Groq, Mistral, Together,
   OpenRouter, 15+ SDK-backed templates, custom OpenAI/Anthropic-compatible endpoints),
   OpenCode Zen/Go cloud models, one-time OpenCode import, and Google Vertex AI.
3. **Zero-config translation.** Non-Anthropic providers route through the Vercel AI SDK —
   the *single* translation path — so Claude Code still speaks Anthropic format while the
   model behind it is whatever you chose.
4. **Local gateways.** `anygate server` runs a foreground Anthropic-compatible gateway on
   port 17645 that any agent or client can use. The same gateway runs in-process inside
   `anygate ui`'s Server tab.
5. **A visual launcher.** `anygate ui` is a browser dashboard that manages providers and
   launches every supported tool with a point-and-click model picker.
6. **Clean, safe environment isolation.** anygate strips 17 conflicting env vars from the
   child process only, stores secrets in the OS keychain, and never mutates your shell or
   the agent's own settings files without your knowledge.

## Success criteria

- A user can launch **any** supported coding agent against **any** configured provider in
  one command, with no manual translation or env hacking.
- A single `anygate server` instance can serve Claude Code, Claude Desktop, and any
  Anthropic-compatible client simultaneously.
- Switching models mid-session (`/model`) works through a favorites catalog of up to 20 models.
- The project builds cleanly, type-checks, passes its vitest suite, and publishes to npm
  from a release tag.

## Non-goals

- anygate is **not** a model host. It routes inference through services you configure yourself.
- anygate has **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub,
  OpenAI, xAI, or any integrated vendor.
- It does not manage the agent's own config files (e.g. `~/.claude/settings.json`) beyond
  what the agent itself persists.

## Origin note

The project was forked/renamed from a predecessor product. User-facing copy (README,
UI) says "Route any model". The legacy `gateway*` identifiers were removed during the
domain-split restructure; launch messaging now lives in
[src/gateway/server.ts](../src/gateway/server.ts) and provider launch flags in
[src/providers/command.ts](../src/providers/command.ts). `package.json` `description`
still contains the word "Gateway" and is backlog to clean (see [06_CONVENTIONS.md](./06_CONVENTIONS.md)).
