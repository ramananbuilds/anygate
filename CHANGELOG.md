# Changelog

## 0.5.5 (2026-07-19)

### Dashboard analytics fixes
- **Activity heatmap now reflects real usage only.** The per-day color intensity
  is bucketed by **daily token volume** (not raw request count), and every day
  with usage is guaranteed a visible color (level 1–4 scaled by volume relative
  to your busiest day). Unused days render as solid black squares — no more
  uniformly "highlighted" cubes.
- **Heatmap tooltips** now show token volume per day (e.g. `2026-07-18 · 211.8M tokens`).
- **Antigravity usage is counted and attributed.** The Cloud Code gateway logs
  token usage per request (app label `Antigravity`), so activity from the
  Antigravity app now appears in the dashboard instead of being invisible.
- **Model breakdown shows source-app badges.** Each model row displays the apps
  that contributed usage (`gateway`, `Antigravity`, …), and gateway + Antigravity
  entries for the same physical model are merged into one row.
- **Token volume chart** auto-scrolls to the most recent day on load so real
  usage is visible up front (no hidden scroll), with active days highlighted.
- Real-data-only dashboard: the mock fallback was removed; the store shows an
  "Offline" badge if the analytics API is unreachable rather than fake numbers.
- `B` (billion) token formatting appears automatically once combined totals
  cross 1e9 tokens.

### Internal
- `HeatDay.count` now carries the day's token total (drives color + tooltip).
- Gateway model-id normalization so Antigravity and gateway entries for the same
  model converge in the breakdown.
- Added test isolation for the Antigravity gateway tests (throwaway temp dir)
  so they no longer pollute the real `~/.anygate/analytics.jsonl`.
