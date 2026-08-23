# ADR-003: TypeScript everywhere, no separate Python backend

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Browser audio capture is JavaScript, so the client half of Retell has no language choice. The
question was whether the server should be Python, which would be conventional for anything
involving speech and models. Retell is built by one developer who is comfortable in both.

## Decision

The entire application is TypeScript, in one Next.js codebase.

## Alternatives rejected

- **Python backend with a JavaScript frontend**: two languages, two deploys, and the shape of
  every record written twice with nothing to keep the definitions in sync.

## Consequences

- One repository, one deploy, one type system. A renamed field surfaces at compile time in both
  the API and the screen that renders it.
- No HTTP layer between pages and data access, because server code and pages share a tree.
- Python's numerical and machine learning ecosystem is unavailable in the app. This costs
  nothing in Phase 1 or 2, because the backend calls other people's APIs and does no numerical
  work of its own.
- Offline corpus analysis for rubric tuning may still be written in Python as a separate script.
  It is not part of the application.

## References

02-system-architecture.md section 3.1.
