<script lang="ts">
  interface Props { height?: number; }
  let { height = 14 }: Props = $props();
</script>

<span class="skeleton" style="height:{height}px"></span>

<style>
  .skeleton {
    display: block; border-radius: 6px; width: 100%;
    background: linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 37%, var(--surface) 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
  }
  @keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
</style>
