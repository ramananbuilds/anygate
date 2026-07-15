import { describe, it, expect } from 'vitest';
import {
  buildGateCatalogEntry,
  injectGatewayModels,
  planGateCatalogSlots,
  resolveGateCatalogSlots,
  buildAntigravityRoutes,
  buildListModelConfigsResponse,
  buildListExperimentsResponse,
  GATEWAY_CASCADE_PLAN_MODEL,
  GATEWAY_AGENT_PLACEHOLDER,
  GATEWAY_CASCADE_ANCHOR_ID,
  GATEWAY_CASCADE_FALLBACK_ID,
  GATEWAY_CASCADE_PLAN_ANCHOR_ID,
  type AntigravityRoute,
  type CatalogFixture,
} from '../src/gateway/antigravity/catalog.js';
import catalogFixtureRaw from '../src/gateway/antigravity/fixtures/fetchAvailableModels.json' with { type: 'json' };

// Minimal fixture derived from the captured Antigravity IDE 2.1.1 catalog shape.
const fixture: CatalogFixture = {
  models: {
    'gemini-3.5-flash-low': {
      displayName: 'Gemini 3.5 Flash (Medium)',
      model: 'MODEL_PLACEHOLDER_M20',
      apiProvider: 'API_PROVIDER_GOOGLE_GEMINI',
      modelProvider: 'MODEL_PROVIDER_GOOGLE',
      maxTokens: 1048576,
      maxOutputTokens: 65536,
      tokenizerType: 'LLAMA_WITH_SPECIAL',
      quotaInfo: { remainingFraction: 1, resetTime: '2026-06-23T02:00:57Z' },
    },
    'gemini-3-flash-agent': {
      displayName: 'Gemini 3.5 Flash (High)',
      model: 'MODEL_PLACEHOLDER_M132',
      apiProvider: 'API_PROVIDER_GOOGLE_GEMINI',
      modelProvider: 'MODEL_PROVIDER_GOOGLE',
      recommended: true,
      maxTokens: 1048576,
      maxOutputTokens: 65536,
      tokenizerType: 'LLAMA_WITH_SPECIAL',
      quotaInfo: { remainingFraction: 1, resetTime: '2026-06-23T02:00:57Z' },
    },
    'claude-sonnet-4-6': {
      displayName: 'Claude Sonnet 4.6 (Thinking)',
      model: 'MODEL_PLACEHOLDER_M35',
      apiProvider: 'API_PROVIDER_ANTHROPIC_VERTEX',
      modelProvider: 'MODEL_PROVIDER_ANTHROPIC',
      supportsImages: true,
      supportsThinking: true,
      thinkingBudget: 1024,
      maxTokens: 250000,
      maxOutputTokens: 64000,
      tokenizerType: 'LLAMA_WITH_SPECIAL',
      quotaInfo: { remainingFraction: 0.15, resetTime: '2026-06-26T16:48:02Z' },
    },
  },
  defaultAgentModelId: 'gemini-3.5-flash-low',
  agentModelSorts: [
    {
      displayName: 'Recommended',
      groups: [
        {
          modelIds: ['gemini-3.5-flash-low', 'claude-sonnet-4-6'],
        },
      ],
    },
  ],
};

const routes: AntigravityRoute[] = [
  {
    catalogId: 'anygate__zen__deepseek-v4-flash-free',
    providerId: 'zen',
    providerName: 'OpenCode Zen',
    modelId: 'deepseek-v4-flash-free',
    upstreamModelId: 'deepseek-v4-flash-free',
    displayName: 'DeepSeek V4 Flash (anygate)',
    npm: '@ai-sdk/openai-compatible',
    apiKey: 'secret-key-123',
    baseURL: 'https://api.example.com',
    contextWindow: 128000,
  },
  {
    catalogId: 'anygate__groq__llama-3.3-70b',
    providerId: 'groq',
    providerName: 'Groq',
    modelId: 'llama-3.3-70b',
    upstreamModelId: 'llama-3.3-70b',
    displayName: 'Llama 3.3 70B (anygate)',
    npm: '@ai-sdk/openai-compatible',
    apiKey: 'another-secret-key',
    baseURL: 'https://api.groq.com',
    contextWindow: 32768,
  },
];

