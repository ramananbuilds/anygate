<script lang="ts">
  interface Props {
    checked: boolean;
    onchange?: (v: boolean) => void;
    label?: string;
  }
  let { checked = $bindable(false), onchange, label = '' }: Props = $props();
</script>

<label class="toggle-wrap">
  <button
    type="button"
    role="switch"
    aria-label={label || 'toggle'}
    aria-checked={checked}
    class="toggle"
    class:on={checked}
    onclick={() => onchange?.(!checked)}
  >
    <span class="knob"></span>
  </button>
  {#if label}<span class="lbl">{label}</span>{/if}
</label>

<style>
  .toggle-wrap { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggle {
    width: 38px; height: 21px; border-radius: 999px;
    background: var(--surface-2); border: 1px solid var(--border);
    position: relative; transition: background var(--dur-sm) var(--ease);
  }
  .toggle.on { background: var(--accent); border-color: var(--accent); }
  .knob {
    position: absolute; top: 2px; left: 2px; width: 15px; height: 15px;
    border-radius: 50%; background: var(--text-1);
    transition: transform var(--dur-sm) var(--ease);
  }
  .toggle.on .knob { transform: translateX(17px); background: oklch(20% 0.04 70); }
  .lbl { font-size: 13px; color: var(--text-2); }
</style>
