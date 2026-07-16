<script lang="ts">
  interface Option { value: string; label: string; }
  interface Props {
    value: string;
    options: Option[];
    onchange?: (v: string) => void;
    id?: string;
  }
  let { value = $bindable(''), options, onchange, id = '' }: Props = $props();
</script>

<select class="select" {id} {value} onchange={(e) => onchange?.((e.currentTarget as HTMLSelectElement).value)}>
  {#each options as opt (opt.value)}
    <option value={opt.value}>{opt.label}</option>
  {/each}
</select>

<style>
  .select {
    padding: 9px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-1);
    font-size: 13.5px;
    font-family: var(--font-body);
    cursor: pointer;
  }
  .select:focus { outline: none; border-color: var(--accent); }
</style>
