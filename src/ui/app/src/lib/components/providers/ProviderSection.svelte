<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    count?: number;
    action?: Snippet;
    children?: Snippet;
  }
  let { title, count, action, children }: Props = $props();
</script>

<section class="section">
  <div class="head">
    <h3>{title}{#if count !== undefined} <span class="count">({count})</span>{/if}</h3>
    {#if action}<div class="acts">{@render action()}</div>{/if}
  </div>
  {#if children}
    <div class="tile-grid">{@render children()}</div>
  {/if}
</section>

<style>
  .section { margin-bottom: 26px; }
  .head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 10px; }
  h3 { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-1); }
  .count { color: var(--text-3); font-weight: 500; }
  .acts { display: flex; gap: 8px; }
  .tile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
</style>
