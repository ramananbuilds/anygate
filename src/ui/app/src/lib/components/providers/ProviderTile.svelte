<script lang="ts">
  import type { EnrichedProvider } from '../../stores/providers.svelte';
  import { isConnected } from '../../providers/grouping';
  import ProviderLogo from './ProviderLogo.svelte';
  import { IconButton } from '../primitives';

  interface Props {
    provider: EnrichedProvider;
    testing?: boolean;
    testResult?: 'ok' | 'fail' | null;
    onConfigure?: () => void;
    onDelete?: (p: EnrichedProvider) => void;
  }
  let { provider, testing = false, testResult = null, onConfigure, onDelete }: Props = $props();

  const connected = $derived(isConnected(provider));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
<div class="tile" class:clickable={!connected && onConfigure} role={onConfigure && !connected ? 'button' : undefined}
  tabindex={onConfigure && !connected ? 0 : undefined}
  onclick={() => { if (!connected && onConfigure) onConfigure(); }}
  onkeydown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !connected && onConfigure) onConfigure(); }}>
  <ProviderLogo id={provider.id} size={30} />
  <div class="meta">
    <div class="name">{provider.name}</div>
    <div class="status">
      {#if testing}
        <span class="txt"><span class="spin">⟳</span> Testing…</span>
      {:else if testResult === 'ok'}
        <span class="dot ok"></span><span class="txt ok">Ready</span>
      {:else if testResult === 'fail'}
        <span class="dot fail"></span><span class="txt fail">Failed</span>
      {:else if connected}
        <span class="dot ok"></span><span class="txt ok">Connected</span>
      {:else}
        <span class="txt">No connections</span>
      {/if}
    </div>
  </div>
  {#if connected && onDelete}
    <span class="del">
      <IconButton title="Delete provider" onclick={() => onDelete(provider)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
      </IconButton>
    </span>
  {/if}
</div>

<style>
  .tile { position: relative; display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; min-height: 64px; transition: border-color var(--dur-sm) var(--ease); }
  .tile.clickable { cursor: pointer; }
  .tile.clickable:hover { border-color: var(--border-bright); }
  .meta { flex: 1; min-width: 0; }
  .name { font-weight: 600; font-size: 13.5px; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .status { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
  .txt { font-size: 11.5px; color: var(--text-3); }
  .txt.ok { color: oklch(72% 0.17 150); }
  .txt.fail { color: oklch(65% 0.19 25); }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dot.ok { background: oklch(72% 0.17 150); }
  .dot.fail { background: oklch(65% 0.19 25); }
  .spin { display: inline-block; animation: rot 1s linear infinite; }
  @keyframes rot { to { transform: rotate(360deg); } }
  .del { position: absolute; top: 6px; right: 6px; opacity: 0; transition: opacity var(--dur-sm) var(--ease); }
  .tile:hover .del { opacity: 1; }
</style>
