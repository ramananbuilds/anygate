<script lang="ts">
  interface Props {
    label: string;
    value: string;
    sub?: string;
  }
  let { label, value, sub }: Props = $props();
</script>

<div class="stat">
  <span class="lbl">{label}</span>
  <span class="num" title={value}>{value}</span>
  {#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
  .stat {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .lbl {
    font-size: 12px;
    color: var(--text-3);
    letter-spacing: 0.01em;
  }
  .num {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 800;
    color: var(--text-1);
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .sub {
    font-size: 11.5px;
    color: var(--text-3);
  }
</style>
