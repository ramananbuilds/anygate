#!/usr/bin/env tsx
// scripts/audit-context-windows.ts
//
// Audit our HEURISTIC_RULES against actual provider limits from models.dev.
//
// Usage:
//   npx tsx scripts/audit-context-windows.ts            # uses bundled cache
//   npx tsx scripts/audit-context-windows.ts --fetch    # fetches live models.dev
//   npx tsx scripts/audit-context-windows.ts --provider poolside  # filter to one provider
//
// Output: missing rules, incorrect rules, unknown models, and provider defaults coverage.

import { writeFileSync } from 'node:fs';
import { HEURISTIC_RULES, contextWindowFromHeuristics, DEFAULT_CONTEXT_WINDOW, PROVIDER_DEFAULTS } from '../src/apps/shared/context-window.js';
import {
  loadBundledModelsDevCache,
  fetchModelsDevCache,
  type ModelsDevCacheFile,
  type ModelsDevModel,
} from '../src/registry/models-dev.js';

interface AuditResult {
  totalModels: number;
  modelsWithCacheMatch: number;
  modelsWithHeuristicMatch: number;
  modelsWithProviderDefault: number;
  modelsUnknown: number;
  missingRules: Array<{ modelId: string; provider: string; actual: number; heuristic: number }>;
  incorrectRules: Array<{ modelId: string; provider: string; actual: number; heuristic: number; diffPct: number }>;
  unknownModels: Array<{ modelId: string; provider: string }>;
  providerCoverage: Array<{ provider: string; total: number; covered: number; pct: number }>;
}

function loadCache(fetch: boolean): ModelsDevCacheFile {
  if (fetch) {
    const live = fetchModelsDevCache();
    if (live) return live;
    console.warn('⚠ Live fetch failed, falling back to bundled cache.');
  }
  return loadBundledModelsDevCache();
}

function extractModels(cache: ModelsDevCacheFile): Array<{ modelId: string; provider: string; context: number }> {
  const results: Array<{ modelId: string; provider: string; context: number }> = [];
  for (const [provider, providerData] of Object.entries(cache)) {
    if (provider.startsWith('_')) continue;
    const models = providerData?.models;
    if (!models) continue;
    for (const [modelId, entry] of Object.entries(models)) {
      const ctx = (entry as ModelsDevModel).limit?.context;
      if (typeof ctx === 'number' && ctx > 0) {
        results.push({ modelId, provider, context: ctx });
      }
    }
  }
  return results;
}

function auditModels(models: Array<{ modelId: string; provider: string; context: number }>, providerFilter?: string): AuditResult {
  const filtered = providerFilter
    ? models.filter(m => m.provider === providerFilter)
    : models;

  const result: AuditResult = {
    totalModels: filtered.length,
    modelsWithCacheMatch: 0,
    modelsWithHeuristicMatch: 0,
    modelsWithProviderDefault: 0,
    modelsUnknown: 0,
    missingRules: [],
    incorrectRules: [],
    unknownModels: [],
    providerCoverage: [],
  };

  // Track per-provider coverage
  const providerStats = new Map<string, { total: number; covered: number }>();

  for (const { modelId, provider, context } of filtered) {
    const heuristic = contextWindowFromHeuristics(modelId);
    const providerDefault = PROVIDER_DEFAULTS[provider];

    const stat = providerStats.get(provider) ?? { total: 0, covered: 0 };
    stat.total++;

    // Check if heuristic matches actual (within 5% tolerance)
    const diffPct = Math.abs(heuristic - context) / context * 100;
    if (diffPct <= 5) {
      result.modelsWithHeuristicMatch++;
      stat.covered++;
    } else if (heuristic !== DEFAULT_CONTEXT_WINDOW) {
      // Heuristic returned a non-default value that's wrong
      result.incorrectRules.push({ modelId, provider, actual: context, heuristic, diffPct: Math.round(diffPct * 10) / 10 });
      stat.covered++;
    } else if (providerDefault && Math.abs(providerDefault - context) / context * 100 <= 10) {
      // Heuristic defaulted to 200K but provider default covers it
      result.modelsWithProviderDefault++;
      stat.covered++;
    } else {
      // No match at all
      result.modelsUnknown++;
      result.unknownModels.push({ modelId, provider });
    }

    providerStats.set(provider, stat);
  }

  // Build provider coverage report
  for (const [provider, stat] of providerStats) {
    result.providerCoverage.push({
      provider,
      total: stat.total,
      covered: stat.covered,
      pct: Math.round((stat.covered / stat.total) * 100),
    });
  }

  // Sort by coverage ascending
  result.providerCoverage.sort((a, b) => a.pct - b.pct);

  // Sort issues by modelId for readability
  result.missingRules.sort((a, b) => a.modelId.localeCompare(b.modelId));
  result.incorrectRules.sort((a, b) => b.diffPct - a.diffPct);
  result.unknownModels.sort((a, b) => a.modelId.localeCompare(b.modelId));

  return result;
}

