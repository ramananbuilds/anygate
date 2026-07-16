// Typed fetch wrapper for the anygate UI API.
import type { UiApiError } from './types';

export class ApiError extends Error {
  hint?: string;
  status: number;
  constructor(message: string, status: number, hint?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.hint = hint;
  }
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const opts: RequestInit = { method, headers: {} };
  if (body !== undefined) {
    (opts.headers as Record<string, string>)['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (signal) opts.signal = signal;

  let res: Response;
  try {
    res = await fetch(path, opts);
  } catch (err) {
    throw new ApiError(`Network error: ${String(err)}`, 0);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const errBody = data as UiApiError | undefined;
    throw new ApiError(errBody?.error ?? `Request failed (${res.status})`, res.status, errBody?.hint);
  }
  return data as T;
}

export function api<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(method, path, body, signal);
}

export function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>('GET', path, undefined, signal);
}

export function postJson<T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>('POST', path, body, signal);
}
