<script lang="ts">
  import { apps, launch, setPath, browseFolder } from '../lib/stores/apps.svelte';
  import { providers } from '../lib/stores/providers.svelte';
  import { favorites } from '../lib/stores/favorites.svelte';
  import AppCard from '../lib/components/apps/AppCard.svelte';
  import { Card, Button, Select, Input, Modal, Spinner, EmptyState, Badge } from '../lib/components/primitives';
  import type { UiApp } from '../lib/api/types';

  type LaunchMode = 'specific' | 'custom' | 'favorites' | 'open';
  type PriceFilter = 'all' | 'free' | 'paid';

  /** Server-side MAX_MODEL_CATALOG — the UI has no import of server constants. */
  const CUSTOM_MAX = 20;

  let launchAppId = $state<string | null>(null);
  let mode = $state<LaunchMode>('specific');
  let selProvider = $state('');
  let selModel = $state('');
  let price = $state<PriceFilter>('all');
  let query = $state('');
  let selChecked = $state<string[]>([]);
  let cwd = $state('');
  let pathTarget = $state<UiApp | null>(null);
  let pathInput = $state('');

  const target = $derived(apps.list.find(a => a.id === launchAppId));
  const favCount = $derived(
    target && (target.id === 'antigravity' || target.id === 'agy' || target.id === 'antigravity-ide')
      ? favorites.agy.length
      : favorites.general.length
  );
  const modelOptions = $derived(
    selProvider ? (providers.list.find(p => p.id === selProvider)?.enrichedModels ?? []).map(m => ({ value: m.id, label: m.name ?? m.id })) : []
  );

  function isFreeModel(m: { isFree: boolean; freeStatus?: string }): boolean {
    return m.isFree || m.freeStatus === 'verified_free' || m.freeStatus === 'free_provider';
  }
  function isPaidModel(m: { isFree: boolean; freeStatus?: string }): boolean {
    return !isFreeModel(m) && m.freeStatus === 'paid';
  }

  const customModels = $derived(
    selProvider ? (providers.list.find(p => p.id === selProvider)?.enrichedModels ?? []) : []
  );
  const customCounts = $derived({
    all: customModels.length,
    free: customModels.filter(isFreeModel).length,
    paid: customModels.filter(isPaidModel).length,
  });
  const customVisible = $derived(
    customModels.filter(m =>
      (price === 'all' || (price === 'free' ? isFreeModel(m) : isPaidModel(m))) &&
      (!query.trim() || `${m.name ?? ''} ${m.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    )
  );

  // Reset picks whenever the provider changes.
  $effect(() => {
    selProvider;
    selChecked = [];
  });

  function toggleModel(id: string) {
    if (selChecked.includes(id)) selChecked = selChecked.filter(c => c !== id);
    else if (selChecked.length < CUSTOM_MAX) selChecked = [...selChecked, id];
  }
  function selectVisible() {
    const fresh = customVisible.map(m => m.id).filter(id => !selChecked.includes(id));
    selChecked = [...selChecked, ...fresh].slice(0, CUSTOM_MAX);
  }

  async function openLaunch(a: UiApp) {
    launchAppId = a.id;
    mode = 'specific';
    selProvider = ''; selModel = ''; cwd = '';
    price = 'all'; query = ''; selChecked = [];
    const recents = apps.recentFolders;
    cwd = recents[0] ?? '';
  }

  async function doLaunch() {
    if (!launchAppId) return;
    if (mode === 'favorites') {
      await launch({ appId: launchAppId, favoritesCatalog: true, cwd: cwd || undefined });
    } else if (mode === 'custom') {
      await launch({ appId: launchAppId, providerId: selProvider || undefined, modelIds: selChecked, cwd: cwd || undefined });
    } else if (mode === 'specific') {
      if (selModel === '__all__' && selProvider) {
        await launch({ appId: launchAppId, providerId: selProvider, allModels: true, cwd: cwd || undefined });
      } else {
        await launch({ appId: launchAppId, providerId: selProvider || undefined, modelId: selModel || undefined, cwd: cwd || undefined });
      }
    } else {
      await launch({ appId: launchAppId, cwd: cwd || undefined });
    }
    launchAppId = null;
  }

  async function openPath(a: UiApp) { pathTarget = a; pathInput = a.path ?? ''; }
  async function savePath() {
    if (!pathTarget) return;
    await setPath(pathTarget.id, pathInput.trim() || null);
    pathTarget = null;
  }
  async function pickFolder() { const p = await browseFolder(); if (p) cwd = p; }
  async function pickProviderPath() { const p = await browseFolder(); if (p) pathInput = p; }
</script>

<div class="page">
  <div class="head">
    <div>
      <h2>Apps & Launch</h2>
      <p class="sub">Open Claude, Codex, Gemini, or Antigravity with your anygate models pre-wired. Pick a launch folder per app, send your whole favorites catalog into the app's model switcher — or hand-pick a custom lineup per provider.</p>
    </div>
  </div>

  {#if apps.loading}
    <Spinner label="Detecting installed apps…" />
  {:else if apps.list.length === 0}
    <EmptyState title="No apps found" icon="M2 3h20v14H2z">anygate couldn't detect supported apps on this system.</EmptyState>
  {:else}
    <div class="grid">
      {#each apps.list as a (a.id)}
        <AppCard app={a} favCount={a.id === 'antigravity' || a.id === 'agy' || a.id === 'antigravity-ide' ? favorites.agy.length : favorites.general.length} onlaunch={openLaunch} onsetpath={openPath} />
      {/each}
    </div>
  {/if}
</div>

{#if target}
  <Modal open={!!target} title={`Launch ${target.name}`} onclose={() => launchAppId = null}>
    <div class="modes">
      <button class="mode" class:active={mode === 'favorites'} disabled={favCount === 0} onclick={() => mode = 'favorites'}>
        <span class="mode-ico">★</span>
        <span class="mode-body">
          <span class="mode-title">All favorites</span>
          <span class="mode-desc">{favCount > 0 ? `${favCount} models into the app switcher` : 'No favorites saved yet'}</span>
        </span>
      </button>
      <button class="mode" class:active={mode === 'specific'} onclick={() => mode = 'specific'}>
        <span class="mode-ico">◉</span>
        <span class="mode-body">
          <span class="mode-title">One model</span>
          <span class="mode-desc">Launch with a single pre-selected model</span>
        </span>
      </button>
      <button class="mode" class:active={mode === 'custom'} onclick={() => mode = 'custom'}>
        <span class="mode-ico">▣</span>
        <span class="mode-body">
          <span class="mode-title">Choose models…</span>
          <span class="mode-desc">Hand-pick the switcher lineup</span>
        </span>
      </button>
      <button class="mode" class:active={mode === 'open'} onclick={() => mode = 'open'}>
        <span class="mode-ico">⤢</span>
        <span class="mode-body">
          <span class="mode-title">Just open</span>
          <span class="mode-desc">Launch the app with no model pre-set</span>
        </span>
      </button>
    </div>

    {#if mode === 'specific'}
      <div class="opts">
        <span class="lbl">Provider</span>
        <Select bind:value={selProvider} options={[{ value: '', label: 'All' }, ...providers.list.map(p => ({ value: p.id, label: p.name }))]} />

         <span class="lbl">Model</span>
         <Select
           bind:value={selModel}
           disabled={!selProvider}
           options={selProvider ? [{ value: '__all__', label: 'All models' }, ...modelOptions] : [{ value: '', label: '— pick a provider first —' }]}
         />
      </div>
    {:else if mode === 'custom'}
      <div class="opts">
        <span class="lbl">Provider</span>
        <Select bind:value={selProvider} options={[{ value: '', label: 'Pick a provider…' }, ...providers.list.map(p => ({ value: p.id, label: p.name }))]} />

        {#if selProvider}
          <div class="seg">
            <button class="segbtn" class:active={price === 'all'} onclick={() => price = 'all'}>All · {customCounts.all}</button>
            <button class="segbtn" class:active={price === 'free'} onclick={() => price = 'free'}>Free · {customCounts.free}</button>
            <button class="segbtn" class:active={price === 'paid'} onclick={() => price = 'paid'}>Paid · {customCounts.paid}</button>
          </div>
          <Input bind:value={query} placeholder="Search models…" />

          <div class="pickhead">
            <span class="pickcount">{selChecked.length} selected · first boots · max {CUSTOM_MAX}</span>
            <div class="pickactions">
              <button class="linkbtn" onclick={selectVisible}>Select visible</button>
              <button class="linkbtn" onclick={() => selChecked = []}>Clear</button>
            </div>
          </div>
          <div class="picklist">
            {#each customVisible as m (m.id)}
              <label class="pick">
                <input
                  type="checkbox"
                  checked={selChecked.includes(m.id)}
                  disabled={!selChecked.includes(m.id) && selChecked.length >= CUSTOM_MAX}
                  onchange={() => toggleModel(m.id)}
                />
                <span class="pick-body">
                  <span class="pick-name">{m.name ?? m.id}</span>
                  <span class="pick-id">{m.id}</span>
                </span>
                {#if isFreeModel(m)}<Badge tone="success">Free</Badge>{/if}
              </label>
            {:else}
              <div class="pickempty">No models match — adjust the filter or search.</div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if mode === 'favorites'}
      <div class="hintbox">
        <Badge tone="success">{favCount} favorites</Badge>
        <span>Opens the app with every favorite routed through one anygate gateway — switch live from the in-app model menu.</span>
      </div>
    {/if}

    <div class="opts" style="margin-top:16px">
      <span class="lbl">Launch folder</span>
      <div class="folder">
        <Input bind:value={cwd} placeholder="Path or browse…" />
        <Button size="sm" variant="ghost" onclick={pickFolder}>Browse</Button>
      </div>
      {#if apps.recentFolders.filter(f => f !== cwd).length}
        <div class="recents">
          {#each apps.recentFolders.filter(f => f !== cwd).slice(0, 4) as f}<button class="recent" onclick={() => cwd = f}>{f}</button>{/each}
        </div>
      {/if}
    </div>

    {#snippet footer()}
      <div class="row actions">
        <Button variant="ghost" onclick={() => launchAppId = null}>Cancel</Button>
        <Button disabled={!target.installed || (mode === 'specific' && !!selProvider && !selModel) || (mode === 'custom' && (!selProvider || selChecked.length === 0))} onclick={doLaunch}>Launch</Button>
      </div>
    {/snippet}
  </Modal>
{/if}

{#if pathTarget}
  <Modal open={!!pathTarget} title={`Set path → ${pathTarget.name}`} onclose={() => pathTarget = null}>
    <span class="lbl">Executable path</span>
    <div class="folder">
      <Input bind:value={pathInput} placeholder="/path/to/executable" />
      <Button size="sm" variant="ghost" onclick={pickProviderPath}>Browse</Button>
    </div>
    {#snippet footer()}
      <div class="row actions">
        <Button variant="ghost" onclick={() => pathTarget = null}>Cancel</Button>
        <Button onclick={savePath}>Save</Button>
      </div>
    {/snippet}
  </Modal>
{/if}

<style>
  .head { margin-bottom: 20px; }
  .head h2 { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 6px; max-width: 560px; line-height: 1.55; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

  /* Launch mode selector */
  .modes { display: flex; flex-direction: column; gap: 8px; }
  .mode {
    display: flex; align-items: center; gap: 12px;
    text-align: left;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    cursor: pointer;
    transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease), transform var(--dur-xs) var(--ease);
    color: var(--text-1);
    font-family: inherit;
  }
  .mode:hover:not(:disabled) { border-color: var(--border-bright); background: var(--surface-hover); }
  .mode:active:not(:disabled) { transform: scale(0.99); }
  .mode:disabled { opacity: 0.45; cursor: not-allowed; }
  .mode.active {
    border-color: var(--accent);
    background: var(--accent-muted);
    box-shadow: 0 0 0 1px var(--accent-glow), 0 4px 18px -8px var(--accent-glow);
  }
  .mode-ico { font-size: 18px; color: var(--accent); width: 22px; text-align: center; flex-shrink: 0; }
  .mode.active .mode-ico { filter: drop-shadow(0 0 6px var(--accent-glow)); }
  .mode-body { display: flex; flex-direction: column; gap: 1px; }
  .mode-title { font-size: 13.5px; font-weight: 650; color: var(--text-1); }
  .mode-desc { font-size: 11.5px; color: var(--text-3); }

  .hintbox {
    display: flex; align-items: center; gap: 10px;
    margin-top: 14px;
    padding: 11px 13px;
    background: var(--accent-muted);
    border: 1px solid var(--border-glow);
    border-radius: var(--radius-sm);
    font-size: 12.5px; color: var(--text-2); line-height: 1.5;
  }

  .opts { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
  .lbl { font-size: 12.5px; font-weight: 600; color: var(--text-2); margin-top: 4px; }

  /* Custom catalog picker */
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
    transition: border-color var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease);
    font-family: inherit;
  }
  .segbtn:hover { color: var(--text-1); border-color: var(--border-bright); }
  .segbtn.active { color: var(--accent); border-color: var(--accent); background: var(--accent-muted); }
  .pickhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; }
  .pickcount { font-size: 11.5px; color: var(--text-3); }
  .pickactions { display: flex; gap: 10px; }
  .linkbtn { background: none; border: none; padding: 0; font-size: 11.5px; font-weight: 600; color: var(--accent); cursor: pointer; font-family: inherit; }
  .linkbtn:hover { text-decoration: underline; }
  .picklist {
    display: flex; flex-direction: column; gap: 4px;
    max-height: 260px; overflow-y: auto;
    padding: 2px;
  }
  .pick {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color var(--dur-xs) var(--ease);
  }
  .pick:hover { border-color: var(--border-bright); }
  .pick input[type="checkbox"] { accent-color: var(--accent); width: 15px; height: 15px; flex-shrink: 0; cursor: pointer; }
  .pick input[type="checkbox"]:disabled { cursor: not-allowed; }
  .pick-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
  .pick-name { font-size: 13px; font-weight: 600; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pick-id { font-size: 11px; color: var(--text-3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pickempty { font-size: 12.5px; color: var(--text-3); padding: 12px 4px; text-align: center; }

  /* Action row — rendered in the modal's pinned footer slot, outside the
     scroll area, so Launch stays on screen at any viewport height. */
  .actions { display: flex; justify-content: flex-end; gap: 8px; }
  .folder { display: flex; gap: 8px; }
  .recents { display: flex; flex-direction: column; gap: 4px; }
  .recent { text-align: left; font-size: 11.5px; color: var(--text-3); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 9px; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color var(--dur-xs) var(--ease); }
  .recent:hover { color: var(--text-1); border-color: var(--border-bright); }
  .row { display: flex; }
</style>
