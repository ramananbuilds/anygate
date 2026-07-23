// Provider registry management: import, auth, remove, list.
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { upgradeGlobalOpencodeCredential, readGlobalOpencodeCredential, resolveProviderCredential } from '../../config/env.js';
import {
  formatRegistryAuthLabel,
  resolveProvidersForDisplay,
  type ProviderDisplayEntry,
} from '../provider-catalog.js';
import {
  listVisibleOAuthTemplates,
  type ProviderTemplate,
} from '../provider-templates.js';
import { importFromOpencode, type ImportConflictChoice, type ImportConflictContext } from '../../registry/import-opencode.js';
import { removeProviderFromRegistry } from '../../registry/crud.js';
import { loadRegistry } from '../../registry/io.js';
import { refreshProviderModels } from '../../registry/refresh-models.js';
import { resolveRefreshCredential } from '../../registry/refresh-credentials.js';
import { authenticateProvider, providerAuthHelpText, type ProviderAuthMethod } from '../../registry/provider-auth.js';
import { printImportConflictPanel } from '../../apps/shared/ui.js';
import { runProvidersRefreshModels } from '../models/index.js';

export async function runProvidersImport(): Promise<number> {
  const registry = loadRegistry();
  const hasExisting = registry.providers.length > 0;

  const resolveConflict = hasExisting
    ? async (ctx: ImportConflictContext): Promise<ImportConflictChoice> => {
        printImportConflictPanel(ctx.existing.name, ctx.existingKeyHint, ctx.incomingKeyHint);
        const choice = await p.select({
          message: 'Which configuration should we keep?',
          options: [
            { value: 'keep', label: pc.cyan('Keep mine'), hint: 'Leave your current anygate config unchanged' },
            { value: 'import', label: pc.cyan('Use imported'), hint: 'Replace with OpenCode settings and refresh models' },
            { value: 'skip', label: pc.dim('Skip this provider'), hint: '' },
          ],
        });
        if (p.isCancel(choice)) return 'skip' as ImportConflictChoice;
        return choice as ImportConflictChoice;
      }
    : undefined;

  const spinner = p.spinner();
  spinner.start('Importing from OpenCode...');
  const result = await importFromOpencode({ resolveConflict });
  spinner.stop('');

  if (result.error) {
    p.log.error(result.error);
    return 1;
  }

  if (result.imported.length === 0 && result.skipped.length === 0) {
    p.log.warn('No configured providers found in OpenCode.');
    p.log.info('Add providers in OpenCode first, or use anygate providers add.');
    return 0;
  }

  if (result.authFileWarning) {
    p.log.warn(result.authFileWarning);
  }

  const importedNames = result.imported.map(pr => pr.name).join(', ');
  const modelTotal = result.imported.reduce((n, pr) => n + (pr.modelsCache?.models.length ?? 0), 0);
  const credNote = result.oauthImported > 0
    ? ` (${result.oauthImported} via OAuth)`
    : '';
  p.log.success(
    `Imported ${importedNames} — ${modelTotal} model${modelTotal === 1 ? '' : 's'}, `
    + `${result.keysSaved} credential${result.keysSaved === 1 ? '' : 's'} saved to Keychain${credNote}.`,
  );

  if (result.skipped.length > 0) {
    for (const s of result.skipped) {
      const reason =
        s.reason === 'user-skipped' ? 'skipped by you'
        : s.reason === 'conflict-kept' ? 'kept your existing config'
        : s.reason === 'oauth-no-token' ? 'OAuth provider in OpenCode but not signed in — run anygate providers auth'
        : s.reason === 'no-api-key' ? 'no API key in OpenCode — add key there or use anygate providers add'
        : s.reason === 'manual-only' ? 'uses gcloud/AWS credentials — not importable via API key'
        : s.reason === 'placeholder-key' ? 'placeholder API key — provider not imported'
        : s.reason === 'invalid-key' ? 'API key failed verification — provider not imported'
        : s.reason === 'credential-save-failed' ? 'could not save credential — provider not imported'
        : s.reason;
      p.log.warn(`Skipped ${s.name} (${s.id}): ${reason}`);
    }
  }

  if (result.keysSkipped.length > 0) {
    for (const k of result.keysSkipped) {
      if (k.detail) {
        p.log.info(`${k.name} (${k.id}): ${k.detail}`);
      }
    }
  }

  if (result.imported.length > 0) {
    const refreshSpinner = p.spinner();
    refreshSpinner.start('Fetching model capabilities from providers...');
    const registry = loadRegistry();
    for (const provider of result.imported) {
      const key = await resolveRefreshCredential(provider, async pr =>
        resolveProviderCredential(pr.id, pr.authRef),
      );
      await refreshProviderModels(provider.id, key, registry);
    }
    refreshSpinner.stop('Model capabilities refreshed.');
  }

  return 0;
}

export async function runProvidersAuth(providerId: string, method?: ProviderAuthMethod): Promise<number> {
  try {
    const result = await authenticateProvider(providerId, { method });
    p.log.success(`Signed in to ${result.registryProvider.name} — credential saved to Keychain.`);
    return 0;
  } catch (err) {
    if (err instanceof Error && err.message === 'Cancelled') {
      p.cancel('Cancelled.');
      return 0;
    }
    p.log.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
}

export async function runProvidersRemove(id: string, interactive = false): Promise<number> {
  const registry = loadRegistry();
  const provider = registry.providers.find(pr => pr.id === id);
  if (!provider) {
    p.log.error(`Provider not found: ${id}`);
    return 1;
  }

  if (interactive) {
    const confirm = await p.confirm({
      message: `Remove ${provider.name} (${id})?`,
      initialValue: false,
    });
    if (p.isCancel(confirm) || !confirm) {
      p.cancel('Cancelled.');
      return 0;
    }
  }

  const result = await removeProviderFromRegistry(id);
  if (!result.removed) {
    p.log.error(result.error ?? `Could not remove ${id}`);
    return 1;
  }

  p.log.success(`Removed ${result.name ?? id}.`);
  if (result.credentialDeleted) {
    p.log.info('Provider API key removed from Keychain.');
  }
  return 0;
}

export async function runProvidersList(): Promise<number> {
  const entries = await resolveProvidersForDisplay();
  if (entries.length === 0) {
    p.log.info('No providers configured. Run anygate providers add or import.');
    return 0;
  }

  console.log('');
  for (const entry of entries) {
    const status = entry.enabled ? pc.green('●') : pc.dim('○');
    console.log(
      `  ${status} ${pc.bold(entry.name)} ${pc.dim(`(${entry.id})`)} — `
      + `${entry.modelCount} model${entry.modelCount === 1 ? '' : 's'}, auth: ${entry.authLabel}`,
    );
  }
  console.log('');
  return 0;
}

export { providerAuthHelpText };
export type { ProviderAuthMethod };
export { listVisibleOAuthTemplates };
export type { ProviderDisplayEntry };
