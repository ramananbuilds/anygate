// Model listing and management: refresh model lists, pick from catalog.
import * as p from '@clack/prompts';
import { resolveProviderCredential } from '../../config/env.js';
import { loadRegistry } from '../../registry/storage/io.js';
import { refreshAllProviderModels, refreshProviderModels } from '../../registry/sync/refresh-models.js';
import { resolveRefreshCredential } from '../../registry/sync/refresh-credentials.js';
import { filterTemplates, listAddableTemplates, listSupportedTemplates, type ProviderTemplate } from '../../registry/templates/provider-templates.js';

export async function runProvidersRefreshModels(providerId?: string): Promise<number> {
  const resolveKey = async (provider: import('../../registry/types.js').RegistryProvider) =>
    resolveProviderCredential(provider.id, provider.authRef);

  if (providerId) {
    const registry = loadRegistry();
    const provider = registry.providers.find(p => p.id === providerId);
    if (!provider) {
      p.log.error(`Provider not found: ${providerId}`);
      return 1;
    }
    const spinner = p.spinner();
    spinner.start(`Refreshing ${provider.name}...`);
    const key = await resolveRefreshCredential(provider, async p =>
      resolveProviderCredential(p.id, p.authRef),
    );
    const result = await refreshProviderModels(providerId, key);
    spinner.stop('');
    if (result.skipped) {
      const countNote = result.modelCount ? ` (${result.modelCount} cached models kept)` : '';
      p.log.warn(`${result.name}: ${result.reason}${countNote}`);
      return 0;
    }
    if (!result.ok) {
      p.log.error(`${result.name}: ${result.reason ?? 'Refresh failed.'}`);
      return 1;
    }
    const diff = result.previousModelCount === undefined
      ? 0
      : (result.modelCount ?? 0) - result.previousModelCount;
    const diffStr = result.previousModelCount === undefined
      ? ''
      : diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '';
    p.log.success(`${result.name}: ${result.modelCount} model${result.modelCount === 1 ? '' : 's'} updated${diffStr}.`);
    if (result.reason) {
      p.log.warn(result.reason);
    }
    return 0;
  }

  const spinner = p.spinner();
  spinner.start('Refreshing model lists...');
  const { refreshed } = await refreshAllProviderModels(resolveKey);
  spinner.stop('');

  const ok = refreshed.filter(r => r.ok && !r.skipped);
  const skipped = refreshed.filter(r => r.skipped);
  const failed = refreshed.filter(r => !r.ok);

  if (ok.length > 0) {
    p.log.success(`Updated ${ok.length} provider${ok.length === 1 ? '' : 's'}.`);
    for (const r of ok) {
      const diff = r.previousModelCount === undefined
        ? 0
        : (r.modelCount ?? 0) - r.previousModelCount;
      const diffStr = r.previousModelCount === undefined
        ? ''
        : diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '';
      p.log.info(`  ${r.name}: ${r.modelCount} model${r.modelCount === 1 ? '' : 's'}${diffStr}`);
      if (r.reason) {
        p.log.warn(`  ${r.reason}`);
      }
    }
  }
  for (const r of skipped) {
    const countNote = r.modelCount ? ` (${r.modelCount} cached models kept)` : '';
    p.log.warn(`Skipped ${r.name}: ${r.reason}${countNote}`);
  }
  for (const r of failed) {
    p.log.error(`${r.name}: ${r.reason ?? 'Refresh failed.'}`);
  }
  return failed.length > 0 ? 1 : 0;
}

export async function pickTemplateFromCatalog(): Promise<ProviderTemplate | null> {
  while (true) {
    const registry = loadRegistry();
    const configuredIds = new Set(registry.providers.map(p => p.id));
    const templates = listAddableTemplates(configuredIds);
    if (templates.length === 0) return null;

    const method = await p.select({
      message: `Choose a provider (${templates.length} available)`,
      options: [
        { value: 'search', label: 'Search providers', hint: 'e.g. gro, mistral, together' },
        { value: 'browse', label: 'Browse all providers', hint: 'Scroll the full list' },
        { value: 'back', label: 'Back', hint: '' },
      ],
    });
    if (p.isCancel(method) || method === 'back') return null;

    if (method === 'browse') {
      const options = templates.map(t => ({
        value: t.id,
        label: t.name,
        hint: t.npm,
      }));
      const picked = await p.select({ message: 'Select a provider', options });
      if (p.isCancel(picked)) continue;
      const template = templates.find(t => t.id === picked);
      if (template) return template;
      continue;
    }

    const searchInput = await p.text({
      message: 'Search providers:',
      placeholder: 'e.g. groq, mistral, openrouter',
    });
    if (p.isCancel(searchInput)) continue;

    const query = String(searchInput);
    const matched = filterTemplates(templates, query);
    if (matched.length === 0) {
      const alreadyAdded = filterTemplates(listSupportedTemplates(), query).filter(t => configuredIds.has(t.id));
      if (alreadyAdded.length > 0) {
        p.log.info(`Already configured: ${alreadyAdded.map(t => t.name).join(', ')}`);
      } else {
        p.log.warn('No providers match — try a different search');
      }
      continue;
    }

    const options = matched.map(t => ({
      value: t.id,
      label: t.name,
      hint: t.npm,
    }));
    const picked = await p.select({
      message: matched.length === 1 ? 'Match found' : `Select provider (${matched.length} matches)`,
      options,
    });
    if (p.isCancel(picked)) continue;
    const template = matched.find(t => t.id === picked);
    if (template) return template;
  }
}
