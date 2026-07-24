<script lang="ts">
  interface Props { size?: number; label?: string; inline?: boolean; }
  let { size = 18, label = '', inline = false }: Props = $props();
</script>

{#if inline}
  <span class="spinner inline" style="width:{size}px;height:{size}px"></span>
{:else}
  <div class="spinner-wrap" role="status" aria-label={label || 'Loading'}>
    <span class="spinner" style="width:{size}px;height:{size}px"></span>
    {#if label}<span class="lbl">{label}</span>{/if}
  </div>
{/if}

<style>
  .spinner-wrap { display: flex; align-items: center; gap: 10px; color: var(--text-2); font-size: 13px; padding: 8px 0; }
  .spinner {
    display: inline-block; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: var(--accent);
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
