// src/core/redact.ts — centralized secret redaction for debug/trace logs.
//
// Hoisted from agents/shared/trace-log.ts so any layer (core, gateway,
// registry) can redact secrets without importing agent code — preserving the
// one-way dependency rule (core never imports agents; gateway never imports
// agents for redaction).

const REDACTION_PATTERNS: Array<(line: string) => string> = [
  // Bearer / Authorization headers
  (line) => line.replace(/Bearer\s+[A-Za-z0-9._\-+/=]+/gi, 'Bearer [REDACTED]'),
  (line) => line.replace(/("authorization"\s*:\s*")[^"]+/gi, '$1[REDACTED]'),
  (line) => line.replace(/(x-api-key"\s*:\s*")[^"]+/gi, '$1[REDACTED]'),
  // Common API key prefixes
  (line) => line.replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, 'sk-[REDACTED]'),
  (line) => line.replace(/\bsk-ant-[A-Za-z0-9_-]{8,}\b/g, 'sk-ant-[REDACTED]'),
  (line) => line.replace(/\bAIza[A-Za-z0-9_-]{20,}\b/g, 'AIza[REDACTED]'),
  (line) => line.replace(/\bgsk_[A-Za-z0-9]{20,}\b/g, 'gsk_[REDACTED]'),
];

/** Redact secrets on a single log line. Pure — safe to call on any string. */
export function redactTraceLine(line: string): string {
  let out = line;
  for (const apply of REDACTION_PATTERNS) {
    out = apply(out);
  }
  return out;
}

/** Redact secrets from a whole multi-line log blob. */
export function redactTraceLog(content: string): string {
  return content.split('\n').map(redactTraceLine).join('\n');
}
