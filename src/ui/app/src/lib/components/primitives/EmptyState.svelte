<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props { title?: string; children?: Snippet; icon?: string; }
  let { title = 'Nothing here yet', children, icon = 'M4 4h16v16H4z' }: Props = $props();
</script>

<div class="empty">
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d={icon} /></svg>
  <div class="title">{title}</div>
  {#if children}<div class="sub">{@render children()}</div>{/if}
</div>

<style>
  .empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 20px; color: var(--text-3); text-align: center; }
  .title { font-weight: 600; color: var(--text-2); font-size: 14px; }
  .sub { font-size: 13px; max-width: 320px; line-height: 1.5; }
</style>
