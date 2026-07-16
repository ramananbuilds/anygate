<script lang="ts">
  import type { ModelUsage } from '../../api/analytics';

  interface Props {
    models: ModelUsage[];
  }
  let { models }: Props = $props();

  function compact(n: number): string {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}k`;
    return String(n);
  }

  // Largest-remainder rounding so bar width + label share one integer that sums to 100
  function roundedShares(items: ModelUsage[]): number[] {
    const raw = items.map((m) => m.share * 100);
    const floors = raw.map((v) => Math.floor(v));
    let remainder = 100 - floors.reduce((a, b) => a + b, 0);
    const order = raw
      .map((v, i) => ({ i, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac);
    const result = floors.slice();
    for (let k = 0; k < order.length && remainder > 0; k++) {
      result[order[k].i] += 1;
      remainder--;
    }
    return result;
  }

  const shares = $derived(roundedShares(models));
</script>

<div class="list">
  {#each models as m, i (m.provider + m.model)}
    <div class="row">
      <span class="dot" style="background:{m.color}"></span>
      <div class="id">
        <div class="name" title="{m.provider}: {m.model}">{m.provider}: {m.model}</div>
        <div class="meta">{m.tier} · {m.app}</div>
      </div>
      <div class="nums">
        <span class="in">↓ {compact(m.inputTokens)}</span>
        <span class="out">↑ {compact(m.outputTokens)}</span>
      </div>
      <div class="share">
        <div class="track"><div class="fill" style="width:{shares[i]}%; background:{m.color}"></div></div>
        <span class="pct">{shares[i]}%</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .row {
    display: grid;
    grid-template-columns: 12px 1fr auto 160px;
    align-items: center;
    gap: 12px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: none;
  }
  .id {
    min-width: 0;
  }
  .name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meta {
    font-size: 11.5px;
    color: var(--text-3);
    text-transform: capitalize;
  }
  .nums {
    display: flex;
    gap: 12px;
    font-family: ui-monospace, monospace;
    font-size: 12px;
    color: var(--text-2);
  }
  .in {
    color: var(--text-2);
  }
  .out {
    color: var(--text-3);
  }
  .share {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .track {
    flex: 1;
    height: 6px;
    background: var(--surface-2);
    border-radius: 4px;
    overflow: hidden;
  }
  .fill {
    height: 100%;
    border-radius: 4px;
  }
  .pct {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-1);
    min-width: 34px;
    text-align: right;
  }
  @media (max-width: 640px) {
    .row {
      grid-template-columns: 12px 1fr auto;
    }
    .share {
      display: none;
    }
  }
</style>
