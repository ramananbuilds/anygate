export function createOllamaProvider(baseURL: string = 'http://127.0.0.1:11434') {
  return {
    id: 'ollama',
    name: 'Ollama (Local)',
    npm: 'ollama-ai-provider',
    baseURL,
  };
}
