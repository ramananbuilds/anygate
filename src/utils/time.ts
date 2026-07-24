export function delayMs(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toISOString();
}
