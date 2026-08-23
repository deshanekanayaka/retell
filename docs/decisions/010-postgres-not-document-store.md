# ADR-010: Postgres, not a document store

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

The reference implementation reviewed during planning used Firestore, and document stores are a
common default for this kind of application. Retell's central query is "which items are due for
this user now", and its data is relational: users own stories, stories pair into items, items
have schedules and attempts.

## Decision

Postgres, provisioned through Supabase alongside auth and object storage.

## Alternatives rejected

- **Firestore**: answers due-date and join queries badly, and the data is genuinely relational.
- **Postgres, auth and storage from three separate vendors**: better components, three
  relationships and three failure modes for a solo developer.

## Consequences

- The scheduler is an ordinary indexed query.
- Row level security is available and is how per user isolation is enforced.
- Migrations are checked in and applied forward only.
- Supabase becomes a single point of dependency across data, auth and audio.

## References

02-system-architecture.md sections 3.1 and 3.4. 06-data-and-privacy.md.
