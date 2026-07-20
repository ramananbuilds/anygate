import { describe, it, expect, vi, afterEach } from 'vitest';
import { isWebSearchTool, makeWebSearchTool } from '../../src/gateway/web-search/tool.js';
import { formatSearchResults } from '../../src/gateway/web-search/index.js';

const DDG_FIXTURE = `
<div class="result">
  <a class="result__a" href="/redirect?uddg=https%3A%2F%2Fnews.example.com%2Farticle">Big News Headline</a>
  <a class="result__snippet">A summary of the breaking news.</a>
</div>
`;

describe('isWebSearchTool', () => {
  it('matches the hosted web_search tool by type', () => {
    expect(isWebSearchTool({ type: 'web_search_20250305', name: 'web_search' })).toBe(true);
  });
  it('matches by name with various separators', () => {
    expect(isWebSearchTool({ name: 'web_search_tool_20250305' })).toBe(true);
    expect(isWebSearchTool({ name: 'web-search' })).toBe(true);
  });
  it('does not match ordinary tools', () => {
    expect(isWebSearchTool({ name: 'Read', input_schema: {} })).toBe(false);
    expect(isWebSearchTool({ name: 'web_fetch' })).toBe(false);
  });
});

describe('makeWebSearchTool', () => {
  it('builds a tool with an input schema and description', () => {
    const tool = makeWebSearchTool('web_search_tool_20250305');
    expect(tool.description).toMatch(/web/i);
    expect(tool.inputSchema).toBeDefined();
    expect(tool.execute).toBeDefined();
  });

  it('execute runs the search and returns formatted results', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => DDG_FIXTURE }));
    const tool = makeWebSearchTool('web_search_tool_20250305');
    const out = await tool.execute!({ query: 'latest news' }, { toolCallId: '1' });
    expect(typeof out).toBe('string');
    expect(out).toContain('Web search results');
    expect(out).toContain('Big News Headline');
    expect(out).toContain('https://news.example.com/article');
  });
});

describe('formatSearchResults', () => {
  it('lists results with title, url, and snippet', () => {
    const text = formatSearchResults([
      { title: 'T', url: 'https://t.example', snippet: 'S' },
    ]);
    expect(text).toContain('1. T');
    expect(text).toContain('https://t.example');
    expect(text).toContain('S');
  });
  it('handles empty results', () => {
    expect(formatSearchResults([])).toContain('No web search results');
  });
});
