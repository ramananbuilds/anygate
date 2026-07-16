<script lang="ts">
  import { providers } from '../lib/stores/providers.svelte';
  import { favorites } from '../lib/stores/favorites.svelte';
  import { apps } from '../lib/stores/apps.svelte';
  import { server } from '../lib/stores/server.svelte';
  import { analytics, loadAnalytics } from '../lib/stores/analytics.svelte';
  import { Card, Button, Spinner, Badge, Tabs } from '../lib/components/primitives';
  import DoctorPanel from '../lib/components/health/DoctorPanel.svelte';
  import { navigate } from '../lib/stores/router.svelte';
  import TimeRangeFilter from '../lib/components/dashboard/TimeRangeFilter.svelte';
  import StatGrid from '../lib/components/dashboard/StatGrid.svelte';
  import ActivityHeatmap from '../lib/components/dashboard/ActivityHeatmap.svelte';
  import TokenBarChart from '../lib/components/dashboard/TokenBarChart.svelte';
  import ModelBreakdownList from '../lib/components/dashboard/ModelBreakdownList.svelte';
  import type { RangeId } from '../lib/api/analytics';

  let { showSampleBadge = true }: { showSampleBadge?: boolean } = $props();

  let tab = $state<'overview' | 'models'>('overview');
  const totalModels = $derived(providers.list.reduce((n, p) => n + p.enrichedModels.length, 0));
  const totalProviders = $derived(providers.list.length);
  const installedApps = $derived(apps.list.filter((a) => a.installed));

  function onRange(r: RangeId) {
    void loadAnalytics(r);
  }

  $effect(() => {
    void loadAnalytics(analytics.range);
  });
</script>

<div class="dash">
  <div class="head">
    <div class="title">
      <div class="title-row">
        <h2>Dashboard</h2>
        {#if showSampleBadge && analytics.mock}<span class="sample" title="Sample data — connect a backend to see real usage">Sample</span>{/if}
      </div>
      <p>Usage analytics for your local gateway · {analytics.range === 'all' ? 'all time' : analytics.range}</p>
    </div>
    <TimeRangeFilter value={analytics.range} onchange={onRange} />
  </div>

  <Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'models', label: 'Models' }]} bind:active={tab} />

  {#if analytics.loading && !analytics.report}
    <div class="loading"><Spinner label="Loading analytics…" /></div>
  {:else if analytics.report}
    {#if tab === 'overview'}
      <div class="section">
        <StatGrid report={analytics.report} />
      </div>
      <Card padding="20px" class="mt">
        <div class="sec-head"><h3>Activity</h3><span class="hint">Daily activity over {analytics.range === 'all' ? 'the last year' : analytics.range}</span></div>
        <ActivityHeatmap days={analytics.report.heatmap} />
      </Card>
    {:else}
      <Card padding="20px" class="mt">
        <div class="sec-head"><h3>Token volume</h3><span class="hint">Total tokens per day</span></div>
        <TokenBarChart data={analytics.report.dailyTokens} />
      </Card>
      <Card padding="20px" class="mt">
        <div class="sec-head"><h3>Model breakdown</h3><span class="hint">Share of total usage</span></div>
        <ModelBreakdownList models={analytics.report.models} />
      </Card>
    {/if}
  {/if}

  <div class="cols mt">
    <Card padding="20px">
      <div class="sec-head"><h3>Quick launch</h3></div>
      {#if apps.loading}
        <Spinner label="Loading apps…" />
      {:else}
        <div class="quick">
          {#each installedApps as app (app.id)}
            <Button variant="subtle" onclick={() => navigate('apps')}>{app.name}</Button>
          {/each}
          {#if installedApps.length === 0}<p class="muted">No apps detected. Add a provider first.</p>{/if}
        </div>
      {/if}
    </Card>
    <DoctorPanel />
  </div>

  <div class="grid mt">
    <Card hover padding="18px" onclick={() => navigate('providers')}>
      <div class="stat"><span class="num">{totalProviders}</span><span class="lbl">Providers</span></div>
    </Card>
    <Card hover padding="18px" onclick={() => navigate('models')}>
      <div class="stat"><span class="num">{totalModels}</span><span class="lbl">Models</span></div>
    </Card>
    <Card hover padding="18px" onclick={() => navigate('models')}>
      <div class="stat"><span class="num">{favorites.general.length + favorites.agy.length}</span><span class="lbl">Favorites</span></div>
    </Card>
    <Card hover padding="18px" onclick={() => navigate('apps')}>
      <div class="stat">
        <span class="num">{installedApps.length}</span><span class="lbl">Apps ready</span>
        {#if server.status?.running}<Badge tone="success">server on</Badge>{/if}
      </div>
    </Card>
  </div>
</div>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }
  .title h2 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-1);
  }
  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sample {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-muted);
    border: 1px solid var(--border-glow);
    padding: 2px 8px;
    border-radius: 999px;
  }
  .title p {
    color: var(--text-3);
    font-size: 13px;
    margin-top: 6px;
    text-transform: capitalize;
  }

  .section {
    margin-top: 28px;
  }
  :global(.mt) {
    margin-top: 28px;
  }
  .dash {
    display: flow-root;
  }
  .sec-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
  }
  .sec-head h3 {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-1);
  }
  .hint {
    font-size: 12px;
    color: var(--text-3);
  }
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .quick {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .muted {
    color: var(--text-3);
    font-size: 13px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .num {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 800;
    color: var(--text-1);
  }
  .lbl {
    font-size: 12.5px;
    color: var(--text-3);
  }
  .loading {
    margin-top: 28px;
    display: flex;
    justify-content: center;
  }
  @media (max-width: 920px) {
    .cols {
      grid-template-columns: 1fr;
    }
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
