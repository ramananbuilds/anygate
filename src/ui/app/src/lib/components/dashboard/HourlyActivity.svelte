<script lang="ts">
  // Requests per UTC hour. The data is already collected on every usage event;
  // before this panel only the single `peakHour` number was surfaced.
  interface Props {
    hourly: number[];
    peakHour: number;
  }
  let { hourly, peakHour }: Props = $props();

  const max = $derived(Math.max(1, ...hourly));
  const total = $derived(hourly.reduce((n, h) => n + h, 0));

  function label(h: number): string {
    if (h === 0) return '12a';
    if (h === 12) return '12p';
    return h < 12 ? `${h}a` : `${h - 12}p`;
  }
</script>

<div class="wrap">
  {#if total === 0}
    <p class="empty">No requests recorded in this range.</p>
  {:else}
    <div class="bars" role="img" aria-label="Requests by hour of day (UTC)">
      {#each hourly as count, h (h)}
        <div class="col" class:peak={h === peakHour && count > 0}>
          <div class="track">
            <div
              class="bar"
              style:height="{count === 0 ? 0 : Math.max(4, (count / max) * 100)}%"
              title="{label(h)} · {count} request{count === 1 ? '' : 's'}"
            ></div>
          </div>
          {#if h % 3 === 0}<span class="tick">{label(h)}</span>{:else}<span class="tick"></span>{/if}
        </div>
      {/each}
    </div>
    <p class="note">Busiest at <strong>{label(peakHour)}</strong> UTC · {total} request{total === 1 ? '' : 's'}</p>
  {/if}
</div>

<style>
  .wrap { display: flex; flex-direction: column; gap: 10px; }
  .bars { display: grid; grid-template-columns: repeat(24, 1fr); gap: 3px; align-items: end; }
  .col { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
  .track { height: 92px; width: 100%; display: flex; align-items: flex-end; }
  .bar {
    width: 100%;
    border-radius: 3px 3px 2px 2px;
    background: var(--accent-dim);
    transition: height var(--dur-md) var(--ease), background var(--dur-sm) var(--ease);
  }
  .col:hover .bar { background: var(--accent); }
  .col.peak .bar { background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }
  .tick { font-size: 9.5px; color: var(--text-3); font-variant-numeric: tabular-nums; height: 12px; }
  .note { font-size: 12.5px; color: var(--text-3); }
  .note strong { color: var(--text-1); font-weight: 600; }
  .empty { font-size: 13px; color: var(--text-3); padding: 20px 0; text-align: center; }
</style>
