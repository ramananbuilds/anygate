export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidApiKey(key: string): boolean {
  return typeof key === 'string' && key.trim().length > 0;
}
