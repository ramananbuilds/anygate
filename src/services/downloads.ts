export interface DownloadProgress {
  downloadedBytes: number;
  totalBytes: number;
  completed: boolean;
}

export function trackDownload(totalBytes: number): (chunkSize: number) => DownloadProgress {
  let downloadedBytes = 0;
  return (chunkSize: number) => {
    downloadedBytes += chunkSize;
    return {
      downloadedBytes,
      totalBytes,
      completed: downloadedBytes >= totalBytes,
    };
  };
}
