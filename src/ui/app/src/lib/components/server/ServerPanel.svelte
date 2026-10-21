<script lang="ts">
  import type { UiServerProviderOption, UiServerProviderModel } from '../../api/types';
  import { Button, Toggle, Spinner, Badge, Input } from '../primitives';
  import ServerStatusBadge from './ServerStatusBadge.svelte';
  import { server, start, stop } from '../../stores/server.svelte';
  import { getServerProviders } from '../../api/endpoints';
  import { toast } from '../../stores/ui.svelte';
  import { favorites } from '../../stores/favorites.svelte';
  import {
    buildExposedModelKeys,
    countServedModels,
    isFavoriteModel,
    isFreeServerModel,
    pickedModelIds,
  } from '../../server/selection';

  /** View filter over the model lists: price, or only your favorites. */
  type ModelFilter = 'all' | 'free' | 'paid' | 'favorites';

  interface Props { onneedsmodels?: () => void; }
  let { onneedsmodels }: Props = $props();

  let favoritesOnly = $state(false);
  let freeModelsOnly = $state(false);
  let maskGatewayIds = $state(false);
  let listenMode = $state<'local' | 'network'>('local');
  let password = $state('');
  let savePassword = $state(true);

  // null = expose every provider (backend treats null/empty as "all").
  let selectedProviders = $state<string[] | null>(null);
  let providerOptions = $state<UiServerProviderOption[]>([]);
  let providersLoading = $state(false);
  let providersError = $state<string | null>(null);

  /**
   * providerId -> picked model ids. A provider with no entry falls back to
   * "all of its models", which is also the default before anything is picked.
   */
  let modelPicks = $state<Record<string, string[]>>({});
  /** View filter over the model lists. */
  let modelFilter = $state<ModelFilter>('all');
  /** Free-text filter over the model lists. */
  let query = $state('');
  /** Provider ids whose model list is expanded. */
  let openProviders = $state<string[]>([]);

  const status = $derived(server.status);
  const hasSavedPassword = $derived(status?.saved.hasSavedPassword ?? false);

  // Models actually being served, grouped by provider so the endpoint list
  // reflects the provider filter that produced it.
  const servedGroups = $derived.by(() => {
    const rows = status?.models ?? [];
    const groups = new Map<string, typeof rows>();
    for (const row of rows) {
      const list = groups.get(row.providerLabel) ?? [];
      list.push(row);
      groups.set(row.providerLabel, list);
    }
    return [...groups.entries()].map(([label, models]) => ({ label, models }));
  });

  const selectedProviderList = $derived.by(() => {
    if (selectedProviders === null) return providerOptions;
    const allowed = new Set(selectedProviders);
    return providerOptions.filter(p => allowed.has(p.id));
  });

  /**
   * How many models each view filter leaves in the selected providers. The
   * counts describe what the model lists show, not what the gateway serves.
   */
  const filterCounts = $derived.by(() => {
    let all = 0;
    let free = 0;
    let fav = 0;
    for (const p of selectedProviderList) {
      for (const m of p.models) {
        all++;
        if (isFreeModel(m)) free++;
        if (isFavorite(p, m)) fav++;
      }
    }
    return { all, free, paid: all - free, favorites: fav };
  });

  /**
   * Favorites the server could serve at all. The server catalog drops models
   * it cannot route (Cloud Code models, formats without an SDK), so a favorite
   * can exist in the app and still be invisible to the gateway.
   */
  const servableFavorites = $derived.by(() => {
    let count = 0;
    for (const p of providerOptions) {
      for (const m of p.models) if (isFavorite(p, m)) count++;
    }
    return count;
  });

  /**
   * How the favorites split up inside the selected providers: how many the
   * server can route, and how many of those are actually ticked.
   *
   * A favorite that is not ticked is excluded by the model selection, which
   * is the one thing the panel cannot fix on its own — hence the note below.
   */
  const favoriteSplit = $derived.by(() => {
    let available = 0;
    let picked = 0;
    for (const p of selectedProviderList) {
      const ticked = new Set(picksFor(p));
      for (const m of p.models) {
        if (!isFavorite(p, m)) continue;
        available++;
        if (ticked.has(m.id)) picked++;
      }
    }
    return { available, picked, excluded: available - picked };
  });

  /**
   * The models the gateway will actually serve: the picked models of the
   * selected providers, minus whatever the favorites/free filters drop.
   */
  const servedCount = $derived.by(() =>
    countServedModels(selectedProviderList, modelPicks, {
      freeOnly: freeModelsOnly,
      favorites: favoritesOnly ? favorites.general : undefined,
    })
  );

  /** The picked models before the serve filters are applied. */
  const pickedCountAll = $derived.by(() =>
    countServedModels(selectedProviderList, modelPicks)
  );

  /**
   * The model selection sent to the backend, as `providerId:modelId` keys.
   *
   * `null` means "every model of the exposed providers" — sent when each
   * exposed provider is fully picked, so the saved config stays small and a
   * provider added later defaults to all of its models.
   */
  const exposedModels = $derived.by((): string[] | null =>
    buildExposedModelKeys(selectedProviderList, modelPicks)
  );

  function isFreeModel(m: UiServerProviderModel): boolean {
    return isFreeServerModel(m);
  }

  function isFavorite(p: UiServerProviderOption, m: UiServerProviderModel): boolean {
    return isFavoriteModel(favorites.general, p.id, m.id);
  }

  /**
   * Whether the gateway would actually serve this model.
   *
   * The serve filters (favorites, free) cut into the ticked models, so a
   * ticked model can still be left out. Rows that are filtered out are dimmed
   * so the picker never disagrees with the exposed-model count.
   */
  function willServe(p: UiServerProviderOption, m: UiServerProviderModel): boolean {
    if (favoritesOnly && !isFavorite(p, m)) return false;
    if (freeModelsOnly && !isFreeModel(m)) return false;
    return true;
  }

  function picksFor(p: UiServerProviderOption): string[] {
    return pickedModelIds(p, modelPicks);
  }

  function matchesFilter(m: UiServerProviderModel, p: UiServerProviderOption): boolean {
    if (modelFilter === 'free') return isFreeModel(m);
    if (modelFilter === 'paid') return !isFreeModel(m);
    if (modelFilter === 'favorites') return isFavorite(p, m);
    return true;
  }

  function matchesQuery(m: UiServerProviderModel): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${m.name} ${m.id}`.toLowerCase().includes(q);
  }

  function visibleModels(p: UiServerProviderOption): UiServerProviderModel[] {
    return p.models.filter(m => matchesFilter(m, p) && matchesQuery(m));
  }

  /** How many of a provider's models are ticked. */
  function pickedCount(p: UiServerProviderOption): number {
    const picked = new Set(picksFor(p));
    return p.models.filter(m => picked.has(m.id)).length;
  }

  // Plain variable, not $state: the effect below both reads and writes it, and
  // tracking it would re-trigger the effect.
  let syncedKey: string | null = null;

  /**
   * Restore a saved model selection.
   *
   * A saved list is explicit — a provider it doesn't mention has no models
   * picked. No saved list means "everything", so the picks stay unset and each
   * provider falls back to all of its models.
   */
  function applySavedPicks(saved: string[] | null): void {
    if (!saved || saved.length === 0) {
      modelPicks = {};
      return;
    }
    const savedSet = new Set(saved);
    const next: Record<string, string[]> = {};
    for (const p of providerOptions) {
      next[p.id] = p.models.filter(m => savedSet.has(`${p.id}:${m.id}`)).map(m => m.id);
    }
    modelPicks = next;
  }

  function sync() {
    if (!status) return;
    favoritesOnly = status.saved.favoritesOnly;
    freeModelsOnly = status.saved.freeModelsOnly;
    maskGatewayIds = status.saved.maskGatewayIds;
    listenMode = status.saved.listenMode;
    // Restore the saved provider selection instead of silently resetting to all.
    selectedProviders = status.saved.exposedProviders ?? null;
    applySavedPicks(status.saved.exposedModels ?? null);
  }

  // Adopt saved config only when it actually changes. Syncing on every status
  // update would discard edits in progress, because status now refreshes
  // frequently (SSE events plus the fallback poll).
  $effect(() => {
    if (!status) return;
    const key = JSON.stringify(status.saved);
    if (key === syncedKey) return;
    syncedKey = key;
    sync();
  });

  async function loadProviders() {
    providersLoading = true;
    providersError = null;
    try {
      const res = await getServerProviders();
      providerOptions = res.providers ?? [];
      // The provider list arrives after the saved config, so the picks are
      // restored once both are known.
      applySavedPicks(status?.saved.exposedModels ?? null);
      // Open the first provider's models so the picker is visible without an
      // extra click, and open any provider that carries a saved pick.
      const withPicks = providerOptions
        .filter(p => (modelPicks[p.id]?.length ?? 0) > 0)
        .map(p => p.id);
      openProviders = withPicks.length > 0 ? withPicks : providerOptions.slice(0, 1).map(p => p.id);
    } catch (err) {
      providersError = err instanceof Error ? err.message : String(err);
    } finally {
      providersLoading = false;
    }
  }
  $effect(() => {
    // Wait for the status: it carries the saved model selection the picks
    // are restored from.
    if (!status) return;
    if (!status.running && providerOptions.length === 0 && !providersLoading && !providersError) void loadProviders();
  });

  /**
   * Switch the view filter over the model lists.
   *
   * A filter that hides most models would leave the matches buried inside
   * collapsed provider blocks, so the filter opens the providers that still
   * have something to show. "All" goes back to the compact default: the
   * providers that carry a pick.
   */
  function setFilter(filter: ModelFilter): void {
    modelFilter = filter;
    if (filter === 'all') {
      const withPicks = selectedProviderList.filter(p => pickedCount(p) > 0).map(p => p.id);
      openProviders =
        withPicks.length > 0 ? withPicks : selectedProviderList.slice(0, 1).map(p => p.id);
    } else {
      openProviders = selectedProviderList.filter(p => visibleModels(p).length > 0).map(p => p.id);
    }
  }

  /**
   * Reveal the providers that match a search.
   *
   * The search only narrows the rows inside an open provider block, so a
   * match in a collapsed provider would stay invisible.
   */
  function onQuery(value: string): void {
    if (!value.trim()) return;
    const matches = selectedProviderList.filter(p => visibleModels(p).length > 0).map(p => p.id);
    const merged = Array.from(new Set([...openProviders, ...matches]));
    if (merged.length !== openProviders.length) openProviders = merged;
  }

  function toggleProvider(id: string) {
    const current = selectedProviders ?? providerOptions.map((p) => p.id);
    const next = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
    // Selecting everything is equivalent to "all providers".
    selectedProviders = next.length === providerOptions.length ? null : next;
    // A newly exposed provider opens its model list so the models it would
    // serve are visible right away; a deselected one closes again.
    if (current.includes(id)) {
      openProviders = openProviders.filter(x => x !== id);
    } else if (!openProviders.includes(id)) {
      openProviders = [...openProviders, id];
    }
  }

  function isSelected(id: string): boolean {
    return selectedProviders === null || selectedProviders.includes(id);
  }

  function isOpen(id: string): boolean {
    return openProviders.includes(id);
  }

  function toggleOpen(id: string) {
    openProviders = openProviders.includes(id)
      ? openProviders.filter(x => x !== id)
      : [...openProviders, id];
  }

  function toggleModel(p: UiServerProviderOption, modelId: string) {
    const current = picksFor(p);
    const next = current.includes(modelId) ? current.filter(id => id !== modelId) : [...current, modelId];
    modelPicks = { ...modelPicks, [p.id]: next };
  }

  function isPicked(p: UiServerProviderOption, modelId: string): boolean {
    return picksFor(p).includes(modelId);
  }

  function selectVisible(p: UiServerProviderOption): void {
    const picked = new Set(picksFor(p));
    for (const m of visibleModels(p)) picked.add(m.id);
    modelPicks = { ...modelPicks, [p.id]: [...picked] };
  }

  function clearProvider(p: UiServerProviderOption): void {
    modelPicks = { ...modelPicks, [p.id]: [] };
  }

  /**
   * Add every favorite of the selected providers to the model selection.
   *
   * "Favorites only" intersects the selection with the favorites, so a
   * selection saved before a model was favorited would silently drop it.
   * This puts the favorites back into the selection — the picker shows them
   * ticked, so the change is visible.
   */
  function tickFavorites(): void {
    const next = { ...modelPicks };
    for (const p of selectedProviderList) {
      const favs = p.models.filter((m) => isFavorite(p, m));
      if (favs.length === 0) continue;
      const picked = new Set(pickedModelIds(p, next));
      for (const m of favs) picked.add(m.id);
      next[p.id] = [...picked];
    }
    modelPicks = next;
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard', 'success');
    } catch {
      toast('Could not copy to clipboard', 'error');
    }
  }

  async function doStart() {
    if (status?.running) { await stop(); return; }

    // Empty selection would expose nothing; treat it as an explicit error
    // rather than silently starting an empty server.
    if (selectedProviders !== null && selectedProviders.length === 0) {
      toast('Select at least one provider to serve', 'error');
      return;
    }

    if (servedCount === 0) {
      // The picks are fine but a serve filter emptied them — say which one,
      // instead of blaming the model selection.
      toast(
        favoritesOnly && pickedCountAll > 0
          ? 'None of the ticked models are favorites — add favorites in the Favorites tab, or turn off "Favorites only".'
          : freeModelsOnly && pickedCountAll > 0
            ? 'None of the ticked models are free — turn off "Free models only" or pick a free model.'
            : 'Select at least one model to serve',
        'error'
      );
      return;
    }

    // Reuse the stored password when one exists and the user hasn't typed a new
    // one. Previously this generated a random password and overwrote the saved
    // one, locking out every client already configured with it.
    const typed = password.trim();
    const useSaved = listenMode === 'network' && !typed && hasSavedPassword;
    if (listenMode === 'network' && !typed && !hasSavedPassword) {
      toast('A server password is required for network mode', 'error');
      return;
    }

    const ok = await start({
      favoritesOnly,
      freeModelsOnly,
      exposedProviders: selectedProviders,
      exposedModels,
      maskGatewayIds,
      listenMode,
      passwordMode: useSaved ? 'saved' : 'new',
      password: useSaved ? undefined : typed,
      savePassword,
    });
    if (!ok && server.error?.includes('No providers')) onneedsmodels?.();
  }
</script>

<div class="panel">
  <div class="head">
    <div class="head-text">
      <h3>Server Gateway</h3>
      <p class="desc">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p>
    </div>
    <div class="head-actions">
      <ServerStatusBadge {status} />
      <Button variant={status?.running ? 'danger' : 'primary'} disabled={server.starting} onclick={doStart}>
        {server.starting ? 'Working…' : status?.running ? 'Stop server' : 'Start server'}
      </Button>
    </div>
  </div>

  {#if status?.running}
    <div class="urls">
      <div class="url">
        <span class="lbl">Anthropic</span><code>{status.anthropicUrl}</code>
        <button class="copy" onclick={() => copy(status.anthropicUrl ?? '')} title="Copy URL">Copy</button>
      </div>
      <div class="url">
        <span class="lbl">OpenAI</span><code>{status.openaiUrl}</code>
        <button class="copy" onclick={() => copy(status.openaiUrl ?? '')} title="Copy URL">Copy</button>
      </div>
      {#if status.listenMode === 'network' && status.networkUrls}
        {#each status.networkUrls as u (u.name)}
          <div class="url">
            <span class="lbl">{u.name}</span><code>{u.anthropicUrl}</code>
            <button class="copy" onclick={() => copy(u.anthropicUrl)} title="Copy URL">Copy</button>
          </div>
        {/each}
        <div class="url">
          <span class="lbl">Key</span><code>{status.apiKey}</code>
          <button class="copy" onclick={() => copy(status.apiKey ?? '')} title="Copy API key">Copy</button>
        </div>
      {/if}
    </div>

    {#if status.providerSummary}<div class="summary">{status.providerSummary}</div>{/if}

    {#if servedGroups.length > 0}
      <div class="served">
        <div class="served-head">
          <h4>Model endpoints</h4>
          <span class="hint">{status.models?.length} model{status.models?.length === 1 ? '' : 's'} served</span>
        </div>
        {#each servedGroups as group (group.label)}
          <div class="group">
            <div class="group-name">{group.label}<span class="group-count">{group.models.length}</span></div>
            {#each group.models as m (m.anthropicId)}
              <div class="model">
                <span class="model-name" title={m.name}>{m.name}</span>
                <button class="mid-btn" title="Copy Anthropic model id: {m.anthropicId}" onclick={() => copy(m.anthropicId)}>{m.anthropicId}</button>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="opts">
      <Toggle bind:checked={favoritesOnly} label="Favorites only" />
      <Toggle bind:checked={freeModelsOnly} label="Free models only" />
      <Toggle bind:checked={maskGatewayIds} label="Mask gateway IDs" />
      <Toggle checked={listenMode === 'network'} onchange={(v) => listenMode = v ? 'network' : 'local'} label="Network mode" />
      {#if listenMode === 'network'}
        <span class="lbl">Server password</span>
        <input class="inp" type="password" bind:value={password} placeholder={hasSavedPassword ? 'Using saved password — type to replace' : 'required for network mode'} />
        <Toggle bind:checked={savePassword} label="Save password" />
      {/if}
    </div>

    <div class="providers">
      <div class="prov-head">
        <div>
          <h4>Providers to serve</h4>
          <p class="prov-desc">Choose which providers appear on the model endpoints, then pick the models each one exposes. Leave all selected to serve everything.</p>
        </div>
        {#if providerOptions.length > 0}
          <div class="prov-actions">
            <button class="link" onclick={() => (selectedProviders = null)}>All</button>
            <button class="link" onclick={() => (selectedProviders = [])}>None</button>
          </div>
        {/if}
      </div>

      {#if providersLoading}
        <Spinner label="Loading providers…" />
      {:else if providersError}
        <p class="prov-err">Couldn’t load providers ({providersError}). <button class="link" onclick={() => loadProviders()}>Retry</button></p>
      {:else if providerOptions.length === 0}
        <p class="prov-empty">No providers available. Add one first.</p>
      {:else}
        <!-- Provider selector -->
        <div class="prov-grid">
          {#each providerOptions as p (p.id)}
            <button class="prov" class:on={isSelected(p.id)} aria-pressed={isSelected(p.id)} onclick={() => toggleProvider(p.id)}>
              <span class="tick" aria-hidden="true">{isSelected(p.id) ? '✓' : ''}</span>
              <span class="prov-name" title={p.id}>{p.name}</span>
              <span class="prov-count">{p.modelCount}</span>
            </button>
          {/each}
        </div>

        <!-- View filter over the model lists below -->
        <div class="filters">
          <div class="seg">
            <button class="segbtn" class:active={modelFilter === 'all'} onclick={() => setFilter('all')}>All · {filterCounts.all}</button>
            <button class="segbtn" class:active={modelFilter === 'free'} onclick={() => setFilter('free')}>Free · {filterCounts.free}</button>
            <button class="segbtn" class:active={modelFilter === 'paid'} onclick={() => setFilter('paid')}>Paid · {filterCounts.paid}</button>
            <button class="segbtn" class:active={modelFilter === 'favorites'} onclick={() => setFilter('favorites')}>Favorites · {filterCounts.favorites}</button>
          </div>
          <Input bind:value={query} oninput={onQuery} placeholder="Search models…" />
        </div>

        <!-- Each selected provider's models, in provider order, below the selector -->
        <div class="prov-models">
          {#each selectedProviderList as p (p.id)}
            <div class="pmodel" class:open={isOpen(p.id)}>
              <button class="pmodel-head" aria-expanded={isOpen(p.id)} onclick={() => toggleOpen(p.id)}>
                <span class="chev" class:open={isOpen(p.id)} aria-hidden="true">▾</span>
                <span class="pmodel-name">{p.name}</span>
                <span class="pmodel-count">
                  {pickedCount(p)} of {p.models.length} selected
                  {#if modelFilter !== 'all'}
                    <span class="mshown">· {visibleModels(p).length} shown</span>
                  {/if}
                </span>
              </button>

              {#if isOpen(p.id)}
                <div class="models">
                  <div class="mhead">
                    <span class="mcount">
                      {pickedCount(p)} of {p.models.length} selected
                      {#if visibleModels(p).length !== p.models.length}
                        <span class="mshown">· {visibleModels(p).length} shown</span>
                      {/if}
                    </span>
                    <div class="mactions">
                      <button class="link" onclick={() => selectVisible(p)}>Select visible</button>
                      <button class="link" onclick={() => clearProvider(p)}>None</button>
                    </div>
                  </div>
                  <div class="mlist">
                    {#each visibleModels(p) as m (m.id)}
                      <label class="mrow" class:muted={!willServe(p, m)}>
                        <input
                          type="checkbox"
                          checked={isPicked(p, m.id)}
                          onchange={() => toggleModel(p, m.id)}
                        />
                        <span class="mbody">
                          <span class="mname" title={m.name}>{m.name}</span>
                          <span class="mid">{m.id}</span>
                        </span>
                        {#if isFavorite(p, m)}
                          <Badge tone="accent"><span title="Favorite model">★</span></Badge>
                        {/if}
                        {#if isFreeModel(m)}<Badge tone="success">Free</Badge>{/if}
                      </label>
                    {:else}
                      <div class="mempty">No models match — adjust the filter or the search.</div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <p class="prov-empty">No providers selected — pick at least one above.</p>
          {/each}
        </div>

        {#if favoritesOnly}
          <div class="note">
            {#if servableFavorites === 0}
              Favorites only — none of your {favorites.general.length} favorite model{favorites.general.length === 1 ? '' : 's'} can be served by the server. Cloud Code models and formats without a server route are excluded. Turn off “Favorites only”, or pick a model above.
            {:else if favoriteSplit.excluded > 0}
              Favorites only — {favoriteSplit.picked} of your {favorites.general.length} favorite model{favorites.general.length === 1 ? '' : 's'} will be served. {favoriteSplit.excluded} {favoriteSplit.excluded === 1 ? 'is' : 'are'} excluded by your model selection.
              <button class="link" onclick={tickFavorites}>Tick the favorites</button>
            {:else}
              Favorites only — {favoriteSplit.picked} of your {favorites.general.length} favorite model{favorites.general.length === 1 ? '' : 's'} will be served, narrowed to the selected providers and the models ticked above.
            {/if}
          </div>
        {/if}

        <p class="prov-sum">
          {#if selectedProviders === null}
            Serving all {providerOptions.length} providers
          {:else if selectedProviders.length === 0}
            <span class="warn">No providers selected — pick at least one.</span>
          {:else}
            Serving {selectedProviders.length} of {providerOptions.length} providers
          {/if}
          · <span class="served-n">{servedCount} model{servedCount === 1 ? '' : 's'} exposed</span>
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .head-text { min-width: 0; }
  .head-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  h3 { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-1); }
  h4 { font-family: var(--font-display); font-size: 13.5px; font-weight: 700; color: var(--text-1); }
  .desc { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 460px; }
  .urls { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
  .url { display: flex; gap: 10px; align-items: center; }
  .lbl { font-size: 11px; text-transform: uppercase; color: var(--text-3); width: 70px; flex-shrink: 0; }
  code { font-family: ui-monospace, monospace; font-size: 12px; background: var(--surface-2); padding: 4px 9px; border-radius: 6px; color: var(--accent); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .copy { flex-shrink: 0; font-size: 11px; font-weight: 600; color: var(--text-3); background: none; border: 1px solid var(--border); padding: 4px 9px; border-radius: 6px; cursor: pointer; transition: color var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease); }
  .copy:hover { color: var(--accent); border-color: var(--accent); }
  .summary { margin-top: 12px; font-size: 12.5px; color: var(--text-2); background: var(--surface-2); padding: 9px 12px; border-radius: var(--radius-sm); }
  .opts { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
  .lbl { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
  .inp { width: 100%; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13.5px; }
  .inp:focus { outline: none; border-color: var(--accent); }

  .providers { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; }
  .prov-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .prov-desc { font-size: 12.5px; color: var(--text-3); margin-top: 3px; max-width: 460px; }
  .prov-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .link { background: none; border: none; color: var(--accent); font-size: 12px; font-weight: 600; cursor: pointer; padding: 2px 4px; }
  .link:hover { text-decoration: underline; }

  /* Provider selector */
  .prov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
  .prov { display: flex; align-items: center; gap: 9px; padding: 9px 11px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-2); cursor: pointer; text-align: left; transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease); }
  .prov:hover { border-color: var(--border-bright); }
  .prov.on { border-color: var(--accent); background: var(--accent-muted); }
  .tick { width: 14px; height: 14px; flex-shrink: 0; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: var(--accent); border: 1px solid var(--border-bright); border-radius: 4px; }
  .prov.on .tick { border-color: var(--accent); }
  .prov-name { flex: 1; min-width: 0; font-size: 13px; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prov-count { font-size: 11px; color: var(--text-3); font-variant-numeric: tabular-nums; }

  /* View filter over the model lists */
  .filters { display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
  .seg { display: flex; gap: 6px; }
  .segbtn {
    flex: 1;
    padding: 7px 10px;
    font-size: 12.5px; font-weight: 600;
    color: var(--text-3);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: color var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease);
    font-family: inherit;
  }
  .segbtn:hover { color: var(--text-1); border-color: var(--border-bright); }
  .segbtn.active { color: var(--accent); border-color: var(--accent); background: var(--accent-muted); }

  /* Each provider's models, under the provider selector */
  .prov-models { display: flex; flex-direction: column; gap: 8px; }
  .pmodel { border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); overflow: hidden; }
  .pmodel-head {
    width: 100%;
    display: flex; align-items: center; gap: 9px;
    padding: 9px 11px;
    background: none; border: none; cursor: pointer; text-align: left; font-family: inherit;
    color: var(--text-1);
    transition: background var(--dur-sm) var(--ease);
  }
  .pmodel-head:hover { background: var(--surface-hover); }
  .pmodel-name { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pmodel-count { font-size: 11.5px; color: var(--text-3); font-variant-numeric: tabular-nums; }
  .chev {
    flex-shrink: 0;
    color: var(--text-3); font-size: 12px;
    transform: rotate(-90deg);
    transition: color var(--dur-sm) var(--ease), transform var(--dur-sm) var(--ease);
  }
  .chev.open { transform: rotate(0deg); }

  .models { border-top: 1px solid var(--border); padding: 10px 11px 11px; background: var(--surface); }
  .mhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
  .mcount { font-size: 11.5px; color: var(--text-3); }
  .mshown { color: var(--text-3); opacity: 0.8; }
  .mactions { display: flex; gap: 10px; }
  .mactions .link { font-size: 11.5px; }
  .mlist { display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow-y: auto; padding: 2px; }
  .mrow {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 9px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color var(--dur-xs) var(--ease);
  }
  .mrow:hover { border-color: var(--border-bright); }
  /* Ticked but filtered out by a serve filter — the gateway will not serve it. */
  .mrow.muted { opacity: 0.45; }
  .mrow input[type="checkbox"] { accent-color: var(--accent); width: 15px; height: 15px; flex-shrink: 0; cursor: pointer; }
  .mbody { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
  .mname { font-size: 13px; font-weight: 600; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mid { font-size: 11px; color: var(--text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mempty { font-size: 12.5px; color: var(--text-3); padding: 12px 4px; text-align: center; }

  .note { margin-top: 12px; font-size: 12.5px; color: var(--text-2); background: var(--surface-2); border: 1px solid var(--border); padding: 9px 12px; border-radius: var(--radius-sm); line-height: 1.5; }
  .prov-sum { margin-top: 10px; font-size: 12.5px; color: var(--text-3); }
  .prov-sum .warn { color: var(--warning); }
  .served-n { color: var(--accent); font-weight: 600; }
  .prov-err, .prov-empty { font-size: 12.5px; color: var(--text-3); }

  .served { margin-top: 18px; border-top: 1px solid var(--border); padding-top: 16px; }
  .served-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .hint { font-size: 12px; color: var(--text-3); }
  .group { margin-bottom: 12px; }
  .group-name { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 5px; }
  .group-count { font-size: 10.5px; color: var(--text-3); background: var(--surface-2); padding: 1px 7px; border-radius: 999px; }
  .model { display: flex; align-items: center; gap: 10px; padding: 5px 0 5px 10px; border-left: 2px solid var(--border); }
  .model-name { flex: 1; min-width: 0; font-size: 12.5px; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mid-btn { font-family: ui-monospace, monospace; font-size: 11px; color: var(--text-3); background: var(--surface-2); border: 1px solid transparent; padding: 2px 8px; border-radius: 5px; cursor: pointer; max-width: 46%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease); }
  .mid-btn:hover { color: var(--accent); border-color: var(--accent); }
</style>
