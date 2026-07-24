export function createMistralProvider(apiKey?: string) {
  return {
    id: 'mistral',
    name: 'Mistral AI',
    npm: '@ai-sdk/mistral',
    baseURL: 'https://api.mistral.ai/v1',
    apiKey,
  };
}
