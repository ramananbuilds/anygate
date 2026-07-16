<script lang="ts">
  import { apps, launch, setPath, browseFolder } from '../lib/stores/apps.svelte';
  import { providers } from '../lib/stores/providers.svelte';
  import { favorites } from '../lib/stores/favorites.svelte';
  import AppCard from '../lib/components/apps/AppCard.svelte';
  import { Card, Button, Select, Input, Modal, Spinner, EmptyState } from '../lib/components/primitives';
  import type { UiApp } from '../lib/api/types';

  let launchAppId = $state<string | null>(null);
  let useFavs = $state(false);
  let selProvider = $state('');
  let selModel = $state('');
  let cwd = $state('');
  let pathTarget = $state<UiApp | null>(null);
  let pathInput = $state('');

  const target = $derived(apps.list.find(a => a.id === launchAppId));
  const modelOptions = $derived(
    selProvider ? (providers.list.find(p => p.id === selProvider)?.enrichedModels ?? []).map(m => ({ value: m.id, label: m.name ?? m.id })) : []
  );

  async function openLaunch(a: UiApp) {
    launchAppId = a.id;
    useFavs = false; selProvider = ''; selModel = ''; cwd = '';
    const recents = apps.recentFolders;
    cwd = recents[0] ?? '';
  }

  async function doLaunch() {
    if (!launchAppId) return;
    await launch({ appId: launchAppId, favorites: useFavs || undefined, providerId: selProvider || undefined, modelId: selModel || undefined, cwd: cwd || undefined });
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
    <h2>Apps & Launch</h2>
    <p class="sub">Launch Claude, Codex, or Gemini with your anygate models pre-selected. Set a launch folder per app.</p>
  </div>

  {#if apps.loading}
    <Spinner label="Detecting installed appsâ€¦" />
  {:else if apps.list.length === 0}
    <EmptyState title="No apps found" icon="M2 3h20v14H2z">anygate couldn't detect supported apps on this system.</EmptyState>
  {:else}
    <div class="grid">
      {#each apps.list as a (a.id)}
        <AppCard app={a} onlaunch={openLaunch} onsetpath={openPath} />
      {/each}
    </div>
  {/if}
</div>

{#if target}
  <Modal open={!!target} title={`Launch ${target.name}`} onclose={() => launchAppId = null}>
    <div class="opts">
      <label class="lbl"><input type="checkbox" bind:checked={useFavs} /> Use first favorite</label>

      <span class="lbl">Provider</span>
      <Select bind:value={selProvider} options={[{ value: '', label: 'â€”' }, ...providers.list.map(p => ({ value: p.id, label: p.name }))]} />

      {#if selProvider}
        <span class="lbl">Model</span>
        <Select bind:value={selModel} options={[{ value: '', label: 'â€”' }, ...modelOptions]} />
      {/if}

      <span class="lbl">Launch folder</span>
      <div class="folder">
        <Input bind:value={cwd} placeholder="Path or browseâ€¦" />
        <Button size="sm" variant="ghost" onclick={pickFolder}>Browse</Button>
      </div>
      {#if apps.recentFolders.length}
        <div class="recents">
          {#each apps.recentFolders.slice(0, 4) as f}<button class="recent" onclick={() => cwd = f}>{f}</button>{/each}
        </div>
      {/if}
    </div>
    <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={() => launchAppId = null}>Cancel</Button>
      <Button disabled={!target.installed} onclick={doLaunch}>Launch</Button>
    </div>
  </Modal>
{/if}

{#if pathTarget}
  <Modal open={!!pathTarget} title={`Set path · ${pathTarget.name}`} onclose={() => pathTarget = null}>
    <span class="lbl">Executable path</span>
    <div class="folder">
      <Input bind:value={pathInput} placeholder="/path/to/executable" />
      <Button size="sm" variant="ghost" onclick={pickProviderPath}>Browse</Button>
    </div>
    <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px">
      <Button variant="ghost" onclick={() => pathTarget = null}>Cancel</Button>
      <Button onclick={savePath}>Save</Button>
    </div>
  </Modal>
{/if}

<style>
  .head { margin-bottom: 18px; }
  h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-1); }
  .sub { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 480px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
  .opts { display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
  .lbl { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
  .folder { display: flex; gap: 8px; }
  .recents { display: flex; flex-direction: column; gap: 4px; }
  .recent { text-align: left; font-size: 11.5px; color: var(--text-3); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 5px 9px; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .recent:hover { color: var(--text-1); }
  .row { display: flex; }
</style>
