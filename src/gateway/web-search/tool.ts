// Bridges Anthropic's hosted web_search tool into a local Vercel AI SDK tool
// that anygate executes itself against a free search backend.

import { tool, jsonSchema } from 'ai';
import type { Tool } from 'ai';
import { searchWeb, formatSearchResults } from './index.js';

interface WebSearchInput {
  query: string;
  allowed_domains?: string[];
  blocked_domains?: string[];
  max_uses?: number;
}

const WEB_SEARCH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    query: { type: 'string', description: 'The search query to use.' },
    allowed_domains: {
      type: 'array',
      items: { type: 'string' },
      description: 'Only include search results from these domains.',
    },
    blocked_domains: {
      type: 'array',
      items: { type: 'string' },
      description: 'Never include search results from these domains.',
    },
    max_uses: { type: 'integer', description: 'Maximum number of searches the model may perform.' },
  },
  required: ['query'],
} as Record<string, unknown>;

/** True for Anthropic's hosted web_search tool (no input_schema, type/name indicates it). */
export function isWebSearchTool(t: { name?: string; type?: string }): boolean {
  if (typeof t.name === 'string' && /web[_-]?search/i.test(t.name)) return true;
  if (typeof t.type === 'string' && t.type.startsWith('web_search')) return true;
  return false;
}

/**
 * Build a local SDK tool that fulfills `web_search` on behalf of the upstream.
 * The model emits a tool_call for `name`; the SDK executes `execute` (which runs
 * the search) and feeds results back, so the upstream never has to support it.
 */
export function makeWebSearchTool(name: string): Tool {
  return tool({
    description:
      'Search the web for current information. Use this whenever the user asks about recent events, ' +
      'current facts, news, or anything that may need up-to-date information beyond your training data.',
    inputSchema: jsonSchema(WEB_SEARCH_INPUT_SCHEMA),
    execute: async (input: unknown) => {
      const params = input as WebSearchInput;
      const results = await searchWeb(params.query, {
        allowedDomains: params.allowed_domains,
        blockedDomains: params.blocked_domains,
      });
      return formatSearchResults(results);
    },
  });
}
