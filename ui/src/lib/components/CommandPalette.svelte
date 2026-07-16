<script lang="ts">
  import { router, navigate, type RouteId } from '../stores/router.svelte';
  import { providers } from '../stores/providers.svelte';
  import { favorites } from '../stores/favorites.svelte';
  import { apps } from '../stores/apps.svelte';
  import { server } from '../stores/server.svelte';

  interface Item { id: string; route: RouteId; label: string; hint: string; }
  let { query = $bindable(''), onclose }: { query: string; onclose: () => void } = $props();
  let inputEl: HTMLInputElement;

  $effect(() => { inputEl?.focus(); });

  const all: Item[] = [
    { id: 'dashboard', route: 'dashboard', label: 'Dashboard', hint: 'Overview & quick launch' },
    { id: 'providers', route: 'providers', label: 'Providers & Keys', hint: 'Manage API keys & OAuth' },
    { id: 'models', route: 'models', label: 'Models', hint: 'Browse & favorite models' },
    { id: 'apps', route: 'apps', label: 'Apps & Launch', hint: 'Launch Claude, Codex, Gemini' },
    { id: 'server', route: 'server', label: 'Server Gateway', hint: 'Start the local API server' },
    { id: 'settings', route: 'settings', label: 'Settings', hint: 'Theme, presets, import/export' },
  ];

  const results = $derived(
    all.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.hint.toLowerCase().includes(query.toLowerCase()))
  );

  function go(item: Item) { navigate(item.route); onclose(); }

  function onkey(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={onkey} />

<div class="backdrop" role="presentation" onclick={onclose}>
  <div class="palette glass" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
    <input class="q" placeholder="Search providers, models, appsâ€¦" bind:this={inputEl} bind:value={query} />
    <div class="list">
      {#each results as item (item.id)}
        <button class="opt" onclick={() => go(item)}>
          <span class="lbl">{item.label}</span>
          <span class="hint">{item.hint}</span>
        </button>
      {/each}
      {#if results.length === 0}<div class="none">No matches</div>{/if}
    </div>
  </div>
</div>

<style>
  .backdrop { position: fixed; inset: 0; z-index: 90; background: oklch(10% 0.01 70 / 0.55); backdrop-filter: blur(3px); display: flex; align-items: flex-start; justify-content: center; padding-top: 14vh; }
  .palette { width: 540px; max-width: 92vw; border-radius: var(--radius); padding: 12px; background: var(--surface); }
  .q { width: 100%; padding: 12px 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-1); font-size: 14px; }
  .q:focus { outline: none; border-color: var(--accent); }
  .list { margin-top: 8px; display: flex; flex-direction: column; gap: 2px; max-height: 50vh; overflow-y: auto; }
  .opt { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 10px 13px; border-radius: var(--radius-sm); background: none; border: none; cursor: pointer; text-align: left; }
  .opt:hover { background: var(--surface-hover); }
  .lbl { font-size: 14px; font-weight: 500; color: var(--text-1); }
  .hint { font-size: 12px; color: var(--text-3); }
  .none { padding: 14px; color: var(--text-3); font-size: 13px; text-align: center; }
</style>
