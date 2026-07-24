<script lang="ts">
  import { ui, dismissToast } from '../stores/ui.svelte';
  function onToastKey(e: KeyboardEvent, id: number) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismissToast(id); }
  }
</script>

<div class="toaster" aria-live="polite">
  {#each ui.toasts as t (t.id)}
    <div class="toast {t.kind}" role="button" tabindex="0" onclick={() => dismissToast(t.id)} onkeydown={(e) => onToastKey(e, t.id)}>
      <span class="dot"></span>
      <span class="msg">{t.message}</span>
    </div>
  {/each}
</div>

<style>
  .toaster { position: fixed; bottom: 20px; right: 20px; z-index: 80; display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
  .toast {
    display: flex; align-items: center; gap: 9px;
    padding: 11px 15px; border-radius: var(--radius-sm);
    background: var(--surface); border: 1px solid var(--border);
    box-shadow: 0 8px 28px oklch(10% 0.02 70 / 0.5);
    font-size: 13px; color: var(--text-1); cursor: pointer;
    animation: pop var(--dur-sm) var(--ease);
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .success .dot { background: var(--success); }
  .error .dot { background: var(--error); }
  .info .dot { background: var(--accent); }
  @keyframes pop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
