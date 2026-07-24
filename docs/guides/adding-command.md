# Guide: Adding a New CLI Command

> How to add a new top-level subcommand or flag to anygate.

## Steps

### 1. Create the Command Module

Create a file in `src/cli/`:

```typescript
// src/cli/mycommand.ts
import * as p from '@clack/prompts';
import pc from 'picocolors';

export async function runMyCommand(args: string[]): Promise<void> {
  p.intro(pc.cyan('anygate — My Command'));
  // Command implementation
  p.outro('Done!');
}
```

### 2. Register in Dispatcher

Add the command case to `dispatchCommand()` in `src/cli/index.ts`:

```typescript
import { runMyCommand } from './mycommand.js';

export async function dispatchCommand(command: string, args: string[]): Promise<boolean> {
  switch (command) {
    // ... existing commands
    case 'mycommand':
      await runMyCommand(args);
      return true;
    default:
      return false;
  }
}
```

### 3. Add to Help Output

Update root help text in `src/cli.ts` to include the new subcommand and its usage details.

### 4. Write Unit Tests

Create `tests/cli/mycommand.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { runMyCommand } from '../../src/cli/mycommand.js';

describe('mycommand', () => {
  it('handles basic invocation', async () => {
    // Test logic
  });
});
```

### 5. Verify Build & Typecheck

```bash
npm run typecheck
npm run build
anygate mycommand
```
