import type { Middleware } from './pipeline.js';

export const loggingMiddleware: Middleware = async (ctx, next) => {
  const start = Date.now();
  const res = await next();
  const duration = Date.now() - start;
  // Attached timing info if res.headers exists
  if (res.headers) {
    res.headers['x-dispatch-time-ms'] = String(duration);
  }
  return res;
};

export const errorHandlingMiddleware: Middleware = async (ctx, next) => {
  try {
    return await next();
  } catch (err: unknown) {
    return {
      status: 500,
      data: { error: err instanceof Error ? err.message : String(err) },
    };
  }
};
