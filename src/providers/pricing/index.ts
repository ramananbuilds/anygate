// Pricing display helpers for provider model catalogs.
//
// Pricing data is sourced from src/registry/pricing.ts and model cost
// metadata. This module formats cost information for terminal display
// in the providers command and hub.

import type { ModelCost } from '../../types/index.js';

/** Format a per-1M-tokens cost string for display (e.g. "$0.03 / 1M"). */
export function formatCost(cost: ModelCost | undefined): string {
  if (!cost) return '—';
  const parts: string[] = [];
  if (cost.input > 0) parts.push(`$${cost.input} in`);
  if (cost.output > 0) parts.push(`$${cost.output} out`);
  if (cost.cache_read && cost.cache_read > 0) parts.push(`$${cost.cache_read} cache`);
  return parts.length > 0 ? parts.join(' · ') : 'free';
}

/** Format a cost summary line for a provider's model count + pricing tier. */
export function formatProviderPricing(modelCount: number, hasFree: boolean): string {
  const freeNote = hasFree ? ' (includes free)' : '';
  return `${modelCount} model${modelCount === 1 ? '' : 's'}${freeNote}`;
}
