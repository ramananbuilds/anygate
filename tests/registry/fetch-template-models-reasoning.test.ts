// tests/registry/fetch-template-models-reasoning.test.ts
import { describe, it, expect } from 'vitest'
import { parseModelList } from '../../src/registry/templates/fetch-template-models.js'
import type { CachedModel } from '../../src/registry/types.js'

describe('parseModelList reasoning capability detection', () => {
  it('detects reasoning=true from Mistral-style capabilities object', () => {
    const body = {
      data: [
        {
          id: 'glm-5-2',
          name: 'GLM-5.2',
          capabilities: {
            completion_chat: true,
            function_calling: true,
            reasoning: true,
          },
        },
      ],
    }
    const models = parseModelList(body, '@ai-sdk/mistral', 'mistral')
    expect(models).toHaveLength(1)
    expect(models[0].reasoning).toBe(true)
  })

  it('detects reasoning=false from capabilities object', () => {
    const body = {
      data: [
        {
          id: 'mistral-small',
          name: 'Mistral Small',
          capabilities: {
            reasoning: false,
          },
        },
      ],
    }
    const models = parseModelList(body, '@ai-sdk/mistral', 'mistral')
    expect(models).toHaveLength(1)
    expect(models[0].reasoning).toBe(false)
  })

  it('detects reasoning from top-level boolean when no capabilities object', () => {
    const body = {
      data: [
        {
          id: 'some-model',
          name: 'Some Model',
          reasoning: true,
        },
      ],
    }
    const models = parseModelList(body, '@ai-sdk/openai-compatible', 'custom-provider')
    expect(models).toHaveLength(1)
    expect(models[0].reasoning).toBe(true)
  })

  it('leaves reasoning undefined when neither capabilities nor top-level field present', () => {
    const body = {
      data: [
        {
          id: 'plain-model',
          name: 'Plain Model',
        },
      ],
    }
    const models = parseModelList(body, '@ai-sdk/mistral', 'mistral')
    expect(models).toHaveLength(1)
    expect(models[0].reasoning).toBeUndefined()
  })

  it('does not crash on models without capabilities field (backward compat)', () => {
    const body = {
      data: [
        {
          id: 'legacy-model',
          name: 'Legacy Model',
          context_length: 4096,
        },
      ],
    }
    const models = parseModelList(body, '@ai-sdk/openai', 'openai')
    expect(models).toHaveLength(1)
    expect(models[0].reasoning).toBeUndefined()
    expect(models[0].contextWindow).toBe(4096)
  })
})
