<script lang="ts">
  import { Card } from '../primitives';
  import StatCard from './StatCard.svelte';
  import type { DashboardAnalytics } from '../../api/analytics';

  interface Props {
    report: DashboardAnalytics;
  }
  let { report }: Props = $props();

  function compact(n: number): string {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return String(n);
  }
  function fmtHour(h: number): string {
    const am = h < 12;
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh} ${am ? 'AM' : 'PM'}`;
  }

  const cards = $derived([
    { label: 'Sessions', value: compact(report.sessions) },
    { label: 'Messages', value: compact(report.messages) },
    { label: 'Total tokens', value: compact(report.totalTokens) },
    { label: 'Active days', value: String(report.activeDays) },
    { label: 'Current streak', value: `${report.currentStreakDays}d` },
    { label: 'Longest streak', value: `${report.longestStreakDays}d` },
    { label: 'Peak hour', value: fmtHour(report.peakHour) },
    { label: 'Favorite model', value: report.favoriteModel },
  ]);
</script>

<div class="grid">
  {#each cards as c (c.label)}
    <Card padding="18px">
      <StatCard label={c.label} value={c.value} />
    </Card>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  @media (max-width: 920px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 520px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
