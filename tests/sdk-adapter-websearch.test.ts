import { describe, it, expect, vi, afterEach } from 'vitest';
import { translateTools, translateRequest } from '../src/gateway/sdk-adapter.js';

describe('translateTools — web search substitution', () => {
  it('replaces a hosted web_search tool with a local executable tool', () => {
    const tools = translateTools([
      { name: 'web_search_tool_20250305', type: 'web_search_20250305' },
    ]);
    expect(tools).toBeDefined();
    expect(Object.keys(tools!)).toEqual(['web_search_tool_20250305']);
    // The substituted tool must carry an execute so the SDK can run the search.
    expect(typeof tools!['web_search_tool_20250305'].execute).toBe('function');
  });

  it('still builds ordinary client-side tools without execute', () => {
    const tools = translateTools([
      { name: 'Read', description: 'read a file', input_schema: { type: 'object', properties: { path: { type: 'string' } } } },
      { name: 'web_search_tool_20250305', type: 'web_search_20250305' },
    ]);
    expect(Object.keys(tools!)).toEqual(['Read', 'web_search_tool_20250305']);
    expect(tools!.Read.execute).toBeUndefined();
    expect(typeof tools!['web_search_tool_20250305'].execute).toBe('function');
  });

  it('drops tools with no name', () => {
    const tools = translateTools([{ type: 'web_search_20250305' } as never]);
    expect(tools).toBeUndefined();
  });
});

describe('translateRequest — web search detection', () => {
  const webSearchBody = {
    model: 'anthropic-kilo__mistral',
    messages: [] as never[],
    tools: [{ name: 'web_search_tool_20250305', type: 'web_search_20250305' }],
  };

  it('records the web search tool name when present', () => {
    const params = translateRequest(webSearchBody as never, '@ai-sdk/mistral');
    expect(params.webSearchToolName).toBe('web_search_tool_20250305');
    expect(params.tools?.['web_search_tool_20250305'].execute).toBeDefined();
  });

  it('leaves webSearchToolName unset for ordinary tools', () => {
    const params = translateRequest(
      {
        model: 'm',
        messages: [] as never[],
        tools: [{ name: 'Read', input_schema: { type: 'object' } }],
      } as never,
      '@ai-sdk/mistral',
    );
    expect(params.webSearchToolName).toBeUndefined();
  });
});
