export function createVertexProvider(project?: string, location?: string) {
  return {
    id: 'vertex',
    name: 'Google Vertex AI',
    npm: '@ai-sdk/google-vertex',
    project: project ?? process.env['GOOGLE_CLOUD_PROJECT'],
    location: location ?? process.env['GOOGLE_CLOUD_LOCATION'] ?? 'us-central1',
  };
}
