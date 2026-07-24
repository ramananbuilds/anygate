<script lang="ts">
  interface Props { text?: string; position?: 'top' | 'bottom'; children?: import('svelte').Snippet; }
  let { text = '', position = 'top', children }: Props = $props();
  let show = $state(false);
</script>

<span class="tip-wrap" onmouseenter={() => show = true} onmouseleave={() => show = false} role="presentation">
  {@render children?.()}
  {#if show && text}
    <span class="tip {position}">{text}</span>
  {/if}
</span>

<style>
  .tip-wrap { position: relative; display: inline-flex; }
  .tip {
    position: absolute; left: 50%; transform: translateX(-50%);
    white-space: nowrap; z-index: 60;
    background: var(--surface-2); color: var(--text-1);
    border: 1px solid var(--border); border-radius: 6px;
    padding: 4px 9px; font-size: 12px; pointer-events: none;
    box-shadow: 0 4px 16px oklch(10% 0.02 70 / 0.4);
  }
  .tip.top { bottom: calc(100% + 6px); }
  .tip.bottom { top: calc(100% + 6px); }
</style>
