<script lang="ts">
  interface Props { tone?: 'neutral' | 'success' | 'error' | 'warning' | 'accent'; children: import('svelte').Snippet; }
  let { tone = 'neutral', children }: Props = $props();
</script>

<span class="badge {tone}">{@render children()}</span>

<style>
  .badge { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600; line-height: 1.5; white-space: nowrap; }
  .neutral { background: var(--glass-bg-strong); color: var(--text-2); border: 1px solid var(--glass-border); }
  .success { background: var(--success-bg); color: var(--success); }
  .error { background: var(--error-bg); color: var(--error); }
  .warning { background: color-mix(in oklch, var(--warning) 14%, transparent); color: var(--warning); }
  .accent { background: var(--accent-muted); color: var(--accent); }
</style>
