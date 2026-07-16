<script lang="ts">
  import type { FavoriteModel } from '../../api/types';
  import FavoriteItem from './FavoriteItem.svelte';
  import { EmptyState } from '../primitives';

  interface Props { items: FavoriteModel[]; max: number; onreorder: (next: FavoriteModel[]) => void; onremove: (f: FavoriteModel) => void; }
  let { items, max, onreorder, onremove }: Props = $props();

  let dragIdx = $state<number | null>(null);

  function start(i: number, e: DragEvent) { dragIdx = i; e.dataTransfer?.setData('text/plain', String(i)); }
  function drop(i: number) {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [m] = next.splice(dragIdx, 1);
    next.splice(i, 0, m!);
    dragIdx = null;
    onreorder(next);
  }
</script>

<div class="list">
  {#if items.length === 0}
    <EmptyState title="No favorites yet" icon="M12 5v14M5 12h14">Star models from the Models tab to build your quick-launch list.</EmptyState>
  {:else}
    {#each items as f, i (f.providerId + '/' + f.modelId)}
      <FavoriteItem fav={f} index={i} onremove={() => onremove(f)} ondragstart={(e) => start(i, e)} ondrop={() => drop(i)} />
    {/each}
  {/if}
  <div class="cap">{items.length} / {max} used</div>
</div>

<style>
  .list { display: flex; flex-direction: column; gap: 7px; }
  .cap { font-size: 12px; color: var(--text-3); text-align: right; margin-top: 2px; }
</style>
