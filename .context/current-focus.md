# Current Focus & Recent Changes

> Active development status and recent major architecture updates.

## Current Version: 0.5.9

### Recent Architectural Refactoring
1. **17-Domain `src/` Restructuring**: Clean, single-responsibility domain subdirectories.
2. **Engine Subdomain Split**: Reorganized `src/engine/` into `routing/` and `selection/`.
3. **Registry Provider Metadata**: Standardized provider metadata in `src/registry/providers/`.
4. **Colocated Svelte 5 Frontend**: Web dashboard app located in `src/ui/app/`.
5. **Reorganized Test Suite**: All 117 test files relocated to matching `tests/` domain subdirectories.
6. **Documentation System**: Established `docs/` (architecture, components, guides, reference) and `.context/` AI agent working memory.

## Development Checklist for New Features & UI Changes

Whenever a feature is added, modified, or deleted in the codebase or UI:
- [ ] Update `docs/architecture/` if system data flow or lifecycle changes
- [ ] Update `docs/components/` for modified modules
- [ ] Update `docs/reference/` if new providers, apps, config keys, or env vars are introduced
- [ ] Update `.context/current-focus.md` with the change summary
- [ ] Update `AGENTS.md` and `CLAUDE.md` if agent workflows are affected
- [ ] Update `CHANGELOG.md`
