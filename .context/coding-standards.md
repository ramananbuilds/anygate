# Coding Standards & Conventions

> Style guidelines, module import rules, and test conventions.

## Code Conventions

- **Module Format**: Node ESM only (`"type": "module"` in `package.json`). Relative imports MUST include `.js` file extensions (e.g. `import { foo } from './bar.js'`).
- **JSON Imports**: Use TypeScript 5.3+ import attributes: `import pkg from './package.json' with { type: 'json' };`.
- **Formatting & Style**: Strictly enforce TypeScript static type checking. Do not suppress type errors with `any` unless strictly required for dynamic SDK imports.
- **Asynchronous Execution**: Prefer `async`/`await` over raw promise chains. Use `node:child_process` `execFile` or `spawn` via promisified utilities.

## Testing Guidelines

- Every new module or refactored subdomain must include corresponding Vitest tests in `tests/`.
- Never disable or comment out failing assertions to make tests pass. Trace the root cause and fix the underlying contract.
- Keep test helpers in `tests/helpers/` (e.g. `ui-api-test-utils.ts`).
