// tests/registry/models-dev-reasoning.test.ts
import { describe, it, expect } from 'vitest'
import { resolveReasoning, findModelsDevModel } from '../../src/registry/models-dev.js'

// Minimal cache shapes for deterministic unit tests (skips the 2.26MB bundled file).
type Cache = Record<string, { models?: Record<string, { reasoning?: boolean }> }>

describe('resolveReasoning (models.dev capability policy)', () => {
  it('returns true when models.dev reports reasoning=true', () => {
    const cache: Cache = {
      mistral: {
        models: {
          'glm-5-2': { reasoning: true },
        },
      },
    }
    expect(resolveReasoning('mistral', 'glm-5-2', cache as any)).toBe(true)
  })

  it('returns false when models.dev reports reasoning=false', () => {
    const cache: Cache = {
      mistral: {
        models: {
          'mistral-small': { reasoning: false },
        },
      },
    }
    expect(resolveReasoning('mistral', 'mistral-small', cache as any)).toBe(false)
  })

  it('returns undefined when models.dev has no row for the model', () => {
    const cache: Cache = {
      mistral: {
        models: {
          'other-model': { reasoning: true },
        },
      },
    }
    expect(resolveReasoning('mistral', 'glm-5-2', cache as any)).toBeUndefined()
  })

  it('returns undefined when provider is not in the cache', () => {
    const cache: Cache = {}
    expect(resolveReasoning('mistral', 'glm-5-2', cache as any)).toBeUndefined()
  })

  it('normalizes model id candidates (handles glm-5-2 variants)', () => {
    const cache: Cache = {
      mistral: {
        models: {
          'glm-5-2': { reasoning: true },
        },
      },
    }
    expect(resolveReasoning('mistral', 'glm-5-2', cache as any)).toBe(true)
  })

  it('finds model entry via findModelsDevModel', () => {
    const cache: Cache = {
      mistral: {
        models: {
          'glm-5-2': { reasoning: true },
        },
      },
    }
    const entry = findModelsDevModel('mistral', 'glm-5-2', cache as any)
    expect(entry).not.toBeNull()
    expect(entry?.reasoning).toBe(true)
  })
})