function printReport(result: AuditResult): void {
  console.log('\n' + '='.repeat(80));
  console.log('  CONTEXT WINDOW AUDIT REPORT');
  console.log('='.repeat(80));

  console.log(`\n📊 Summary (${result.totalModels.toLocaleString()} models):`);
  console.log(`  Heuristic match:     ${result.modelsWithHeuristicMatch} (${Math.round(result.modelsWithHeuristicMatch / result.totalModels * 100)}%)`);
  console.log(`  Provider default:    ${result.modelsWithProviderDefault} (${Math.round(result.modelsWithProviderDefault / result.totalModels * 100)}%)`);
  console.log(`  Unknown (no match):  ${result.modelsUnknown} (${Math.round(result.modelsUnknown / result.totalModels * 100)}%)`);

  // Incorrect rules (highest diff first)
  if (result.incorrectRules.length > 0) {
    console.log(`\n❌ Incorrect rules (${result.incorrectRules.length}):`);
    console.log('  ' + 'Model'.padEnd(50) + 'Provider'.padEnd(15) + 'Actual'.padStart(10) + 'Heuristic'.padStart(10) + 'Diff%'.padStart(8));
    console.log('  ' + '-'.repeat(93));
    for (const r of result.incorrectRules.slice(0, 30)) {
      console.log(
        '  ' +
        r.modelId.padEnd(50).slice(0, 50) +
        r.provider.padEnd(15).slice(0, 15) +
        String(r.actual).padStart(10) +
        String(r.heuristic).padStart(10) +
        `${r.diffPct}%`.padStart(8),
      );
    }
    if (result.incorrectRules.length > 30) {
      console.log(`  ... and ${result.incorrectRules.length - 30} more`);
    }
  }

  // Unknown models
  if (result.unknownModels.length > 0) {
    console.log(`\n❓ Unknown models (${result.unknownModels.length}):`);
    const byProvider = new Map<string, string[]>();
    for (const m of result.unknownModels) {
      const arr = byProvider.get(m.provider) ?? [];
      arr.push(m.modelId);
      byProvider.set(m.provider, arr);
    }
    for (const [provider, ids] of byProvider) {
      console.log(`  ${provider} (${ids.length}):`);
      for (const id of ids.slice(0, 10)) {
        console.log(`    ${id}`);
      }
      if (ids.length > 10) console.log(`    ... and ${ids.length - 10} more`);
    }
  }

  // Provider coverage
  console.log('\n📈 Provider coverage (lowest first):');
  console.log('  ' + 'Provider'.padEnd(25) + 'Covered'.padStart(8) + 'Total'.padStart(8) + 'Coverage'.padStart(10));
  console.log('  ' + '-'.repeat(53));
  for (const p of result.providerCoverage) {
    const mark = p.pct < 80 ? '⚠' : '✓';
    console.log(
      `  ${mark} ${p.provider.padEnd(23).slice(0, 23)}` +
      `${p.covered}`.padStart(8) +
      `${p.total}`.padStart(8) +
      `${p.pct}%`.padStart(10),
    );
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// ── CLI entry point ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const shouldFetch = args.includes('--fetch');
const providerFilter = args.find(a => a.startsWith('--provider='))?.split('=')[1];

if (shouldFetch) {
  console.log('Fetching live models.dev data...');
}

const cache = loadCache(shouldFetch);
const models = extractModels(cache);
console.log(`Loaded ${models.length.toLocaleString()} models from ${Object.keys(cache).filter(k => !k.startsWith('_')).length} providers.`);

const result = auditModels(models, providerFilter);
printReport(result);

// Exit non-zero if there are unknown models (for CI)
if (result.modelsUnknown > 0 && !providerFilter) {
  console.error(`\n⚠ ${result.modelsUnknown} unknown models found. Consider adding provider defaults.`);
  process.exit(1);
}
