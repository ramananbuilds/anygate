import type { DispatchContext, DispatchResult, Dispatcher } from './dispatcher.js';

export interface FailoverOptions {
  maxRetries: number;
  alternateProviders?: string[];
}

export async function executeWithFailover(
  ctx: DispatchContext,
  handler: Dispatcher,
  options: FailoverOptions,
): Promise<DispatchResult> {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts <= options.maxRetries) {
    try {
      const res = await handler(ctx);
      if (res.status < 500) return res;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
    attempts++;
  }

  throw lastError ?? new Error('Failover exhausted all retry attempts');
}
