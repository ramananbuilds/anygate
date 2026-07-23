// src/commands/models.ts — anygate models command
import pc from 'picocolors';
import * as p from '@clack/prompts';
import { loadPreferences, savePreferences } from '../core/config.js';
import { fetchProviderCatalog, providersForPicker } from '../providers/provider-catalog.js';
import { providersForTarget } from '../agents/shared/target-compatibility.js';
import { pickGlobalFavoriteModel, browseByProviderChoice } from '../agents/claude/favorites-picker.js';
import { providerSelectOption, formatModelLabel, gateIntro, gateOutro, fmtEnabledStar, fmtModel } from '../agents/shared/ui.js';
import { favoriteProviderDisplayName } from '../agents/claude/favorites-provider-display.js';
import { buildGlobalFavoriteIndex } from '../agents/claude/favorites-picker.js';
import { isFavorite } from '../agents/claude/favorites.js';
import { addFavorite, removeFavorite } from '../agents/claude/favorites.js';
import type { FavoriteModel, LocalProvider, LocalProviderModel, ParsedArgs } from '../core/types.js';

const AGY_CLI_FAVORITES_CAP = 6;

export async function runModelsCommand(parsed: ParsedArgs): Promise<number> {
  const scope = parsed.favoritesAgy ? 'agy' : 'global';
  const maxFavorites = scope === 'agy' ? AGY_CLI_FAVORITES_CAP : 20;
  const scopeName = scope === 'agy' ? 'Antigravity CLI Favorites' : 'Favorite Models';
  const configKey = scope === 'agy' ? 'antigravityCliFavoriteModels' : 'favoriteModels';
  gateIntro(scopeName);

  const spinner = p.spinner();
  spinner.start('Loading providers...');

  const catalog = await fetchProviderCatalog();
  spinner.stop('');

  const allProviders = scope === 'agy'
    ? providersForTarget(providersForPicker(catalog), 'antigravity')
    : providersForPicker(catalog);
  const favoriteProviders = allProviders.map(provider => ({
    ...provider,
    name: favoriteProviderDisplayName(provider),
  }));

  if (favoriteProviders.length === 0) {
    p.log.warn('No providers found.');
    p.log.info(`OpenCode Zen/Go is always available. Add providers with ${pc.cyan('anygate providers')}.`);
    gateOutro('Done');
    return 0;
  }

  // Build a flat name lookup: "providerId:modelId" → display label
  const modelLookup = new Map<string, { modelName: string; providerName: string }>();
  for (const ap of favoriteProviders) {
    for (const m of ap.models) {
      modelLookup.set(`${ap.id}:${m.id}`, { modelName: m.name || m.id, providerName: ap.name });
    }
  }

  const prefs = loadPreferences();
  let favorites = scope === 'agy'
    ? prefs.antigravityCliFavoriteModels ?? []
    : prefs.favoriteModels ?? [];
  let favoritesDirty = false;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    type MenuChoice = string;
    const options: Array<{ value: MenuChoice; label: string; hint: string }> = [];

    // One entry per saved favorite; selecting it removes it
    for (let i = 0; i < favorites.length; i++) {
      const fav = favorites[i]!;
      const entry = modelLookup.get(`${fav.providerId}:${fav.modelId}`);
      const label = entry
        ? `${fmtEnabledStar(true)} ${fmtModel(entry.modelName)} ${pc.dim(`(${entry.providerName})`)}`
        : pc.dim(`★ ${fav.modelId} — provider gone`);
      options.push({ value: `fav-${i}`, label, hint: 'select to remove' });
    }

    const atCap = favorites.length >= 20;
    options.push({
      value: '__add__',
      label: atCap ? pc.dim(`+ Add a model → (limit of 20 reached)`) : pc.cyan('+ Add a model →'),
      hint: atCap
        ? 'Remove a favorite first to make room'
        : `${favoriteProviders.length} provider${favoriteProviders.length !== 1 ? 's' : ''} available`,
    });
    options.push({ value: '__done__', label: 'Done', hint: '' });

    const header = favorites.length === 0
      ? `${scopeName} (0/20)`
      : `${scopeName} (${favorites.length}/20) — select to remove`;

    const choice = await p.select<string>({
      message: header,
      options,
      initialValue: '__done__',
    });

    if (p.isCancel(choice) || choice === '__done__') break;

    if (choice === '__add__') {
      if (atCap) {
        p.log.warn('Limit of 20 favorites reached — remove one first.');
        continue;
      }

      const globalCount = buildGlobalFavoriteIndex(favoriteProviders).length;
      const addPath = await p.select<string>({
        message: 'Add a favorite',
        options: [
          {
            value: 'global',
            label: pc.cyan('Search all providers'),
            hint: `${globalCount} models · ${favoriteProviders.length} provider${favoriteProviders.length !== 1 ? 's' : ''}`,
          },
          {
            value: 'free',
            label: pc.cyan('Search free models'),
            hint: `${buildGlobalFavoriteIndex(favoriteProviders).filter(e => e.model.isFree || e.model.freeStatus === 'verified_free' || e.model.freeStatus === 'free_provider').length} free/free-access models`,
          },
          {
            value: 'provider',
            label: pc.cyan('Browse by provider →'),
            hint: 'Pick one provider first',
          },
        ],
      });
      if (p.isCancel(addPath)) continue;

      let provider: { id: string; name: string; models: any[] } | undefined;
      let browsedMultiple: any[] = [];

      if (addPath === 'global') {
        const globalPick = await pickGlobalFavoriteModel(favoriteProviders, favorites);
        if (globalPick === null) continue;
        if (globalPick !== browseByProviderChoice) {
          provider = favoriteProviders.find(ap => ap.id === globalPick.providerId);
          browsedMultiple = [globalPick.model];
        }
      }
      if (addPath === 'free') {
        const globalPick = await pickGlobalFavoriteModel(favoriteProviders, favorites, { freeOnly: true });
        if (globalPick === null) continue;
        if (globalPick !== browseByProviderChoice) {
          provider = favoriteProviders.find(ap => ap.id === globalPick.providerId);
          browsedMultiple = [globalPick.model];
        }
      }

      if (browsedMultiple.length === 0) {
        let currentInitialProvider: string | undefined = undefined;
        while (true) {
          const providerOptions = favoriteProviders.map(ap => ({
            value: ap.id,
            label: ap.name,
            hint: `${ap.models.length} models`,
          }));
          const pickedProviderId: string | symbol = await p.select<string>({
            message: 'Which provider?',
            options: providerOptions,
            initialValue: currentInitialProvider,
          });
          if (p.isCancel(pickedProviderId)) break;

          provider = favoriteProviders.find(ap => ap.id === pickedProviderId)!;

          const options = provider.models.map(m => {
            const favorited = isFavorite(favorites, { providerId: provider!.id, modelId: m.id });
            const label = formatModelLabel(m);
            return {
              value: m.id,
              label: `${favorited ? '★ ' : ''}${fmtModel(label, m.id)}`,
              hint: favorited ? pc.yellow('★ already favorite') : '',
            };
          });

          const pickedModelIds = await p.multiselect<string>({
            message: `Select models to add from ${provider.name} ${pc.dim('(Space to select, Enter to confirm)')}`,
            options,
            required: false,
          });

          if (p.isCancel(pickedModelIds)) {
            currentInitialProvider = provider.id;
            continue;
          }

          if (pickedModelIds.length === 0) {
            currentInitialProvider = provider.id;
            continue;
          }

          browsedMultiple = provider.models.filter(m => (pickedModelIds as string[]).includes(m.id));
          break;
        }
        if (browsedMultiple.length === 0) continue;
      }

      const addedModels: any[] = [];
      let duplicateCount = 0;
      let limitReached = false;

      for (const model of browsedMultiple) {
        const fav = { providerId: provider!.id, modelId: model.id };
        const result = addFavorite(favorites, fav, 20);
        if (!result.ok) {
          if (result.reason === 'duplicate') {
            duplicateCount++;
          } else {
            limitReached = true;
            break;
          }
        } else {
          favorites = result.list;
          favoritesDirty = true;
          addedModels.push(model);
        }
      }

      if (addedModels.length > 0) {
        if (addedModels.length === 1) {
          const modelName = addedModels[0].name || addedModels[0].id;
          p.log.success(`Added ${modelName} (${provider!.name}) to favorites.`);
        } else {
          p.log.success(`Added ${addedModels.length} models from ${provider!.name} to favorites.`);
        }
      }
      if (duplicateCount > 0) {
        p.log.warn(`${duplicateCount} selected model(s) were already in your favorites.`);
      }
      if (limitReached) {
        p.log.warn(`Limit of 20 favorites reached — some selected models could not be added.`);
      }
    } else if (choice.startsWith('fav-')) {
      const idx = parseInt(choice.slice(4), 10);
      const fav = favorites[idx]!;
      const entry = modelLookup.get(`${fav.providerId}:${fav.modelId}`);
      const label = entry ? `${entry.modelName} (${entry.providerName})` : fav.modelId;
      const confirmed = await p.confirm({ message: `Remove ${label} from favorites?` });
      if (p.isCancel(confirmed) || !confirmed) continue;
      favorites = removeFavorite(favorites, fav);
      favoritesDirty = true;
      p.log.success(`Removed ${label} from favorites.`);
    }
  }

  if (favoritesDirty) {
    savePreferences({ [configKey]: favorites });
  }

  const favLabel = scope === 'agy' ? 'Antigravity CLI ' : '';
  gateOutro(
    favorites.length === 0
      ? `No ${favLabel}favorites saved`
      : `${favorites.length} ${favLabel}favorite${favorites.length !== 1 ? 's' : ''} saved`,
    favorites.length === 0
      ? pc.dim('Launch uses single-model mode')
      : pc.cyan('/model menu ready on next launch'),
  );
  return 0;
}