<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    open: boolean;
    title?: string;
    onclose: () => void;
    children: Snippet;
  }
  let { open, title = '', onclose, children }: Props = $props();
</script>

{#if open}
  <div class="backdrop" role="presentation" onclick={onclose}>
    <div class="modal glass" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      {#if title}<div class="modal-head">{title}</div>{/if}
      <div class="modal-body">{@render children()}</div>
      <button class="modal-x" aria-label="Close" onclick={onclose}>×</button>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: oklch(10% 0.01 70 / 0.6);
    backdrop-filter: blur(3px);
    display: grid; place-items: center;
    animation: fade var(--dur-sm) var(--ease);
  }
  .modal {
    position: relative; min-width: 320px; max-width: 520px; width: 90vw;
    border-radius: var(--radius); padding: 22px;
    background: var(--surface);
  }
  .modal-head { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 14px; color: var(--text-1); }
  .modal-x {
    position: absolute; top: 12px; right: 14px; background: none; border: none;
    color: var(--text-3); font-size: 22px; line-height: 1; cursor: pointer;
  }
  .modal-x:hover { color: var(--text-1); }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
</style>
