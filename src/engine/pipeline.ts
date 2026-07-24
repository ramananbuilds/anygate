import type { DispatchContext, DispatchResult, Dispatcher } from './dispatcher.js';

export type Middleware = (ctx: DispatchContext, next: () => Promise<DispatchResult>) => Promise<DispatchResult>;

export class Pipeline {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(ctx: DispatchContext, finalHandler: Dispatcher): Promise<DispatchResult> {
    let index = -1;
    const runner = async (i: number): Promise<DispatchResult> => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const fn = this.middlewares[i];
      if (i === this.middlewares.length) return finalHandler(ctx);
      if (!fn) return finalHandler(ctx);
      return fn(ctx, () => runner(i + 1));
    };
    return runner(0);
  }
}
