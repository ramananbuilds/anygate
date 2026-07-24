# Guide: Testing & Quality Assurance

> Test suite architecture, running tests, writing unit tests, and mocking network/OS dependencies.

## Overview

anygate uses **Vitest** for its test suite. Test files mirror `src/` domain subdirectories under `tests/`:

```text
tests/
├── apps/         # Application launcher, prompt, & session tests (31 files)
├── auth/         # OAuth flow & token handling tests
├── cli/          # CLI subcommand & update check tests
├── engine/       # Routing & selection heuristic tests
├── gateway/      # Gateway server, HTTP proxy, & SDK adapter tests
├── helpers/      # Mock HTTP request/response test utilities
├── registry/     # Provider registry, template fetcher, & model sync tests
├── services/     # Health check, usage, & update service tests
├── storage/      # Configuration & credential store tests
├── ui/           # UI REST API & dashboard control tests
└── web-search/   # Web search tool tests
```

## Running Tests

```bash
# Run all tests once
npm test

# Run type checking without emitting JavaScript
npm run typecheck

# Run a single test file
npx vitest run tests/storage/config.test.ts

# Run tests in a specific domain
npx vitest run tests/gateway/

# Run tests matching a name pattern
npx vitest run -t "starts local mode"
```

## Writing Tests

### Test Helper Guidelines

- Use `tests/helpers/ui-api-test-utils.ts` for UI API endpoint tests.
- Mock network calls using Node's native `http` server or Vitest `vi.spyOn(global, 'fetch')`.
- Clean up any temporary filesystem writes in `afterEach` or `afterAll`.

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('My Module', () => {
  beforeEach(() => {
    // Setup clean environment or mocks
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('behaves correctly under condition X', () => {
    expect(true).toBe(true);
  });
});
```
