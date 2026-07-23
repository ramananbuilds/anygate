// Provider capabilities display: detail panels, cloud catalog management.
import * as p from '@clack/prompts';
import { loadPreferences } from '../../core/config.js';
import { loadRegistry } from '../../registry/io.js';
import { toggleProviderEnabled } from '../../registry/crud.js';
import { printCloudProviderPanel, printProviderDetailPanel } from '../../apps/shared/ui.js';
import { browseAllModels } from '../../apps/shared/prompts.js';
import { cachedModelToLocal } from '../../registry/materialize.js';
import { supportsNativeOAuth } from '../../auth/types.js';
import { formatRegistryAuthLabel } from '../provider-catalog.js';
import { runProvidersRefreshModels } from '../models/index.js';
import { runProvidersAuth, runProvidersRemove } from '../registry/index.js';
import type { LocalProvider } from '../../core/types.js';

export function providerHubChoiceValue(entry: { id: string }): string {
  return `provider:${entry.id}`;
}

export async function runOpenCodeCloudDetail(): Promise<'back'> {
  const registry = loadRegistry();
  const routes = registry.providers.filter(provider => provider.id === 'zen' || provider.id === 'go');
  printCloudProviderPanel('OpenCode Zen / Go');
  if (routes.length === 0) return 'back';

  const choice = await p.select({
    message: 'Manage an OpenCode catalog',
    options: [
      ...routes.map(provider => ({
        value: provider.id,
        label: provider.name,
        hint: `${provider.modelsCache?.models.length ?? 0} cached models`,
      })),
      { value: 'back', label: 'Back', hint: '' },
    ],
  });
  if (!p.isCancel(choice) && choice !== 'back') {
    await runProviderDetail(String(choice));
  }
  return 'back';
}

export async function runProviderDetail(id: string): Promise<'back' | 'removed'> {
  const registry = loadRegistry();
  const provider = registry.providers.find(pr => pr.id === id);
  if (!provider) return 'back';

  const modelCount = provider.modelsCache?.models.length ?? 0;
  const authLabel = formatRegistryAuthLabel(provider);
  printProviderDetailPanel(provider.name, modelCount, authLabel);

  const detailOptions: Array<{ value: string; label: string; hint?: string }> = [];
  if (modelCount > 0) {
    detailOptions.push({
      value: 'browse',
      label: 'Browse models',
      hint: `Search or browse ${modelCount} model${modelCount === 1 ? '' : 's'}`,
    });
  }
  detailOptions.push({
    value: 'refresh',
    label: 'Refresh model list',
    hint: 'Fetch latest models from the provider API',
  });
  if (supportsNativeOAuth(id) || provider.authType === 'oauth') {
    detailOptions.push({
      value: 'auth',
      label: 'Sign in again (OAuth)',
      hint: 'Refresh OAuth tokens or switch accounts',
    });
  }
  detailOptions.push(
    {
      value: 'toggle',
      label: provider.enabled ? 'Disable provider' : 'Enable provider',
      hint: provider.enabled ? 'Hide from anygate claude picker' : 'Show in anygate claude picker',
    },
    { value: 'remove', label: 'Remove provider', hint: 'Delete from registry and Keychain when safe' },
    { value: 'back', label: 'Back', hint: '' },
  );

  const action = await p.select({
    message: 'What would you like to do?',
    options: detailOptions,
  });
  if (p.isCancel(action) || action === 'back') return 'back';

  if (action === 'browse') {
    const cachedModels = provider.modelsCache?.models ?? [];
    const localModels = cachedModels
      .map(m => cachedModelToLocal(m, provider))
      .filter((m): m is NonNullable<typeof m> => m !== null);
    const localProvider: LocalProvider = {
      id: provider.id,
      name: provider.name,
      apiKey: '',
      models: localModels,
    };
    await browseAllModels(localProvider, loadPreferences());
    return 'back';
  }

  if (action === 'refresh') {
    await runProvidersRefreshModels(id);
    return 'back';
  }

  if (action === 'auth') {
    await runProvidersAuth(id);
    return 'back';
  }

  if (action === 'toggle') {
    const result = toggleProviderEnabled(id);
    if (result.toggled) {
      p.log.success(`${provider.name} ${result.enabled ? 'enabled' : 'disabled'}.`);
    }
    return 'back';
  }

  const code = await runProvidersRemove(id, true);
  return code === 0 ? 'removed' : 'back';
}
