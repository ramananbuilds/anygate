<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'ghost' | 'danger' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit';
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }
  let { variant = 'primary', size = 'md', disabled = false, type = 'button', onclick, children }: Props = $props();
</script>

<button {type} class="btn {variant} {size}" {disabled} {onclick}>
  {@render children()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background var(--dur-sm) var(--ease), border-color var(--dur-sm) var(--ease), transform var(--dur-xs) var(--ease), opacity var(--dur-sm);
    user-select: none;
  }
  .btn:active { transform: translateY(1px); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .md { padding: 9px 15px; }
  .sm { padding: 6px 11px; font-size: 12.5px; }
  .lg { padding: 12px 20px; font-size: 15px; }

  .primary {
    background: var(--accent);
    color: oklch(20% 0.04 70);
  }
  .primary:hover:not(:disabled) { background: var(--accent-dim); }

  .ghost {
    background: transparent;
    border-color: var(--border-bright);
    color: var(--text-1);
  }
  .ghost:hover:not(:disabled) { background: var(--surface-hover); }

  .subtle {
    background: var(--glass-bg-strong);
    border-color: var(--glass-border);
    color: var(--text-1);
  }
  .subtle:hover:not(:disabled) { background: var(--surface-hover); }

  .danger {
    background: var(--error-bg);
    border-color: var(--error);
    color: var(--error);
  }
  .danger:hover:not(:disabled) { background: color-mix(in oklch, var(--error) 18%, transparent); }
</style>
