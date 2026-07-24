export function createOpenrouterProvider(apiKey?: string) {
  return {
    id: 'openrouter',
    name: 'OpenRouter',
    npm: '@openrouter/ai-sdk-provider',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  };
}
