<script lang="ts">
  import type { FavoriteModel } from '../../api/types';
  import ProviderLogo from '../providers/ProviderLogo.svelte';

  interface Props { fav: FavoriteModel; index: number; onremove: () => void; ondragstart: (e: DragEvent) => void; ondrop: (e: DragEvent) => void; }
  let { fav, index, onremove, ondragstart, ondrop }: Props = $props();
</script>

<div class="item" role="listitem" draggable="true" ondragstart={ondragstart} ondragover={(e) => e.preventDefault()} ondrop={ondrop}>
  <span class="handle" title="Drag to reorder">⠿⠿⠿</span>
  <span class="idx">{index + 1}</span>
  <ProviderLogo id={fav.providerId} size={28} />
  <div class="meta">
    <div class="name">{fav.model}</div>
    <div class="sub">{fav.providerName}</div>
  </div>
  <button class="x" title="Remove" onclick={onremove}>×</button>
</div>

<style>
  .item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: grab; transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease); }
  .item:hover { border-color: var(--border-bright); }
  .item:active { cursor: grabbing; }
  .handle { color: var(--text-3); font-size: 13px; letter-spacing: -2px; }
  .idx { font-size: 12px; color: var(--text-3); width: 16px; text-align: center; }
  .meta { flex: 1; min-width: 0; }
  .name { font-size: 13px; font-weight: 500; color: var(--text-1); }
  .sub { font-size: 11.5px; color: var(--text-3); }
  .x { background: none; border: none; color: var(--text-3); font-size: 18px; cursor: pointer; line-height: 1; }
  .x:hover { color: var(--error); }
</style>