describe('antigravity catalog', () => {
  it('keeps the checked-in fixture aligned with Antigravity IDE 2.1.1 model enums', () => {
    const fixture = catalogFixtureRaw as CatalogFixture;
    expect(Object.keys(fixture.models)).toHaveLength(20);
    expect(fixture.defaultAgentModelId).toBe('gemini-3.5-flash-low');
    expect(fixture.models['gemini-3.5-flash-low']?.model).toBe('MODEL_PLACEHOLDER_M20');
    expect(fixture.models['gemini-3-flash-agent']?.model).toBe('MODEL_PLACEHOLDER_M132');
    expect(fixture.models['claude-sonnet-4-6']?.vertexModelId).toBe('claude-sonnet-4-6@default');
    expect(fixture.models['gpt-oss-120b-medium']?.vertexModelId).toBe('openai/gpt-oss-120b-maas');
  });

  it('builds a gateway catalog entry by cloning a template', () => {
    const entry = buildGateCatalogEntry(
      routes[0]!,
      fixture.models['gemini-3.5-flash-low']!,
    );
    expect(entry.displayName).toBe('DeepSeek V4 Flash (anygate)');
    expect(entry.model).toBe(GATEWAY_AGENT_PLACEHOLDER);
    expect(entry.requestedModelId).toBe('anygate__zen__deepseek-v4-flash-free');
    expect(entry.apiProvider).toBe('API_PROVIDER_GOOGLE_GEMINI'); // cloned
    expect(entry.modelVersion).toBe('anygate__zen__deepseek-v4-flash-free');
    expect(entry.modelVersionId).toBe('anygate__zen__deepseek-v4-flash-free');
    expect(entry.maxTokens).toBe(128000);
    expect(entry.maxOutputTokens).toBe(65536);
    expect(entry.quotaInfo).toEqual({ remainingFraction: 1, resetTime: '2026-06-23T02:00:57Z' });
  });

  it('adds a cascade checkpointer bounded by the gateway model context window', () => {
    const entry = buildGateCatalogEntry(
      routes[0]!,
      fixture.models['gemini-3.5-flash-low']!,
    );
    expect(entry.modelExperiments).toBeDefined();
    const experiments = (entry.modelExperiments as {
      experiments: Record<string, { stringValue: string }>;
    }).experiments;
    const config = JSON.parse(experiments.CASCADE_USE_EXPERIMENT_CHECKPOINTER!.stringValue);
    expect(config.max_token_limit).toBe('62464');
    expect(config.token_threshold).toBe('46848');
    expect(config.enabled).toBe(true);
  });

  it('caps large gateway contexts to the planner-safe 128K checkpoint budget', () => {
    const entry = buildGateCatalogEntry(
      { ...routes[0]!, contextWindow: 1000000 },
      fixture.models['gemini-3.5-flash-low']!,
    );
    const modelExperiments = entry.modelExperiments as {
      experiments: Record<string, { stringValue: string }>;
    };
    const config = JSON.parse(
      modelExperiments.experiments.CASCADE_USE_EXPERIMENT_CHECKPOINTER!.stringValue,
    );
    expect(config.max_token_limit).toBe('128000');
  });

  it('injects gateway models into the catalog', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(result.models['anygate__zen__deepseek-v4-flash-free']).toBeDefined();
    expect(result.models['anygate__groq__llama-3.3-70b']).toBeDefined();
    expect(result.models['anygate__zen__deepseek-v4-flash-free']!.displayName).toBe('DeepSeek V4 Flash (anygate)');
  });

  it('preserves the native registry while keeping helper anchors out of the picker', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(result.models[GATEWAY_CASCADE_ANCHOR_ID]).toBeDefined();
    expect(result.models[GATEWAY_CASCADE_FALLBACK_ID]).toBeDefined();
    expect(result.models['gemini-2.5-flash']).toBeDefined();
    expect(result.models[GATEWAY_CASCADE_PLAN_ANCHOR_ID]).toBeDefined();
    expect(result.models['claude-sonnet-4-6']).toBeDefined();
    expect(result.models['anygate__zen__deepseek-v4-flash-free']).toBeDefined();
    expect(result.models['anygate__groq__llama-3.3-70b']).toBeDefined();
    const modelIds = result.agentModelSorts[0]!.groups[0]!.modelIds;
    expect(modelIds).not.toContain(GATEWAY_CASCADE_FALLBACK_ID);
    expect(modelIds).not.toContain('gemini-2.5-flash');
    expect(modelIds).not.toContain(GATEWAY_CASCADE_PLAN_ANCHOR_ID);
    expect(modelIds).toContain(GATEWAY_CASCADE_ANCHOR_ID);
    expect(modelIds).toContain('claude-sonnet-4-6');
    expect(modelIds).not.toContain('anygate__groq__llama-3.3-70b');
  });

  it('preserves the current gemini-3-flash-agent M132 anchor model', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    const planAnchor = result.models[GATEWAY_CASCADE_PLAN_ANCHOR_ID];
    expect(planAnchor).toBeDefined();
    expect(planAnchor!.model).toBe('MODEL_PLACEHOLDER_M132');
    expect(planAnchor!.displayName).toBe('Gemini 3.5 Flash (High)');
  });

  it('uses native Antigravity slots for launch and model switching', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    const group = result.agentModelSorts[0]!.groups[0]!;
    expect(group.modelIds).toEqual([
      GATEWAY_CASCADE_ANCHOR_ID,
      'claude-sonnet-4-6',
    ]);
    expect(result.models[GATEWAY_CASCADE_ANCHOR_ID]!.displayName).toBe('DeepSeek V4 Flash (anygate)');
    expect(result.models['claude-sonnet-4-6']!.displayName).toBe('Llama 3.3 70B (anygate)');
    expect(result.models['anygate__zen__deepseek-v4-flash-free']!.model).toBe(GATEWAY_AGENT_PLACEHOLDER);
    expect(result.models['anygate__groq__llama-3.3-70b']!.model).not.toBe(GATEWAY_AGENT_PLACEHOLDER);
  });

  it('resolves native picker slots back to gateway routes', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(resolveGateCatalogSlots(result, routes, 'gemini-3.5-flash-low')).toEqual([
      { slotId: GATEWAY_CASCADE_ANCHOR_ID, route: routes[0] },
      { slotId: 'claude-sonnet-4-6', route: routes[1] },
    ]);
  });

  it('bounds the native M20 anchor checkpointer to the selected gateway context', () => {
    const result = injectGatewayModels(
      catalogFixtureRaw as CatalogFixture,
      [{ ...routes[0]!, contextWindow: 200000 }],
      'gemini-3.5-flash-low',
    );
    const modelExperiments = result.models[GATEWAY_CASCADE_ANCHOR_ID]!.modelExperiments as {
      experiments: Record<string, { stringValue: string }>;
    };
    const config = JSON.parse(
      modelExperiments.experiments.CASCADE_USE_EXPERIMENT_CHECKPOINTER!.stringValue,
    );
    expect(result.models[GATEWAY_CASCADE_ANCHOR_ID]!.maxTokens).toBe(200000);
    expect(result.models[GATEWAY_CASCADE_ANCHOR_ID]!.maxOutputTokens).toBe(65536);
    expect(config.max_token_limit).toBe('128000');
    expect(config.token_threshold).toBe('50000');
  });

  it('does not leak provider API keys in serialized output', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('secret-key-123');
    expect(serialized).not.toContain('another-secret-key');
  });

  it('does not leak provider base URLs in serialized output', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('api.example.com');
    expect(serialized).not.toContain('api.groq.com');
  });

  it('rejects catalog ID collisions', () => {
    const dupRoutes: AntigravityRoute[] = [
      routes[0]!,
      { ...routes[0]! }, // same catalogId
    ];
    expect(() => injectGatewayModels(fixture, dupRoutes, 'gemini-3.5-flash-low')).toThrow(/collision/i);
  });

  it('skips duplicate routes', () => {
    const dupRoutes: AntigravityRoute[] = [
      routes[0]!,
      { ...routes[0]!, displayName: 'Duplicate' },
    ];
    // Same catalogId = collision, should throw
    expect(() => injectGatewayModels(fixture, dupRoutes, 'gemini-3.5-flash-low')).toThrow();
  });

  it('handles empty routes gracefully', () => {
    const result = injectGatewayModels(fixture, [], 'gemini-3.5-flash-low');
    expect(result.agentModelSorts[0]!.groups[0]!.modelIds).toEqual([
      'gemini-3.5-flash-low',
      'claude-sonnet-4-6',
    ]);
  });

  it('sets defaultAgentModelId to the native M20 launch anchor', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(result.defaultAgentModelId).toBe(GATEWAY_CASCADE_ANCHOR_ID);
  });

  it('retains the hidden Flash Lite cascade fallback required by agy', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(result.models['gemini-2.5-flash-lite']).toMatchObject({
      model: 'MODEL_GOOGLE_GEMINI_2_5_FLASH_LITE',
      apiProvider: 'API_PROVIDER_GOOGLE_GEMINI',
      modelProvider: 'MODEL_PROVIDER_GOOGLE',
    });
    expect(result.agentModelSorts[0]?.groups[0]?.modelIds)
      .not.toContain('gemini-2.5-flash-lite');
  });

  it('retains the hidden Flash intent model required by agy', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    expect(result.models['gemini-2.5-flash']).toMatchObject({
      model: 'MODEL_GOOGLE_GEMINI_2_5_FLASH',
      apiProvider: 'API_PROVIDER_GOOGLE_GEMINI',
      modelProvider: 'MODEL_PROVIDER_GOOGLE',
    });
    expect(result.agentModelSorts[0]?.groups[0]?.modelIds)
      .not.toContain('gemini-2.5-flash');
  });

  it('gives hidden cascade models a nonzero checkpointer limit', () => {
    const result = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    for (const modelId of ['gemini-2.5-flash-lite', 'gemini-2.5-flash']) {
      expect(result.models[modelId]!.modelExperiments).toBeDefined();
      const modelExperiments = result.models[modelId]!.modelExperiments as {
        experiments: Record<string, { stringValue: string }>;
      };
      const config = JSON.parse(
        modelExperiments.experiments.CASCADE_USE_EXPERIMENT_CHECKPOINTER!.stringValue,
      );
      expect(config.max_token_limit).toBe('128000');
      expect(config.enabled).toBe(true);
    }
  });

  it('builds listExperiments using the current numeric experimentIds format', () => {
    const response = buildListExperimentsResponse();
    expect(response).not.toHaveProperty('experiments');
    const experimentIds = response.experimentIds as number[];
    expect(experimentIds.length).toBeGreaterThan(50);
    expect(experimentIds.every(id => Number.isInteger(id))).toBe(true);
    expect(experimentIds).toContain(105979552);
    expect(experimentIds).toContain(106121604);
  });

  it('builds listModelConfigs for every selectable gateway route', () => {
    const catalog = injectGatewayModels(fixture, routes, 'gemini-3.5-flash-low');
    const response = buildListModelConfigsResponse(routes, catalog);
    expect(response.allowedModelConfigs).toEqual([
      { requestedModelId: GATEWAY_CASCADE_ANCHOR_ID, planModel: GATEWAY_CASCADE_PLAN_MODEL, requestedModel: GATEWAY_AGENT_PLACEHOLDER },
      {
        requestedModelId: 'claude-sonnet-4-6',
        planModel: GATEWAY_CASCADE_PLAN_MODEL,
        requestedModel: catalog.models['claude-sonnet-4-6']!.model,
      },
    ]);
    expect(response.defaultAgentModelConfig).toEqual({
      requestedModelId: GATEWAY_CASCADE_ANCHOR_ID,
      planModel: GATEWAY_CASCADE_PLAN_MODEL,
      requestedModel: GATEWAY_AGENT_PLACEHOLDER,
    });
    expect(response.clientModelConfigs).toMatchObject([
      {
        label: 'DeepSeek V4 Flash (anygate)',
        modelOrAlias: {
          alias: GATEWAY_CASCADE_ANCHOR_ID,
          choice: { case: 'alias', value: GATEWAY_CASCADE_ANCHOR_ID },
        },
        disabled: false,
      },
      {
        label: 'Llama 3.3 70B (anygate)',
        modelOrAlias: {
          alias: 'claude-sonnet-4-6',
          choice: { case: 'alias', value: 'claude-sonnet-4-6' },
        },
        disabled: false,
      },
    ]);
    expect(response.clientModelSorts).toEqual([
      {
        name: 'Recommended',
        groups: [
          {
            groupName: '',
            modelLabels: [
              'DeepSeek V4 Flash (anygate)',
              'Llama 3.3 70B (anygate)',
            ],
          },
        ],
      },
    ]);
  });

  it('plans only validated native AGY slots and reports skipped gateway routes', () => {
    const manyRoutes = Array.from({ length: 25 }, (_, i) => ({
      ...routes[0]!,
      catalogId: `anygate__zen__model-${i}`,
      modelId: `model-${i}`,
      upstreamModelId: `model-${i}`,
      displayName: `Model ${i} (anygate)`,
    }));

    const plan = planGateCatalogSlots(
      catalogFixtureRaw as CatalogFixture,
      manyRoutes,
      'gemini-3.5-flash-low',
    );

    expect(plan.slots.map(slot => slot.slotId)).toEqual([
      'gemini-3.5-flash-low',
      'gemini-3.5-flash-extra-low',
      'gemini-3.1-pro-low',
      'gemini-pro-agent',
      'claude-sonnet-4-6',
      'claude-opus-4-6-thinking',
      'gpt-oss-120b-medium',
    ]);
    expect(plan.switchableRoutes).toHaveLength(7);
    expect(plan.skippedRoutes).toHaveLength(18);
    expect(plan.skippedRoutes[0]!.catalogId).toBe('anygate__zen__model-7');
  });

  it('caps visible picker and model config entries to validated AGY switch slots', () => {
    const manyRoutes = Array.from({ length: 25 }, (_, i) => ({
      ...routes[0]!,
      catalogId: `anygate__zen__model-${i}`,
      modelId: `model-${i}`,
      upstreamModelId: `model-${i}`,
      displayName: `Model ${i} (anygate)`,
    }));

    const catalog = injectGatewayModels(catalogFixtureRaw as CatalogFixture, manyRoutes, 'gemini-3.5-flash-low');
    const configs = buildListModelConfigsResponse(manyRoutes, catalog);

    expect(catalog.agentModelSorts[0]!.groups[0]!.modelIds).toEqual([
      'gemini-3.5-flash-low',
      'gemini-3.5-flash-extra-low',
      'gemini-3.1-pro-low',
      'gemini-pro-agent',
      'claude-sonnet-4-6',
      'claude-opus-4-6-thinking',
      'gpt-oss-120b-medium',
    ]);
    expect(catalog.agentModelSorts[0]!.groups[0]!.modelIds)
      .not.toContain('anygate__zen__model-7');
    expect(catalog.models['anygate__zen__model-6']).toBeDefined();
    expect(catalog.models['anygate__zen__model-7']).toBeUndefined();
    expect((configs.allowedModelConfigs as unknown[])).toHaveLength(7);
    expect((configs.clientModelConfigs as unknown[])).toHaveLength(7);
    expect(((configs.clientModelSorts as any[])[0].groups[0].modelLabels as string[])).toHaveLength(7);
  });

  it('uses unique route labels consistently for duplicate dropdown model names', () => {
    const duplicateRoutes = buildAntigravityRoutes([
      {
        providerId: 'xai-oauth',
        providerName: 'xAI SuperGrok',
        authType: 'oauth',
        oauthAccountId: 'acct-123',
        model: {
          id: 'grok-4.3',
          name: 'Grok 4.3',
          upstreamModelId: 'grok-4.3',
          npm: '@ai-sdk/xai',
        },
        apiKey: 'oauth-token',
      },
      {
        providerId: 'xai',
        providerName: 'xAI API',
        authType: 'api',
        model: {
          id: 'grok-4.3',
          name: 'Grok 4.3',
          upstreamModelId: 'grok-4.3',
          npm: '@ai-sdk/xai',
        },
        apiKey: 'api-key',
      },
    ] as any[]);
    const catalog = injectGatewayModels(fixture, duplicateRoutes, 'gemini-3.5-flash-low');
    const configs = buildListModelConfigsResponse(duplicateRoutes, catalog);

    expect(catalog.models[GATEWAY_CASCADE_ANCHOR_ID]!.displayName).toBe('Grok 4.3 (anygate - xAI SuperGrok)');
    expect(catalog.models['claude-sonnet-4-6']!.displayName).toBe('Grok 4.3 (anygate - xAI API)');
    expect((configs.clientModelConfigs as any[]).map(config => config.label)).toEqual([
      'Grok 4.3 (anygate - xAI SuperGrok)',
      'Grok 4.3 (anygate - xAI API)',
    ]);
  });

  it('preserves unknown fields from the fixture', () => {
    const fixtureWithExtra: CatalogFixture = {
      ...fixture,
      commandModelIds: ['gemini-3.5-flash-low'],
      tabModelIds: ['chat_20706'],
      experimentIds: ['exp1'],
    };
    const result = injectGatewayModels(fixtureWithExtra, routes, 'gemini-3.5-flash-low');
    expect(result.commandModelIds).toEqual(['gemini-3.5-flash-low']);
    expect(result.tabModelIds).toEqual(['chat_20706']);
    expect(result.experimentIds).toEqual(['exp1']);
  });
});

