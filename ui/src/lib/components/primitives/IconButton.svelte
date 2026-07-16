<script lang="ts">
  interface Props {
    label?: string;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    title?: string;
    children?: import('svelte').Snippet;
  }
  let { label = '', onclick, disabled = false, title = '', children }: Props = $props();
</script>

<button class="icon-btn" {disabled} {title} aria-label={title || label} {onclick}>
  {#if label}<span>{label}</span>{/if}
  {@render children?.()}
</button>

<style>
  .icon-btn {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border);
    color: var(--text-2);
    cursor: pointer;
    transition: background var(--dur-sm) var(--ease), color var(--dur-sm) var(--ease);
  }
  .icon-btn:hover:not(:disabled) { background: var(--surface-hover); color: var(--text-1); }
  .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
