<script lang="ts">
  import { providers } from '../lib/stores/providers.svelte';
  import type { EnrichedModel } from '../lib/stores/providers.svelte';
  import { favorites, addFavorite, removeFavorite } from '../lib/stores/favorites.svelte';
  import ModelRow from '../lib/components/models/ModelRow.svelte';
  import ModelFilters from '../lib/components/models/ModelFilters.svelte';
  import ModelDetailDrawer from '../lib/components/models/ModelDetailDrawer.svelte';
  import FavoriteList from '../lib/components/favorites/FavoriteList.svelte';
  import CapacityMeter from '../lib/components/favorites/CapacityMeter.svelte';
  import { Card, Spinner, EmptyState, Tabs } from '../lib/components/primitives';
  import type { FavoriteModel } from '../lib/api/types';

  type Filters = { provider: string; format: string; free: string; reasoning: string; query: string; sort: 'ctx' | 'cost' | 'name' };
  let filters = $state<Filters>({ provider: '', format: '', free: '', reasoning: '', query: '', sort: 'ctx' });
  let detail = $state<{ model: EnrichedModel; providerId: string; providerName: string } | null>(null);
  let favTab = $state<'general' | 'agy'>('general');

  interface Flat { model: EnrichedModel; providerId: string; providerName: string; }
  const flat = $derived(
    providers.list.flatMap(p => p.enrichedModels.map(m => ({ model: m, providerId: p.id, providerName: p.name })))
  );

  function costNum(c?: unknown): number {
    if (!c || typeof c !== 'object') return 0;
    const o = c as Record<string, number>;
    return (o.input ?? 0) + (o.output ?? 0);
  }

  const filtered = $derived(
    flat
      .filter(f =>
        (!filters.provider || f.providerId === filters.provider) &&
        (!filters.format || f.model.format === filters.format) &&
        (!filters.free || (filters.free === 'free' ? f.model.isFree : !f.model.isFree)) &&
        (!filters.reasoning || (filters.reasoning === 'yes' ? f.model.reasoning : !f.model.reasoning)) &&
        (!filters.query || (f.model.name ?? f.model.id).toLowerCase().includes(filters.query.toLowerCase()) || f.model.id.toLowerCase().includes(filters.query.toLowerCase()))
      )
      .sort((a, b) => {
        if (filters.sort === 'name') return (a.model.name ?? a.model.id).localeCompare(b.model.name ?? b.model.id);
        if (filters.sort === 'cost') return costNum(a.model.cost) - costNum(b.model.cost);
        return (b.model.contextWindow ?? 0) - (a.model.contextWindow ?? 0);
      })
  );

  function isFav(providerId: string, modelId: string): boolean {
    const list = favTab === 'agy' ? favorites.agy : favorites.general;
    return list.some(f => f.providerId === providerId && f.modelId === modelId);
  }

  async function toggleFav(f: Flat) {
    const m = f.model;
    if (isFav(f.providerId, m.id)) {
      await removeFavorite(f.providerId, m.id, favTab === 'agy');
    } else {
      const fav: FavoriteModel = { providerId: f.providerId, providerName: f.providerName, model: m.id, modelId: m.id, contextWindow: m.contextWindow, cost: m.cost };
      await addFavorite(fav, favTab === 'agy');
    }
  }

  async function reorder(next: FavoriteModel[]) {
    if (favTab === 'agy') favorites.agy = next; else favorites.general = next;
    // persist via store
    await import('../lib/stores/favorites.svelte').then(m => m.reorder(next, favTab === 'agy'));
  }
</script>

<div class="page">
  <div class="head">
    <h2>Models</h2>
    <p class="sub">Browse every model anygate can route. Star any model to add it to your favorites.</p>
  </div>

  <div class="layout">
    <div class="main-col">
      <ModelFilters providers={providers.list.map(p => ({ id: p.id, name: p.name }))} bind:value={filters} />
      {#if providers.loading}
        <Spinner label="Loading modelsâ€¦" />
      {:else if filtered.length === 0}
        <EmptyState title="No models match" icon="M4 6h16M4 12h16M4 18h16">Adjust filters or connect more providers.</EmptyState>
      {:else}
        <Card padding="6px">
          {#each filtered as f (f.providerId + '/' + f.model.id)}
            <ModelRow model={f.model} providerId={f.providerId} favorited={isFav(f.providerId, f.model.id)} onToggleFav={() => toggleFav(f)} onOpen={() => detail = f} />
          {/each}
        </Card>
      {/if}
    </div>

    <aside class="fav-col">
      <Card padding="18px">
        <div class="fav-head">
          <h3>Favorites</h3>
          <CapacityMeter used={favTab === 'agy' ? favorites.agy.length : favorites.general.length} max={favTab === 'agy' ? 6 : 20} label={favTab === 'agy' ? 'AGY' : 'General'} />
        </div>
        <Tabs tabs={[{ id: 'general', label: 'General (20)' }, { id: 'agy', label: 'AGY (6)' }]} bind:active={favTab} />
        <div style="margin-top:14px">
          <FavoriteList
            items={favTab === 'agy' ? favorites.agy : favorites.general}
            max={favTab === 'agy' ? 6 : 20}
            onreorder={reorder}
            onremove={(f) => removeFavorite(f.providerId, f.modelId, favTab === 'agy')}
          />
        </div>
      </Card>
    </aside>
  </div>
</div>

<ModelDetailDrawer open={!!detail} model={detail?.model ?? null} providerId={detail?.providerId ?? ''} providerName={detail?.providerName ?? ''} onclose={() => detail = null} />

<style>
  .head { margin-bottom: 18px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; }
  .layout { display: grid; grid-template-columns: 1fr 360px; gap: 18px; align-items: start; }
  .fav-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  h3 { font-family: var(--font-display); font-size: 15px; font-weight: 700; }
  @media (max-width: 920px) { .layout { grid-template-columns: 1fr; } }
</style>
