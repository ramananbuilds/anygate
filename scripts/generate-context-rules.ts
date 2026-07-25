#!/usr/bin/env tsx
// scripts/generate-context-rules.ts
//
// Auto-generate HEURISTIC_RULES from models.dev data.
//
// Instead of manually maintaining regex rules in context-window.ts, this script
// fetches the models.dev API, groups models by provider/family, extracts the
// most common context window per group, and emits RegExp rules sorted by
// specificity (most specific first).
//
// Usage:
//   npx tsx scripts/generate-context-rules.ts            # uses bundled cache
//   npx tsx scripts/generate-context-rules.ts --fetch    # fetches live models.dev
//   npx tsx scripts/generate-context-rules.ts --write    # writes to src/apps/shared/context-rules.json
//   npx tsx scripts/generate-context-rules.ts --fetch --write
//
// The generated JSON can be imported by context-window.ts as a fallback or
// to periodically refresh the heuristic table.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadBundledModelsDevCache, fetchModelsDevCache, type ModelsDevCacheFile, type ModelsDevModel } from '../src/registry/models-dev.js';

interface ModelEntry {
  modelId: string;
  provider: string;
  family: string;
  context: number;
}

interface GeneratedRule {
  pattern: string;
  context: number;
  modelCount: number;
  exampleModels: string[];
}

/** Extract the "family" from a model ID — the leading segment before /, -, or :. */
function deriveFamily(modelId: string): string {
  // Handle provider-prefixed IDs like "poolside/laguna-s-2.1"
  const parts = modelId.split(/[/:-]/);
  return parts[0]?.toLowerCase() ?? modelId.toLowerCase();
}

