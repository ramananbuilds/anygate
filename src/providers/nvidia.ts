export function createNvidiaProvider(apiKey?: string) {
  return {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    npm: '@ai-sdk/openai-compatible',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey,
  };
}
