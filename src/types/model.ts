import type { FreeStatus } from '../apps/shared/free-models.js';

export type ModelFormat = 'anthropic' | 'openai' | 'unsupported';

export interface ModelCost {
  input: number;
  output: number;
  cache_read?: number;
  cache_write?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  isFree: boolean;
  freeStatus?: FreeStatus;
  brand: string;
  sourceBackend: 'zen' | 'go';
  modelFormat: ModelFormat;
  cost?: ModelCost;
  contextWindow?: number;
  reasoning?: boolean;
  interleavedReasoningField?: string;
}

export interface LocalProviderModel {
  id: string;
  name: string;
  family: string;
  brand: string;
  modelFormat: 'anthropic' | 'openai' | 'cloud-code';
  upstreamModelId: string;
  baseUrl?: string;
  completionsUrl?: string;
  npm?: string;
  apiBaseUrl?: string;
  cost?: ModelCost;
  contextWindow?: number;
  supportedParameters?: string[];
  reasoning?: boolean;
  interleavedReasoningField?: string;
  useResponsesLite?: boolean;
  preferWebSockets?: boolean;
  isFree?: boolean;
  freeStatus?: FreeStatus;
  modalities?: ('text' | 'image')[];
}
