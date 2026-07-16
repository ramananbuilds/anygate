<script lang="ts">
  import type { EnrichedModel } from '../../stores/providers.svelte';
  import { Badge } from '../primitives';
  import ModelBadges from './ModelBadges.svelte';

  interface Props { model: EnrichedModel; providerId: string; favorited?: boolean; onToggleFav?: () => void; onOpen?: () => void; }
  let { model, providerId, favorited = false, onToggleFav, onOpen }: Props = $props();

  function fmt(n?: number): string { return n ? `${(n/1000).toFixed(0)}k` : '—'; }
  function cost(c?: unknown): string {
    if (!c || typeof c !== 'object') return '—';
    const o = c as Record<string, number>;
    const parts = [];
    if (o.input != null) parts.push(`$${o.input}/M in`);
    if (o.output != null) parts.push(`$${o.output}/M out`);
    return parts.join(' · ') || '—';
  }
</script>

<div class="row" class:clickable={!!onOpen}>
  <div class="info">
    <div class="name">{model.name ?? model.id}<span class="pid">· {providerId}</span></div>
    <div class="meta">ctx {fmt(model.contextWindow)} · {cost(model.cost)}</div>
  </div>
  <div class="tags"><ModelBadges {model} /></div>
  {#if onToggleFav}
    <button class="star" class:on={favorited} title={favorited ? 'Remove favorite' : 'Add favorite'} onclick={(e) => { e.stopPropagation(); onToggleFav(); }}>{favorited ? '★' : '☆'}</button>
  {/if}
  {#if onOpen}
    <button class="open" type="button" title="Open details" onclick={(e) => { e.stopPropagation(); onOpen(); }}>Open</button>
  {/if}
</div>

<style>
  .row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: var(--radius-sm); border: 1px solid transparent; transition: background var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease); }
  .row.clickable { cursor: pointer; }
  .row.clickable:hover { background: var(--surface-hover); border-color: var(--border); }
  .info { flex: 1; min-width: 0; }
  .name { font-weight: 500; font-size: 13.5px; color: var(--text-1); }
  .pid { color: var(--text-3); font-weight: 400; margin-left: 6px; font-size: 12px; }
  .meta { font-size: 12px; color: var(--text-3); margin-top: 2px; }
  .tags { flex-shrink: 0; }
  .star { background: none; border: none; font-size: 17px; color: var(--text-3); cursor: pointer; transition: color var(--dur-sm) var(--ease); }
  .star.on { color: var(--accent); }
  .open { flex-shrink: 0; padding: 5px 11px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface-2); color: var(--text-2); font-size: 12px; cursor: pointer; transition: border-color var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease); }
  .open:hover { border-color: var(--border-bright); color: var(--text-1); }
  .star:hover { color: var(--accent); }
</style>
