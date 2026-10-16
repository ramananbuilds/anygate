import { describe, expect, it } from 'vitest'
import { isHiddenZenGoModelId, zenGoModelRoute } from '../../src/registry/sync/refresh-models.js'

describe('isHiddenZenGoModelId', () => {
  it('hides internal probes, spare-capacity backups, and SystemOne-protocol models', () => {
    expect(isHiddenZenGoModelId('test')).toBe(true)
    expect(isHiddenZenGoModelId('claude-opus-5-5-backup')).toBe(true)
    expect(isHiddenZenGoModelId('jev-1.13')).toBe(true)
    expect(isHiddenZenGoModelId('jev-1.13-free')).toBe(true)
  })

  it('keeps regular and free models', () => {
    expect(isHiddenZenGoModelId('big-pickle')).toBe(false)
    expect(isHiddenZenGoModelId('glm-5.3-flash-free')).toBe(false)
    expect(isHiddenZenGoModelId('claude-opus-5')).toBe(false)
  })
})

describe('zenGoModelRoute', () => {
  it('routes Claude models through the Anthropic passthrough', () => {
    expect(zenGoModelRoute('claude-sonnet-4-5', 'anthropic', 'zen')).toEqual({
      npm: '@ai-sdk/anthropic',
      apiUrl: 'https://opencode.ai/zen',
    })
  })

  it('routes chat models through the OpenAI-compatible gateway', () => {
    expect(zenGoModelRoute('glm-5.2', 'openai', 'zen')).toEqual({
      npm: '@ai-sdk/openai-compatible',
      apiUrl: 'https://opencode.ai/zen/v1',
    })
  })

  it('routes GPT and Muse Spark models through the Responses API even when unclassified', () => {
    expect(zenGoModelRoute('gpt-5.4', 'unsupported', 'zen')).toEqual({
      npm: '@ai-sdk/openai',
      apiUrl: 'https://opencode.ai/zen/v1',
    })
    expect(zenGoModelRoute('muse-spark-1.2-contributor-free', 'unsupported', 'zen')).toEqual({
      npm: '@ai-sdk/openai',
      apiUrl: 'https://opencode.ai/zen/v1',
    })
  })

  it('routes Gemini models through the native Google API under /inference', () => {
    expect(zenGoModelRoute('gemini-3-flash', 'unsupported', 'zen')).toEqual({
      npm: '@ai-sdk/google',
      apiUrl: 'https://opencode.ai/inference/google/v1beta',
    })
  })

  it('uses the Go backend base for Go models', () => {
    expect(zenGoModelRoute('glm-5.2', 'openai', 'go')).toEqual({
      npm: '@ai-sdk/openai-compatible',
      apiUrl: 'https://opencode.ai/zen/go/v1',
    })
  })

  it('returns null for hidden ids', () => {
    expect(zenGoModelRoute('test', 'openai', 'zen')).toBeNull()
    expect(zenGoModelRoute('claude-opus-5-5-backup', 'anthropic', 'zen')).toBeNull()
    expect(zenGoModelRoute('jev-1.13-free', 'openai', 'zen')).toBeNull()
  })
})
