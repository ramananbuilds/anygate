<script lang="ts">
  import type { ServerStatusPayload } from '../../api/types';
  import { Badge, Button, Toggle } from '../primitives';
  import ServerStatusBadge from './ServerStatusBadge.svelte';
  import { server, start, stop } from '../../stores/server.svelte';

  interface Props { onneedsmodels?: () => void; }
  let { onneedsmodels }: Props = $props();

  let favoritesOnly = $state(false);
  let freeModelsOnly = $state(false);
  let maskGatewayIds = $state(false);
  let listenMode = $state<'local' | 'network'>('local');
  let password = $state('');
  let savePassword = $state(true);

  const status = $derived(server.status);

  function sync() {
    if (!status) return;
    favoritesOnly = status.saved.favoritesOnly;
    freeModelsOnly = status.saved.freeModelsOnly;
    maskGatewayIds = status.saved.maskGatewayIds;
    listenMode = status.saved.listenMode;
  }
  $effect(() => { if (status) sync(); });

  async function doStart() {
    if (status?.running) { await stop(); return; }
    if (listenMode === 'network' && !password.trim()) { password = Math.random().toString(36).slice(2, 12); }
    const ok = await start({ favoritesOnly, freeModelsOnly, exposedProviders: null, maskGatewayIds, listenMode, passwordMode: 'new', password, savePassword });
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
      <div class="url"><span class="lbl">Anthropic</span><code>{status.anthropicUrl}</code></div>
      <div class="url"><span class="lbl">OpenAI</span><code>{status.openaiUrl}</code></div>
      {#if status.listenMode === 'network' && status.networkUrls}
        {#each status.networkUrls as u}<div class="url"><span class="lbl">{u.name}</span><code>{u.anthropicUrl}</code></div>{/each}
        <div class="url"><span class="lbl">Key</span><code>{status.apiKey}</code></div>
      {/if}
    </div>
    {#if status.providerSummary}<div class="summary">{status.providerSummary}</div>{/if}
  {:else}
    <div class="opts">
      <Toggle bind:checked={favoritesOnly} label="Favorites only" />
      <Toggle bind:checked={freeModelsOnly} label="Free models only" />
      <Toggle bind:checked={maskGatewayIds} label="Mask gateway IDs" />
      <Toggle checked={listenMode === 'network'} onchange={(v) => listenMode = v ? 'network' : 'local'} label="Network mode" />
      {#if listenMode === 'network'}
        <span class="lbl">Server password</span>
        <input class="inp" bind:value={password} placeholder="required for network" />
        <Toggle bind:checked={savePassword} label="Save password" />
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
  .desc { font-size: 13px; color: var(--text-3); margin-top: 4px; max-width: 460px; }
  .urls { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
  .url { display: flex; gap: 10px; align-items: center; }
  .lbl { font-size: 11px; text-transform: uppercase; color: var(--text-3); width: 70px; flex-shrink: 0; }
  code { font-family: ui-monospace, monospace; font-size: 12px; background: var(--surface-2); padding: 4px 9px; border-radius: 6px; color: var(--accent); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .summary { margin-top: 12px; font-size: 12.5px; color: var(--text-2); background: var(--surface-2); padding: 9px 12px; border-radius: var(--radius-sm); }
  .opts { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
  .lbl { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
  .inp { width: 100%; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 13.5px; }
  .inp:focus { outline: none; border-color: var(--accent); }
  .actions { margin-top: 18px; }
</style>
