# Guide: Adding a New App Target

> How to add support for a new coding tool (e.g., a new AI IDE or CLI).

## Steps

### 1. Define the Launch Target

Add the new target to `GatewayLaunchTarget` in `src/apps/shared/target-compatibility.ts`:

```typescript
export type GatewayLaunchTarget =
  | 'claude' | 'claude-app' | 'codex' | 'codex-app'
  | 'gemini' | 'server' | 'antigravity'
  | 'newapp';  // ← add here
```

### 2. Add Compatibility Rules

Update `isTargetCompatibleModel()` in the same file if the new app has specific model format requirements.

### 3. Create the App Module

Create `src/apps/newapp/`:

```text
src/apps/newapp/
├── cli.ts        # Help text, launch flow
├── command.ts    # Subcommand handler
└── index.ts      # Barrel exports
```

### 4. Create the CLI Subcommand

Create `src/cli/newapp.ts`:

```typescript
import { handleNewappCommand } from '../apps/newapp/command.js';

export async function runNewappCommand(args: string[]): Promise<void> {
  await handleNewappCommand(args);
}
```

### 5. Register in CLI Dispatcher

Add the command to `src/cli/index.ts`:

```typescript
case 'newapp':
  return runNewappCommand(childArgs);
```

And add to `src/cli.ts` parse logic.

### 6. Add App Detection

Update `src/apps/shared/native-launcher.ts` to detect the new app binary.

### 7. Add Preferences

Add `lastNewappProvider` / `lastNewappModel` to `UserPreferences` in `src/types/config.ts`.

### 8. Add Tests

Create test files in `tests/apps/` for the new app's launch, routing, and compatibility.

### 9. Update Docs

- Add to `docs/reference/supported-apps.md`
- Update `AGENTS.md` and `CLAUDE.md`