/** Extract a more specific family — first two segments. */
function deriveSubFamily(modelId: string): string {
  const parts = modelId.split(/[/:-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.toLowerCase()}-${parts[1]!.toLowerCase()}`;
  }
  return deriveFamily(modelId);
}

/** Group models and find the dominant context window per group. */
function groupModels(models: ModelEntry[]): Map<string, { context: number; count: number; models: string[] }> {
  const groups = new Map<string, Map<number, { count: number; models: string[] }>>();

  for (const m of models) {
    const groupKey = m.family;
    const group = groups.get(groupKey) ?? new Map();
    const ctxGroup = group.get(m.context) ?? { count: 0, models: [] };
    ctxGroup.count++;
    ctxGroup.models.push(m.modelId);
    group.set(m.context, ctxGroup);
    groups.set(groupKey, group);
  }

  const result = new Map<string, { context: number; count: number; models: string[] }>();
  for (const [family, ctxGroups] of groups) {
    // Pick the most common context window as the representative
    let best: { context: number; count: number; models: string[] } | null = null;
    for (const [ctx, data] of ctxGroups) {
      if (!best || data.count > best.count) {
        best = { context: ctx, count: data.count, models: data.models };
      }
    }
    if (best) result.set(family, best);
  }
  return result;
}

/** Generate a RegExp pattern for a family. */
function generatePattern(family: string, models: string[]): string {
  // If the family is a known provider prefix (e.g., "poolside", "google"),
  // generate a pattern that matches the family prefix.
  const escaped = family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Check if all models share a common sub-pattern beyond the family
  const subFamilies = new Set(models.map(deriveSubFamily));
  if (subFamilies.size === 1 && subFamilies.has(family)) {
    // All models are just the family — match the family prefix
    return `${escaped}`;
  }

  // If there are sub-families, try to match the most common one
  const subFamilyCounts = new Map<string, number>();
  for (const sf of subFamilies) {
    subFamilyCounts.set(sf, (subFamilyCounts.get(sf) ?? 0) + 1);
  }
  const sortedSubs = [...subFamilyCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topSub = sortedSubs[0];
  if (topSub && topSub[1] >= models.length * 0.5) {
    // At least half the models share this sub-family — use it
    const subEscaped = topSub[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `${subEscaped}`;
  }

  // Fall back to family prefix
  return `${escaped}`;
}

/** Sort rules by specificity — longer patterns first. */
function sortRulesBySpecificity(rules: GeneratedRule[]): GeneratedRule[] {
  return rules.sort((a, b) => {
    // Longer patterns are more specific
    if (a.pattern.length !== b.pattern.length) {
      return b.pattern.length - a.pattern.length;
    }
    // Higher context windows are more specific (they override defaults)
    return b.context - a.context;
  });
}

/** Main generation logic. */
function generateRules(models: ModelEntry[]): GeneratedRule[] {
  const groups = groupModels(models);
  const rules: GeneratedRule[] = [];

  for (const [family, data] of groups) {
    const pattern = generatePattern(family, data.models);
    rules.push({
      pattern,
      context: data.context,
      modelCount: data.count,
      exampleModels: data.models.slice(0, 3),
    });
  }

  return sortRulesBySpecificity(rules);
}

/** Format rules as TypeScript code for context-window.ts. */
function formatAsTypeScript(rules: GeneratedRule[]): string {
  const lines: string[] = [];
  lines.push('// Auto-generated by scripts/generate-context-rules.ts');
  lines.push('// Do not edit manually — run the generator to update.');
  lines.push('// Ordered by specificity — first match wins.');
  lines.push('export const HEURISTIC_RULES: Array<[RegExp, number]> = [');

  for (const rule of rules) {
    lines.push(`  [/${rule.pattern}/i, ${rule.context}],`);
  }

  lines.push('];');
  return lines.join('\n');
}

/** Format rules as JSON for import. */
function formatAsJson(rules: GeneratedRule[]): string {
  return JSON.stringify(rules, null, 2);
}

// ── CLI entry point ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const shouldFetch = args.includes('--fetch');
const shouldWrite = args.includes('--write');

async function main(): Promise<void> {
  if (shouldFetch) {
    console.log('Fetching live models.dev data...');
  }

  let cache: ModelsDevCacheFile;
  if (shouldFetch) {
    const live = await fetchModelsDevCache();
    if (live) {
      cache = live;
    } else {
      console.warn('⚠ Live fetch failed, falling back to bundled cache.');
      cache = loadBundledModelsDevCache();
    }
  } else {
    cache = loadBundledModelsDevCache();
  }

  // Extract models with context windows
  const models: ModelEntry[] = [];
  for (const [provider, providerData] of Object.entries(cache)) {
    if (provider.startsWith('_')) continue;
    const providerModels = providerData?.models;
    if (!providerModels) continue;
    for (const [modelId, entry] of Object.entries(providerModels)) {
      const ctx = (entry as ModelsDevModel).limit?.context;
      if (typeof ctx === 'number' && ctx > 0) {
        models.push({
          modelId,
          provider,
          family: deriveFamily(modelId),
          context: ctx,
        });
      }
    }
  }

  console.log(`Loaded ${models.length.toLocaleString()} models from ${Object.keys(cache).filter(k => !k.startsWith('_')).length} providers.`);

  const rules = generateRules(models);

  console.log(`\nGenerated ${rules.length} heuristic rules:`);
  console.log('');
  console.log('  ' + 'Pattern'.padEnd(40) + 'Context'.padStart(10) + 'Models'.padStart(8) + '  Examples');
  console.log('  ' + '-'.repeat(100));
  for (const rule of rules.slice(0, 50)) {
    console.log(
      `  /${rule.pattern}/i`.padEnd(42).slice(0, 42) +
      String(rule.context).padStart(10) +
      String(rule.modelCount).padStart(8) +
      '  ' + rule.exampleModels.join(', '),
    );
  }
  if (rules.length > 50) {
    console.log(`  ... and ${rules.length - 50} more`);
  }

  if (shouldWrite) {
    const tsOutput = formatAsTypeScript(rules);
    const tsPath = join(process.cwd(), 'src', 'apps', 'shared', 'context-window.ts');
    console.log(`\n⚠ Would write TypeScript to: ${tsPath}`);
    console.log('  (Manual review recommended before overwriting)');

    const jsonOutput = formatAsJson(rules);
    const jsonPath = join(process.cwd(), 'src', 'apps', 'shared', 'context-rules.json');
    writeFileSync(jsonPath, jsonOutput + '\n');
    console.log(`✓ Wrote JSON rules to: ${jsonPath}`);
  } else {
    console.log('\n  (Use --write to save rules to disk)');
  }

  console.log('');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
