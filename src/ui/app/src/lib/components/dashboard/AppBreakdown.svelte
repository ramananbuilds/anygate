<script lang="ts">
  import type { AppUsage } from '../../api/analytics';

  // Which app originated the traffic. `app` is recorded on every usage event by
  // the gateway/proxy/antigravity paths but was never aggregated before.
  interface Props {
    apps: AppUsage[];
    inputTokens: number;
    outputTokens: number;
  }
  let { apps, inputTokens, outputTokens }: Props = $props();

  const APP_LABELS: Record<string, string> = {
    gateway: 'Server gateway',
    claude: 'Claude Code',
    codex: 'Codex',
    gemini: 'Gemini',
    antigravity: 'Antigravity',
    unknown: 'Unknown source',
  };

  const totalTokens = $derived(inputTokens + outputTokens);

  function fmt(n: number): string {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return String(n);
  }
</script>

<div class="wrap">
  {#if apps.length === 0}
    <p class="empty">No app usage recorded in this range.</p>
  {:else}
    <div class="rows">
      {#each apps as a (a.app)}
        <div class="row">
          <span class="dot" style:background={a.color}></span>
          <span class="name">{APP_LABELS[a.app] ?? a.app}</span>
          <div class="meter" aria-hidden="true">
            <div class="fill" style:width="{Math.max(2, a.share * 100)}%" style:background={a.color}></div>
          </div>
          <span class="pct">{(a.share * 100).toFixed(a.share < 0.1 ? 1 : 0)}%</span>
          <span class="tok" title="{a.messages} request{a.messages === 1 ? '' : 's'}">{fmt(a.inputTokens + a.outputTokens)}</span>
        </div>
      {/each}
    </div>

    {#if totalTokens > 0}
      <div class="split">
        <div class="split-bar" aria-hidden="true">
          <div class="in" style:width="{(inputTokens / totalTokens) * 100}%"></div>
          <div class="out" style:width="{(outputTokens / totalTokens) * 100}%"></div>
        </div>
        <div class="legend">
          <span><i class="sw in"></i>Prompt {fmt(inputTokens)}</span>
          <span><i class="sw out"></i>Completion {fmt(outputTokens)}</span>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .wrap { display: flex; flex-direction: column; gap: 16px; }
  .rows { display: flex; flex-direction: column; gap: 11px; }
  .row { display: grid; grid-template-columns: 9px minmax(88px, 1.1fr) minmax(0, 2fr) 40px 52px; align-items: center; gap: 10px; font-size: 13px; }
  .dot { width: 9px; height: 9px; border-radius: 50%; }
  .name { color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .meter { height: 6px; background: var(--surface-2); border-radius: 999px; overflow: hidden; }
  .fill { height: 100%; border-radius: 999px; transition: width var(--dur-lg) var(--ease); }
  .pct { text-align: right; color: var(--text-2); font-variant-numeric: tabular-nums; font-size: 12px; }
  .tok { text-align: right; color: var(--text-3); font-family: ui-monospace, monospace; font-size: 11.5px; }
  .split { border-top: 1px solid var(--border); padding-top: 14px; display: flex; flex-direction: column; gap: 9px; }
  .split-bar { display: flex; height: 8px; border-radius: 999px; overflow: hidden; background: var(--surface-2); }
  .split-bar .in { background: var(--accent); }
  .split-bar .out { background: var(--accent-2, var(--accent-dim)); }
  .legend { display: flex; gap: 16px; font-size: 12px; color: var(--text-3); }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .sw { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
  .sw.in { background: var(--accent); }
  .sw.out { background: var(--accent-2, var(--accent-dim)); }
  .empty { font-size: 13px; color: var(--text-3); padding: 20px 0; text-align: center; }
</style>
