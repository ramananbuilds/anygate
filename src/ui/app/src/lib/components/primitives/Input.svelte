<script lang="ts">
  interface Props {
    value: string;
    placeholder?: string;
    type?: string;
    oninput?: (v: string) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    id?: string;
  }
  let { value = $bindable(''), placeholder = '', type = 'text', oninput, onkeydown, id = '' }: Props = $props();
</script>

<input
  {id}
  {type}
  class="input"
  {placeholder}
  {value}
  oninput={(e) => {
    value = (e.currentTarget as HTMLInputElement).value;
    oninput?.(value);
  }}
  onkeydown={onkeydown}
/>

<style>
  .input {
    width: 100%;
    padding: 9px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-1);
    font-size: 13.5px;
    font-family: var(--font-body);
    transition: border-color var(--dur-sm) var(--ease), background var(--dur-sm) var(--ease);
  }
  .input:focus { outline: none; border-color: var(--accent); background: var(--surface-2); }
  .input::placeholder { color: var(--text-3); }
</style>
