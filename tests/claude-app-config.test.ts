import { describe, expect, it } from 'vitest';
import { buildAnygateIConfig } from '../src/claude-desktop/app-config.js';

describe('buildAnygateIConfig', () => {
  it('allows Cowork shell tools to reach external hosts', () => {
    expect(buildAnygateIConfig(54321)).toEqual({
      inferenceProvider: 'gateway',
      inferenceGatewayBaseUrl: 'http://127.0.0.1:54321/anthropic',
      inferenceGatewayApiKey: 'dummy',
      inferenceGatewayAuthScheme: 'bearer',
      coworkEgressAllowedHosts: ['*'],
    });
  });
});
