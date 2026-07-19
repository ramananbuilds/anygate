// tests/input-types.test.ts
import { describe, it, expect } from 'vitest';
import { resolveInputTypes } from '../src/registry/models-dev.js';
import { formatAnthropicModelEntry, formatAnthropicModelList } from '../src/gateway/models.js';

// Minimal cache shape for deterministic unit tests (skips the 2.26MB bundled file).
type Cache = Record<string, { models?: Record<string, { modalities?: { input?: string[] } }> }>;

function cacheWith(provider: string, modelId: string, input?: string[]): Cache {
  return {
    [provider]: {
      models: {
        [modelId]: { modalities: input ? { input } : undefined },
      },
    },
  };
}

describe('resolveInputTypes (A3 capability policy)', () => {
  it('enables image for NVIDIA Nemotron 3 Ultra despite text-only cache row (family override)', () => {
    // models.dev lists Nemotron 3 Ultra as text-only, but the family override wins.
    const cache = cacheWith('nvidia', 'nemotron-3-ultra-550b-a55b:free', ['text']);
    const types = resolveInputTypes('nemotron-3-ultra-550b', 'nvidia', 'nvidia/nemotron-3-ultra-550b-a55b:free', cache);
    expect(types).toContain('image');
    expect(types).toContain('text');
  });

  it('respects explicit text-only cache for a genuinely text-only model (deepseek)', () => {
    const cache = cacheWith('deepseek', 'deepseek-chat', ['text']);
    const types = resolveInputTypes('deepseek-chat', 'deepseek', 'deepseek-chat', cache);
    expect(types).toEqual(['text']);
  });

  it('returns only text when models.dev is silent and family is not multimodal', () => {
    const cache = cacheWith('someprovider', 'plain-llm', undefined);
    const types = resolveInputTypes('plain-llm', 'someprovider', 'plain-llm', cache);
    expect(types).toEqual(['text']);
  });

  it('enables image for a multimodal family even when models.dev is silent', () => {
    const cache = cacheWith('openai', 'gpt-5-foo', undefined);
    const types = resolveInputTypes('gpt-5-foo', 'openai', 'openai/gpt-5-foo', cache);
    expect(types).toContain('image');
  });

  it('passes through explicit text+image modalities from models.dev', () => {
    const cache = cacheWith('google', 'gemini-2.0-flash', ['text', 'image']);
    const types = resolveInputTypes('gemini-2.0-flash', 'google', 'google/gemini-2.0-flash', cache);
    expect(types).toEqual(['text', 'image']);
  });

  it('enables image for Nemotron routed via a non-nvidia provider id (olik) using the slugified upstream id', () => {
    // The user's live setup routes Nemotron through provider id "olik"; the
    // family is empty but the upstream model id still matches the multimodal regex.
    const cache = cacheWith('olik', 'nvidia/nemotron-3-ultra-550b-a55b:free', ['text']);
    const types = resolveInputTypes('', 'olik', 'nvidia/nemotron-3-ultra-550b-a55b:free', cache);
    expect(types).toContain('image');
    expect(types).toContain('text');
  });
});

describe('formatAnthropicModelEntry input_types', () => {
  it('emits input_types when provided', () => {
    const entry = formatAnthropicModelEntry('x', 'y', 1000, ['text', 'image']);
    expect(entry).toMatchObject({ input_types: ['text', 'image'] });
  });

  it('defaults to text-only when inputTypes omitted', () => {
    const entry = formatAnthropicModelEntry('x', 'y');
    expect(entry).toMatchObject({ input_types: ['text'] });
  });
});

describe('formatAnthropicModelList input_types', () => {
  it('forwards inputTypes into every list entry (gateway discovery)', () => {
    const list = formatAnthropicModelList([
      { id: 'anthropic-p__model-a', name: 'Model A', contextWindow: 1000, inputTypes: ['text', 'image'] },
      { id: 'anthropic-p__model-b', name: 'Model B', contextWindow: 2000, inputTypes: ['text'] },
    ]);
    const a = list.data.find((m: any) => m.id === 'anthropic-p__model-a');
    const b = list.data.find((m: any) => m.id === 'anthropic-p__model-b');
    expect(a).toMatchObject({ input_types: ['text', 'image'] });
    expect(b).toMatchObject({ input_types: ['text'] });
  });

  it('defaults list entries to text-only when inputTypes omitted', () => {
    const list = formatAnthropicModelList([
      { id: 'anthropic-p__plain', name: 'Plain', contextWindow: 1000 },
    ]);
    expect(list.data[0]).toMatchObject({ input_types: ['text'] });
  });
});
