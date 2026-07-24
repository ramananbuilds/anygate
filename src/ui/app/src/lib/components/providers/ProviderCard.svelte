<script lang="ts">
  import type { EnrichedProvider } from '../../stores/providers.svelte';
  import ProviderLogo from './ProviderLogo.svelte';
  import { Badge, Button, IconButton } from '../primitives';
  import { refreshProviderModels } from '../../stores/providers.svelte';

  interface Props { provider: EnrichedProvider; onAddKey: (p: EnrichedProvider) => void; onDelete: (p: EnrichedProvider) => void; onOAuth: (p: EnrichedProvider) => void; }
  let { provider, onAddKey, onDelete, onOAuth }: Props = $props();
</script>

<div class="card">
  <div class="head">
    <ProviderLogo id={provider.id} />
    <div class="meta">
      <div class="name">{provider.name}</div>
      <div class="sub">{provider.modelCount} models · <span class="id">{provider.id}</span></div>
    </div>
    <div class="status">
      {#if provider.hasKey || provider.freeAccess}
        <Badge tone="success">{provider.freeAccess ? 'Free access' : 'Key set'}</Badge>
      {:else if provider.authType === 'oauth'}
        <Badge tone="accent">OAuth</Badge>
      {:else}
        <Badge tone="warning">No key</Badge>
      {/if}
    </div>
  </div>

  <div class="models">
    {#each provider.enrichedModels.slice(0, 5) as m (m.id)}
      <span class="chip" title={m.id}>{m.name ?? m.id}</span>
    {/each}
    {#if provider.enrichedModels.length > 5}<span class="chip more">+{provider.enrichedModels.length - 5}</span>{/if}
    {#if provider.enrichedModels.length === 0}<span class="chip empty">no models yet</span>{/if}
  </div>

  <div class="actions">
    {#if provider.authType === 'oauth'}
      <Button size="sm" variant="subtle" onclick={() => onOAuth(provider)}>Sign in</Button>
    {:else if !provider.hasKey && !provider.freeAccess}
      <Button size="sm" variant="primary" onclick={() => onAddKey(provider)}>Add key</Button>
      {#if provider.signupUrl}
        <a class="keylink" href={provider.signupUrl} target="_blank" rel="noopener noreferrer">Get key →</a>
      {/if}
    {:else}
      <Button size="sm" variant="ghost" onclick={() => refreshProviderModels(provider.id)}>Refresh</Button>
    {/if}
    <IconButton title="Delete provider" onclick={() => onDelete(provider)}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
    </IconButton>
  </div>
</div>

<style>
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; display: flex; flex-direction: column; gap: 12px; transition: border-color var(--dur-sm) var(--ease); }
  .card:hover { border-color: var(--border-bright); }
  .head { display: flex; align-items: center; gap: 12px; }
  .meta { flex: 1; min-width: 0; }
  .name { font-weight: 600; font-size: 14.5px; color: var(--text-1); }
  .sub { font-size: 12px; color: var(--text-3); }
  .id { font-family: var(--font-body); opacity: 0.8; }
  .models { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { font-size: 11.5px; padding: 3px 9px; border-radius: 7px; background: var(--glass-bg-strong); border: 1px solid var(--glass-border); color: var(--text-2); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chip.more { color: var(--accent); }
  .chip.empty { color: var(--text-3); font-style: italic; }
  .actions { display: flex; align-items: center; gap: 8px; }
  .keylink { font-size: 12px; font-weight: 600; color: var(--accent); text-decoration: none; white-space: nowrap; }
  .keylink:hover { text-decoration: underline; }
</style>
