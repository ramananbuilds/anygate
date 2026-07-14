# 08 — Extending

How to add features, providers, backends, and SDK providers to **anygate**.
Read [06_CONVENTIONS.md](./06_CONVENTIONS.md) first.

---

## 1. Add a provider template

1. Extend [src/provider-templates.ts](../src/provider-templates.ts) with a new template
   entry (name, `npm`, auth type, model list / discovery URL).
2. Register it as a builtin in [src/registry/builtins.ts](../src/registry/builtins.ts)
   and wire add-template flow in [src/registry/add-template.ts](../src/registry/add-template.ts).
3. If the provider exposes a model-list endpoint, add fetch logic in
   [src/registry/fetch-template-models.ts](../src/registry/fetch-template-models.ts).
4. Add pricing rows in [src/registry/pricing.ts](../src/registry/pricing.ts) if known.

---

## 2. Add a backend

1. Update `BACKENDS` in [src/constants.ts](../src/constants.ts).
2. Add the new id to the `BackendConfig` id union in [src/types.ts](../src/types.ts).
3. Update the subscription-tier logic in `prompts.ts` and `cli.ts`.

> [!CAUTION]
> `BACKENDS.baseUrl` must **NOT** include `/v1` — the Anthropic SDK appends it.

---

## 3. Add a new SDK provider

1. Add its `@ai-sdk/*` (or equivalent) package to `dependencies` in
   [package.json](../package.json).
2. Add the package to the `external` list in [tsup.config.ts](../tsup.config.ts) so it
   resolves from `node_modules` at runtime.
3. `provider-factory.ts` discovers the `create*` factory dynamically via `import(npm)` —
   usually no code change is needed unless it needs a Responses-API or custom base-URL branch
   (see `modelPrefersResponsesApi` and the openai-compatible/openrouter branches).

If a model requires the OpenAI Responses API, ensure `modelPrefersResponsesApi` returns
`true` for it (see [04_DATA_FLOW.md](./04_DATA_FLOW.md) §3).

---

## 4. Add a new agent target

1. Add a `StarterCommand` variant in [src/types.ts](../src/types.ts).
2. Add dispatch in [src/cli.ts](../src/cli.ts).
3. Create the launch/route modules (see [src/codex](../src/codex),
   [src/gemini](../src/gemini), [src/claude-desktop](../src/claude-desktop) for patterns).
4. Use the canonical `resolveLocalProviderApiKey()` helper for credentials — do NOT copy
   the divergent logic from `codex.ts`/`codex-app.ts`/`claude-app.ts`/`favorites-resolver.ts`.

---

## 5. Model format classification

`classifyModelFormat(modelId, providerNpm)` in [src/constants.ts](../src/constants.ts):

- `providerNpm === '@ai-sdk/anthropic'` → `'anthropic'` (direct passthrough)
- `@ai-sdk/openai'` or `gpt-*` → `'unsupported'` in the **cloud OpenCode wizard**
  (use the local OpenAI provider instead). Same for `@ai-sdk/google'` / `gemini-*`.
- everything else → `'openai'` (routed through the SDK adapter via the local proxy)

`sourceBackend` is set from the backend that was queried — critical for `go` tier which
shows Zen free models + Go paid models in one list.

---

## 6. Release process

- `.github/workflows/publish.yml` publishes to npm on a release/tag.
- `prepublishOnly` blocks publish unless `package.json` and `package-lock.json` versions match.
- Maintain [CHANGELOG.md](../CHANGELOG.md) manually on every version bump.
- Keep `tests/ai-doc.test.ts` green (it asserts `npm install -g anygate` is documented).

---

## 7. Known limitations to design around

- Codex cost display is inaccurate for non-Anthropic models (Codex applies its own pricing).
- OAuth-only providers (no stored key) are silently skipped by discovery.
- In gateway-discovery mode, the displayed context window reflects the **launch** model, not
  the live `/model` switch.
- Mistral free tier has tight 429 rate limits during tool-heavy sessions.

---

## 8. Disclaimer

anygate has **no affiliation** with OpenCode, Anthropic, Claude, Google, GitHub, OpenAI,
xAI, or any integrated vendor. It routes inference through services you configure yourself.
Use at your own risk.
