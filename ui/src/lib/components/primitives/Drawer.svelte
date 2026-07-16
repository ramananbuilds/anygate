<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    open: boolean;
    title?: string;
    onclose: () => void;
    children: Snippet;
    side?: 'right' | 'left';
  }
  let { open, title = '', onclose, children, side = 'right' }: Props = $props();
</script>

{#if open}
  <div class="backdrop" role="presentation" onclick={onclose}>
    <div class="drawer glass {side}" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      {#if title}<div class="drawer-head">{title}</div>{/if}
      <div class="drawer-body">{@render children()}</div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: oklch(10% 0.01 70 / 0.5);
    display: flex; justify-content: flex-end;
    animation: fade var(--dur-sm) var(--ease);
  }
  .drawer {
    width: 420px; max-width: 92vw; height: 100%;
    background: var(--surface); border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    animation: slide var(--dur-md) var(--ease);
  }
  .drawer.left { margin-right: auto; border-left: none; border-right: 1px solid var(--border); }
  .drawer-head { padding: 18px 20px; font-family: var(--font-display); font-weight: 700; font-size: 16px; border-bottom: 1px solid var(--border); }
  .drawer-body { padding: 20px; overflow-y: auto; }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>
