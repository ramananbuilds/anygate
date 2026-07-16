<script lang="ts">
  interface Props {
    data: { date: string; tokens: number }[];
  }
  let { data }: Props = $props();

  const max = $derived(Math.max(1, ...data.map((d) => d.tokens)));

  // Round up to a nice number for the y-axis maximum.
  function niceMax(n: number): number {
    if (n <= 0) return 1;
    const exp = Math.floor(Math.log10(n));
    const base = Math.pow(10, exp);
    const frac = n / base;
    let niceFrac: number;
    if (frac <= 1) niceFrac = 1;
    else if (frac <= 2) niceFrac = 2;
    else if (frac <= 5) niceFrac = 5;
    else niceFrac = 10;
    return niceFrac * base;
  }

  const yMax = $derived(niceMax(max));
  const yTicks = $derived(Array.from({ length: 5 }, (_, i) => yMax * (1 - i / 4)));

  function compact(n: number): string {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(0)}k`;
    return String(n);
  }
  function monthLabel(iso: string): string {
    return new Date(iso + 'T00:00:00').toLocaleString('en', { month: 'short' });
  }

  // Place a month tick when the month changes between consecutive days.
  function isMonthStart(i: number): boolean {
    if (i === 0) return true;
    const prev = new Date(data[i - 1].date + 'T00:00:00').getMonth();
    const cur = new Date(data[i].date + 'T00:00:00').getMonth();
    return prev !== cur;
  }
</script>

<div class="chart">
  <div class="scroll">
    <div class="bars">
      <div class="gridlines">
        {#each yTicks as t (t)}
          <div class="gridline"></div>
        {/each}
      </div>
      {#each data as d, i (d.date)}
        <div class="bar-col" title={`${d.date} · ${compact(d.tokens)} tokens`}>
          <div class="bar-area">
            <div class="bar" style="height:{(d.tokens / yMax) * 100}%"></div>
          </div>
          <div class="xlabel">{#if isMonthStart(i)}{monthLabel(d.date)}{/if}</div>
        </div>
      {/each}
    </div>
  </div>
  <div class="yaxis">
    {#each yTicks as t (t)}
      <span>{compact(t)}</span>
    {/each}
  </div>
</div>

<style>
  .chart {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }
  .scroll {
    flex: 1;
    overflow-x: auto;
    padding-bottom: 2px;
  }
  .bars {
    position: relative;
    display: flex;
    align-items: stretch;
    gap: 3px;
    min-width: max-content;
    height: 270px;
  }
  .gridlines {
    position: absolute;
    inset: 0 0 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
  }
  .gridline {
    height: 1px;
    background: var(--border, #ddd);
    opacity: 0.5;
  }
  .bar-col {
    position: relative;
    flex: 1 0 11px;
    min-width: 9px;
    display: flex;
    flex-direction: column;
  }
  .bar-area {
    flex: 1;
    display: flex;
    align-items: flex-end;
  }
  .bar {
    width: 100%;
    border-radius: 4px 4px 2px 2px;
    background: linear-gradient(180deg, var(--accent), var(--accent-dim));
    opacity: 0.85;
    transition: opacity var(--dur-sm) var(--ease), transform var(--dur-sm) var(--ease);
    min-height: 2px;
  }
  .bar-col:hover .bar {
    opacity: 1;
    transform: scaleY(1.02);
  }
  .xlabel {
    height: 16px;
    flex: none;
    font-size: 10.5px;
    color: var(--text-3);
    white-space: nowrap;
    text-align: center;
    line-height: 16px;
  }
  .yaxis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 10.5px;
    color: var(--text-3);
    height: 270px;
    padding-bottom: 16px;
    text-align: right;
    min-width: 34px;
  }
</style>
