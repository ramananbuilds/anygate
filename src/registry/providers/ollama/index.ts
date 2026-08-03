// Ollama runs locally and speaks the OpenAI-compatible API on /v1, so it routes
// through @ai-sdk/openai-compatible like every other local server — there is no
// `ollama-ai-provider` dependency in this repo. Keep these values in sync with
// src/registry/data/templates/ollama.json, which is what the add flows read.
export const ollamaProviderMeta = {
  id: 'ollama',
  name: 'Ollama',
  brand: 'Ollama',
  defaultBaseUrl: 'http://127.0.0.1:11434/v1',
  npm: '@ai-sdk/openai-compatible',
}
