import { EventEmitter } from 'node:events';

export interface AnygateEventMap {
  'provider:added': { providerId: string };
  'provider:removed': { providerId: string };
  'model:selected': { providerId: string; modelId: string };
}

export class AppEventEmitter extends EventEmitter {
  emitEvent<K extends keyof AnygateEventMap>(event: K, data: AnygateEventMap[K]): boolean {
    return this.emit(event, data);
  }
}

export const eventBus = new AppEventEmitter();
