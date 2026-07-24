export interface OpenAiProviderOptions {
  apiKey?: string;
  baseURL?: string;
}

export function createOpenAiProvider(options: OpenAiProviderOptions = {}) {
  return {
    id: 'openai',
    name: 'OpenAI',
    npm: '@ai-sdk/openai',
    baseURL: options.baseURL ?? 'https://api.openai.com/v1',
    apiKey: options.apiKey,
  };
}
