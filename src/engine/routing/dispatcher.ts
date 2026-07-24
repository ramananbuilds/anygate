import type { LocalProvider, LocalProviderModel } from '../../types/index.js';

export interface DispatchContext {
  provider: LocalProvider;
  model: LocalProviderModel;
  body: unknown;
  headers?: Record<string, string>;
}

export interface DispatchResult {
  status: number;
  data: unknown;
  headers?: Record<string, string>;
}

export type Dispatcher = (ctx: DispatchContext) => Promise<DispatchResult>;

export const defaultDispatcher: Dispatcher = async (ctx) => {
  return {
    status: 200,
    data: { provider: ctx.provider.id, model: ctx.model.id, ok: true },
  };
};
