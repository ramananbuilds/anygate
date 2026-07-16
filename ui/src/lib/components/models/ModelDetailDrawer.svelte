<script lang="ts">
  import type { EnrichedModel } from '../../stores/providers.svelte';
  import { Drawer, Badge } from '../primitives';
  import ModelBadges from './ModelBadges.svelte';

  interface Props { open: boolean; model: EnrichedModel | null; providerId: string; providerName: string; onclose: () => void; }
  let { open, model, providerId, providerName, onclose }: Props = $props();

  function cost(c?: unknown): string {
    if (!c || typeof c !== 'object') return 'Not published';
    const o = c as Record<string, number>;
    return [o.input != null ? `$${o.input} / 1M input` : null, o.output != null ? `$${o.output} / 1M output` : null].filter(Boolean).join('  ·  ') || 'Not published';
  }
</script>

<Drawer {open} title="Model details" {onclose}>
  {#if model}
    <div class="stack">
      <div>
        <div class="h">Name</div>
        <div class="v">{model.name ?? model.id}</div>
      </div>
      <div>
        <div class="h">Model ID</div>
        <code class="v mono">{model.id}</code>
      </div>
      <div>
        <div class="h">Provider</div>
        <div class="v">{providerName} <span class="sub">({providerId})</span></div>
      </div>
      <div class="grid">
        <div><div class="h">Context window</div><div class="v">{model.contextWindow ? model.contextWindow.toLocaleString() + ' tokens' : '—'}</div></div>
        <div><div class="h">Free</div><div class="v">{model.isFree ? 'Yes' : (model.freeLabel ?? 'No')}</div></div>
        <div><div class="h">Format</div><div class="v"><ModelBadges {model} /></div></div>
        <div><div class="h">Reasoning</div><div class="v">{model.reasoning ? 'Supported' : 'No'}</div></div>
      </div>
      <div>
        <div class="h">Cost</div>
        <div class="v">{cost(model.cost)}</div>
      </div>
      <div>
        <div class="h">Supported parameters</div>
        <div class="v chips">{#each (model.supportedParameters ?? []) as p}<Badge tone="neutral">{p}</Badge>{/each}</div>
      </div>
      {#if model.sourceBackend}<div><div class="h">Source backend</div><div class="v">{model.sourceBackend}</div></div>{/if}
    </div>
  {/if}
</Drawer>

<style>
  .stack { display: flex; flex-direction: column; gap: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .h { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-3); margin-bottom: 4px; }
  .v { font-size: 13.5px; color: var(--text-1); }
  .v.mono { font-family: ui-monospace, monospace; font-size: 12.5px; background: var(--surface-2); padding: 4px 8px; border-radius: 6px; display: inline-block; word-break: break-all; }
  .sub { color: var(--text-3); }
  .chips { display: flex; flex-wrap: wrap; gap: 5px; }
</style>
