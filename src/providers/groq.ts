export function createGroqProvider(apiKey?: string) {
  return {
    id: 'groq',
    name: 'Groq',
    npm: '@ai-sdk/groq',
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey,
  };
}