describe('antigravity route resolution', () => {
  it('builds antigravity routes from resolved favorites', () => {
    const favorites = [
      {
        providerId: 'zen',
        providerName: 'OpenCode Zen',
        model: { id: 'deepseek-v4-flash-free', name: 'DeepSeek' },
        apiKey: 'key-1',
      },
      {
        providerId: 'groq',
        providerName: 'Groq',
        model: { id: 'llama-3.3-70b', name: 'Llama' },
        apiKey: 'key-2',
      },
    ] as any[];

    const result = buildAntigravityRoutes(favorites);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      catalogId: 'anygate__zen__deepseek-v4-flash-free',
      providerId: 'zen',
      providerName: 'OpenCode Zen',
      modelId: 'deepseek-v4-flash-free',
      upstreamModelId: 'deepseek-v4-flash-free',
      displayName: 'DeepSeek (anygate)',
      npm: '@ai-sdk/openai-compatible',
      apiKey: 'key-1',
      baseURL: undefined,
      contextWindow: undefined,
    });
  });

  it('keeps same-named OAuth and API-key models as separate AGY routes', () => {
    const result = buildAntigravityRoutes([
      {
        providerId: 'xai-oauth',
        providerName: 'xAI SuperGrok',
        authType: 'oauth',
        oauthAccountId: 'acct-123',
        model: {
          id: 'grok-4.3',
          name: 'Grok 4.3',
          upstreamModelId: 'grok-4.3',
          npm: '@ai-sdk/xai',
        },
        apiKey: 'oauth-token',
      },
      {
        providerId: 'xai',
        providerName: 'xAI API',
        authType: 'api',
        model: {
          id: 'grok-4.3',
          name: 'Grok 4.3',
          upstreamModelId: 'grok-4.3',
          npm: '@ai-sdk/xai',
        },
        apiKey: 'api-key',
      },
    ] as any[]);

    expect(result).toMatchObject([
      {
        catalogId: 'anygate__xai-oauth__grok-4.3',
        providerId: 'xai-oauth',
        displayName: 'Grok 4.3 (anygate - xAI SuperGrok)',
        apiKey: 'oauth-token',
        authType: 'oauth',
        oauthAccountId: 'acct-123',
      },
      {
        catalogId: 'anygate__xai__grok-4.3',
        providerId: 'xai',
        displayName: 'Grok 4.3 (anygate - xAI API)',
        apiKey: 'api-key',
        authType: 'api',
      },
    ]);
  });

  it('limits routes to MAX_MODEL_CATALOG', () => {
    const favorites = Array.from({ length: 25 }, (_, i) => ({
      providerId: 'groq',
      providerName: 'Groq',
      model: { id: `llama-${i}`, name: `Llama-${i}` },
      apiKey: 'key',
    })) as any[];

    const result = buildAntigravityRoutes(favorites, 20);
    expect(result).toHaveLength(20);
  });
});
