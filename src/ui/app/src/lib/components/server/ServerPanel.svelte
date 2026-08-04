<script lang="ts">
  import type { UiServerProviderOption } from '../../api/types';
  import { Button, Toggle, Spinner } from '../primitives';
  import ServerStatusBadge from './ServerStatusBadge.svelte';
  import { server, start, stop } from '../../stores/server.svelte';
  import { getServerProviders } from '../../api/endpoints';
  import { toast } from '../../stores/ui.svelte';

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

  const selectedModelCount = $derived.by(() => {
    if (selectedProviders === null) return providerOptions.reduce((n, p) => n + p.modelCount, 0);
    const allowed = new Set(selectedProviders);
    return providerOptions.filter((p) => allowed.has(p.id)).reduce((n, p) => n + p.modelCount, 0);
  });

  function sync() {
    if (!status) return;
    favoritesOnly = status.saved.favoritesOnly;
    freeModelsOnly = status.saved.freeModelsOnly;
    maskGatewayIds = status.saved.maskGatewayIds;
    listenMode = status.saved.listenMode;
    // Restore the saved provider selection instead of silently resetting to all.
    selectedProviders = status.saved.exposedProviders ?? null;
  }
  $effect(() => { if (status) sync(); });

  async function loadProviders() {
    providersLoading = true;
    providersError = null;
    try {
      const res = await getServerProviders();
      providerOptions = res.providers ?? [];
    } catch (err) {
      providersError = err instanceof Error ? err.message : String(err);
    } finally {
      providersLoading = false;
    }
  }
  $effect(() => { if (!status?.running && providerOptions.length === 0 && !providersLoading && !providersError) void loadProviders(); });

  function toggleProvider(id: string) {
    const current = selectedProviders ?? providerOptions.map((p) => p.id);
    const next = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
    // Selecting everything is equivalent to "all providers".
    selectedProviders = next.length === providerOptions.length ? null : next;
  }

  function isSelected(id: string): boolean {
    return selectedProviders === null || selectedProviders.includes(id);
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
  <div class="row">
    <div>
      <h3>Server Gateway</h3>
      <p class="desc">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p>
    </div>
    <ServerStatusBadge {status} />
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
                <button class="mid" title="Copy Anthropic model id: {m.anthropicId}" onclick={() => copy(m.anthropicId)}>{m.anthropicId}</button>
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
          <p class="prov-desc">Choose which providers appear on the model endpoints. Leave all selected to serve everything.</p>
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
        <div class="prov-grid">
          {#each providerOptions as p (p.id)}
            <button class="prov" class:on={isSelected(p.id)} aria-pressed={isSelected(p.id)} onclick={() => toggleProvider(p.id)}>
              <span class="tick" aria-hidden="true">{isSelected(p.id) ? '✓' : ''}</span>
              <span class="prov-name" title={p.id}>{p.name}</span>
              <span class="prov-count">{p.modelCount}</span>
            </button>
          {/each}
        </div>
        <p class="prov-sum">
          {#if selectedProviders === null}
            Serving all {providerOptions.length} providers · {selectedModelCount} models
          {:else if selectedProviders.length === 0}
            <span class="warn">No providers selected — pick at least one.</span>
          {:else}
            Serving {selectedProviders.length} of {providerOptions.length} providers · {selectedModelCount} models
          {/if}
        </p>
      {/if}
    </div>
  {/if}

  <div class="actions">
    <Button variant={status?.running ? 'danger' : 'primary'} disabled={server.starting} onclick={doStart}>
      {server.starting ? 'Working…' : status?.running ? 'Stop server' : 'Start server'}
    </Button>
  </div>
</div>

<style>
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
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
  .actions { margin-top: 18px; }

  .providers { margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; }
  .prov-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
  .prov-desc { font-size: 12.5px; color: var(--text-3); margin-top: 3px; max-width: 420px; }
  .prov-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .link { background: none; border: none; color: var(--accent); font-size: 12px; font-weight: 600; cursor: pointer; padding: 2px 4px; }
  .link:hover { text-decoration: underline; }
  .prov-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
  .prov { display: flex; align-items: center; gap: 9px; padding: 9px 11px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-2); cursor: pointer; text-align: left; transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease); }
  .prov:hover { border-color: var(--border-bright); }
  .prov.on { border-color: var(--accent); background: var(--accent-muted); }
  .tick { width: 14px; height: 14px; flex-shrink: 0; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: var(--accent); border: 1px solid var(--border-bright); border-radius: 4px; }
  .prov.on .tick { border-color: var(--accent); }
  .prov-name { flex: 1; min-width: 0; font-size: 13px; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prov-count { font-size: 11px; color: var(--text-3); font-variant-numeric: tabular-nums; }
  .prov-sum { margin-top: 10px; font-size: 12.5px; color: var(--text-3); }
  .prov-sum .warn { color: var(--warning); }
  .prov-err, .prov-empty { font-size: 12.5px; color: var(--text-3); }

  .served { margin-top: 18px; border-top: 1px solid var(--border); padding-top: 16px; }
  .served-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .hint { font-size: 12px; color: var(--text-3); }
  .group { margin-bottom: 12px; }
  .group-name { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 5px; }
  .group-count { font-size: 10.5px; color: var(--text-3); background: var(--surface-2); padding: 1px 7px; border-radius: 999px; }
  .model { display: flex; align-items: center; gap: 10px; padding: 5px 0 5px 10px; border-left: 2px solid var(--border); }
  .model-name { flex: 1; min-width: 0; font-size: 12.5px; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mid { font-family: ui-monospace, monospace; font-size: 11px; color: var(--text-3); background: var(--surface-2); border: 1px solid transparent; padding: 2px 8px; border-radius: 5px; cursor: pointer; max-width: 46%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease); }
  .mid:hover { color: var(--accent); border-color: var(--accent); }
</style>
