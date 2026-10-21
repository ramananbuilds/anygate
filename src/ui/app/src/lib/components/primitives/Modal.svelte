<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    open: boolean;
    title?: string;
    onclose: () => void;
    children: Snippet;
    /**
     * Optional pinned action row. Rendered outside the scrolling body so
     * primary actions stay reachable no matter how short the viewport is.
     */
    footer?: Snippet;
  }
  let { open, title = '', onclose, children, footer }: Props = $props();
</script>

{#if open}
  <div class="backdrop" role="presentation" onclick={onclose}>
    <div class="modal glass" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      {#if title}<div class="modal-head">{title}</div>{/if}
      <div class="modal-body">{@render children()}</div>
      {#if footer}<div class="modal-foot">{@render footer()}</div>{/if}
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
    overflow-y: auto;
    padding: 24px 0;
    animation: fade var(--dur-sm) var(--ease);
  }
  .modal {
    position: relative; min-width: 320px; max-width: 520px; width: 90vw;
    max-height: calc(100dvh - 48px);
    display: flex; flex-direction: column;
    border-radius: var(--radius); padding: 22px;
    background: var(--surface);
    margin: auto;
    /* Clip the footer's bleed to the rounded corners. */
    overflow: hidden;
  }
  .modal-head { flex-shrink: 0; font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 14px; color: var(--text-1); }
  /* The only scroll region — capped by the modal's max-height so the body
     always yields space to the head and the pinned foot. */
  .modal-body { flex: 1 1 auto; overflow-y: auto; min-height: 0; }
  /* Full-bleed footer: negative margins cancel the modal's padding so the
     separator reaches the modal edges; overflow:hidden rounds the corners. */
  .modal-foot {
    flex-shrink: 0;
    margin: 0 -22px -22px;
    padding: 12px 22px 22px;
    border-top: 1px solid var(--border);
    background: var(--surface-2);
  }
  /* A footer whose snippet rendered nothing leaves no strip behind. */
  .modal-foot:empty { display: none; }
  .modal-x {
    position: absolute; top: 12px; right: 14px; background: none; border: none;
    color: var(--text-3); font-size: 22px; line-height: 1; cursor: pointer;
  }
  .modal-x:hover { color: var(--text-1); }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
</style>
