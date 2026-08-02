import { describe, expect, it } from 'vitest'
import { trackDownload, type DownloadProgress } from '../../src/services/downloads.js'

describe('trackDownload', () => {
  it('returns a progress-tracking function', () => {
    const tracker = trackDownload(1000)
    expect(typeof tracker).toBe('function')
  })

  it('reports progress for a single chunk', () => {
    const tracker = trackDownload(1000)
    const progress = tracker(500)

    expect(progress).toEqual({
      downloadedBytes: 500,
      totalBytes: 1000,
      completed: false,
    })
  })

  it('accumulates downloaded bytes across multiple chunks', () => {
    const tracker = trackDownload(1000)

    expect(tracker(100)).toEqual({
      downloadedBytes: 100,
      totalBytes: 1000,
      completed: false,
    })

    expect(tracker(300)).toEqual({
      downloadedBytes: 400,
      totalBytes: 1000,
      completed: false,
    })

    expect(tracker(500)).toEqual({
      downloadedBytes: 900,
      totalBytes: 1000,
      completed: false,
    })
  })

  it('marks download as completed when bytes reach total', () => {
    const tracker = trackDownload(1000)

    tracker(900)
    const progress = tracker(100)

    expect(progress.completed).toBe(true)
    expect(progress.downloadedBytes).toBe(1000)
  })

  it('marks download as completed when a chunk exceeds the total', () => {
    const tracker = trackDownload(1000)

    const progress = tracker(1500)

    expect(progress.completed).toBe(true)
    expect(progress.downloadedBytes).toBe(1500)
  })

  it('completes immediately when totalBytes is 0', () => {
    const tracker = trackDownload(0)
    const progress = tracker(0)

    expect(progress.completed).toBe(true)
    expect(progress.downloadedBytes).toBe(0)
    expect(progress.totalBytes).toBe(0)
  })

  it('handles zero-size chunks without advancing progress', () => {
    const tracker = trackDownload(1000)

    const progress = tracker(0)

    expect(progress.downloadedBytes).toBe(0)
    expect(progress.completed).toBe(false)
  })

  it('keeps each tracker instance independent', () => {
    const trackerA = trackDownload(500)
    const trackerB = trackDownload(500)

    trackerA(200)
    trackerB(400)

    const progressA = trackerA(300)
    const progressB = trackerB(100)

    expect(progressA.downloadedBytes).toBe(500)
    expect(progressA.completed).toBe(true)

    expect(progressB.downloadedBytes).toBe(500)
    expect(progressB.completed).toBe(true)
  })

  it('preserves totalBytes across all progress reports', () => {
    const tracker = trackDownload(2048)

    const progress1 = tracker(512)
    const progress2 = tracker(512)
    const progress3 = tracker(1024)

    expect(progress1.totalBytes).toBe(2048)
    expect(progress2.totalBytes).toBe(2048)
    expect(progress3.totalBytes).toBe(2048)
  })

  it('returns a DownloadProgress with all required fields', () => {
    const tracker = trackDownload(100)
    const progress: DownloadProgress = tracker(50)

    expect(progress).toHaveProperty('downloadedBytes')
    expect(progress).toHaveProperty('totalBytes')
    expect(progress).toHaveProperty('completed')
    expect(typeof progress.downloadedBytes).toBe('number')
    expect(typeof progress.totalBytes).toBe('number')
    expect(typeof progress.completed).toBe('boolean')
  })
})
