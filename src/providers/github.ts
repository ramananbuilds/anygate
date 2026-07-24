export function createGithubProvider(apiKey?: string) {
  return {
    id: 'github',
    name: 'GitHub Models',
    npm: '@ai-sdk/openai-compatible',
    baseURL: 'https://models.inference.ai.azure.com',
    apiKey,
  };
}
