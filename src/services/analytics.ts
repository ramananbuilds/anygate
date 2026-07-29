import { appendStorageLog } from '../storage/logs.js'

export interface AnalyticsEvent {
  name: string
  payload?: Record<string, unknown>
  timestamp?: number
}

export function logAnalyticsEvent(event: AnalyticsEvent): void {
  const ts = event.timestamp ?? Date.now()
  appendStorageLog('analytics', JSON.stringify({ ...event, timestamp: ts }))
}
