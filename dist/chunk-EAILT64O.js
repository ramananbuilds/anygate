#!/usr/bin/env node

// src/core/constants.ts
import { homedir } from "os";
import { join } from "path";

// package.json
var package_default = {
  name: "anygate",
  version: "0.5.8",
  publishConfig: {
    access: "public"
  },
  description: "Route any model into any coding agent \u2014 launch Claude Code, Codex, and more with multi-provider gateways",
  author: "ramananbuilds",
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/ramananbuilds/anygate.git"
  },
  homepage: "https://github.com/ramananbuilds/anygate#readme",
  bugs: {
    url: "https://github.com/ramananbuilds/anygate/issues"
  },
  keywords: [
    "claude",
    "claude-code",
    "codex",
    "ai",
    "llm",
    "cli",
    "gateway",
    "vertex"
  ],
  type: "module",
  bin: {
    anygate: "dist/cli.js"
  },
  files: [
    "dist",
    "README.md"
  ],
  engines: {
    node: ">=18"
  },
  scripts: {
    build: "tsup && npm run ui:build && node scripts/copy-ui-assets.mjs",
    dev: "tsup --watch",
    test: "vitest run",
    "test:watch": "vitest",
    typecheck: "tsc --noEmit",
    "refresh:models-dev": "node scripts/refresh-models-dev-cache.mjs",
    prepublishOnly: `node -e "if (require('./package.json').version !== require('./package-lock.json').version) { console.error('Error: package.json and package-lock.json versions are out of sync! Run npm install to sync.'); process.exit(1); }" && npm run build`,
    "ui:dev": "npm --prefix ui run dev",
    "ui:build": "npm --prefix ui run build"
  },
  dependencies: {
    "@ai-sdk/alibaba": "^1.0.26",
    "@ai-sdk/amazon-bedrock": "^4.0.113",
    "@ai-sdk/azure": "^3.0.70",
    "@ai-sdk/cerebras": "^2.0.54",
    "@ai-sdk/cohere": "^3.0.36",
    "@ai-sdk/deepinfra": "^2.0.52",
    "@ai-sdk/gateway": "^3.0.125",
    "@ai-sdk/google": "^3.0.80",
    "@ai-sdk/google-vertex": "^4.0.142",
    "@ai-sdk/groq": "^3.0.39",
    "@ai-sdk/mistral": "^3.0.37",
    "@ai-sdk/openai": "^3.0.68",
    "@ai-sdk/openai-compatible": "^2.0.48",
    "@ai-sdk/perplexity": "^3.0.33",
    "@ai-sdk/togetherai": "^2.0.53",
    "@ai-sdk/vercel": "^2.0.50",
    "@ai-sdk/xai": "^3.0.93",
    "@clack/prompts": "^0.9.1",
    "@openrouter/ai-sdk-provider": "^2.9.0",
    ai: "^6.0.197",
    "gitlab-ai-provider": "^6.8.0",
    "ipaddr.js": "^2.4.0",
    open: "^11.0.0",
    picocolors: "^1.1.1",
    "smol-toml": "^1.6.1",
    "venice-ai-sdk-provider": "^2.0.2",
    ws: "^8.21.0",
    zod: "^3.25.76"
  },
  devDependencies: {
    "@types/node": "^22.0.0",
    "@types/ws": "^8.18.1",
    "@vitest/coverage-v8": "^2.1.9",
    tsup: "^8.0.0",
    typescript: "^5.5.0",
    vitest: "^2.0.0"
  },
  optionalDependencies: {
    "@napi-rs/keyring": "^1.3.0"
  },
  overrides: {
    ws: "^8.21.0"
  }
};

// src/core/constants.ts
var BACKENDS = {
  zen: {
    id: "zen",
    name: "OpenCode Zen",
    // No /v1 suffix — the Anthropic SDK appends /v1/messages automatically
    baseUrl: "https://opencode.ai/zen"
  },
  go: {
    id: "go",
    name: "OpenCode Go",
    baseUrl: "https://opencode.ai/zen/go"
  }
};
var CODEX_RESPONSES_LITE_WS_URL = "wss://chatgpt.com/backend-api/codex/responses";
var CODEX_RESPONSES_LITE_VERSION = "0.144.1";
var CODEX_RESPONSES_WEBSOCKETS_BETA = "responses_websockets=2026-02-06";
var CONFLICTING_ENV_VARS = [
  "CLAUDE_CODE_USE_VERTEX",
  "ANTHROPIC_VERTEX_PROJECT_ID",
  "ANTHROPIC_VERTEX_BASE_URL",
  "CLOUD_ML_REGION",
  "ANTHROPIC_BEDROCK_BASE_URL",
  "ANTHROPIC_AWS_BASE_URL",
  "ANTHROPIC_AWS_API_KEY",
  "ANTHROPIC_AWS_WORKSPACE_ID",
  "ANTHROPIC_FOUNDRY_API_KEY",
  "ANTHROPIC_FOUNDRY_BASE_URL",
  "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_BASE_URL",
  "ANTHROPIC_MODEL",
  "ANTHROPIC_DEFAULT_OPUS_MODEL",
  "ANTHROPIC_DEFAULT_SONNET_MODEL",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL"
];
var OPENCODE_CACHE_PATH = join(homedir(), ".cache", "opencode", "models.json");
var MAX_MODEL_CATALOG = 20;
var GATEWAY_PORT = 17645;
var VERTEX_ANTHROPIC_NPM = "@ai-sdk/google-vertex/anthropic";
function classifyModelFormat(modelId, providerNpm) {
  if (providerNpm === "@ai-sdk/anthropic") return "anthropic";
  if (providerNpm === "@ai-sdk/openai") return "unsupported";
  if (providerNpm === "@ai-sdk/google") return "unsupported";
  const lower = modelId.toLowerCase();
  if (lower.startsWith("claude-")) return "anthropic";
  if (lower.startsWith("gpt-")) return "unsupported";
  if (lower.startsWith("gemini-")) return "unsupported";
  return "openai";
}
var VERSION = package_default.version;

export {
  BACKENDS,
  CODEX_RESPONSES_LITE_WS_URL,
  CODEX_RESPONSES_LITE_VERSION,
  CODEX_RESPONSES_WEBSOCKETS_BETA,
  CONFLICTING_ENV_VARS,
  OPENCODE_CACHE_PATH,
  MAX_MODEL_CATALOG,
  GATEWAY_PORT,
  VERTEX_ANTHROPIC_NPM,
  classifyModelFormat,
  VERSION
};
//# sourceMappingURL=chunk-EAILT64O.js.map