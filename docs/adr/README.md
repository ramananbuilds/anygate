# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for anygate.

## What is an ADR?

An ADR is a document that captures a key architectural decision, the context
behind it, the decision itself, and its consequences. ADRs are used to document
why certain choices were made, helping future contributors understand the reasoning.

## ADR Index

| # | Title | Status |
|---|-------|--------|
| [001](001-provider-routing.md) | Non-Anthropic Provider Routing via Vercel AI SDK | Accepted |
| [002](002-environment-isolation.md) | Environment Variable Isolation | Accepted |
| [003](003-gateway-security.md) | Gateway Server Security Model | Accepted |
| [004](004-credential-resolution.md) | Centralized Credential Resolution | Accepted |
| [005](005-structured-logging.md) | Structured JSON Logging | Accepted |

## Format

Each ADR follows the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/) format:

1. **Title** — Descriptive title
2. **Status** — Proposed, Accepted, Superseded, or Deprecated
3. **Context** — The problem and relevant constraints
4. **Decision** — The chosen approach
5. **Consequences** — Trade-offs and implications
6. **References** — Links to relevant source files

## Creating a New ADR

1. Copy the template from an existing ADR.
2. Use the next sequential number (e.g., `006-title.md`).
3. Set the status to "Proposed".
4. Update this index.
