# Coding Standards

One language, one application. CI enforces lint, typecheck, tests and build on every pull
request.

## TypeScript

- Strict mode. No `any` in new code without a comment explaining why.
- Validate at every boundary: request bodies, external API responses, environment variables.
  Infer types from the schema, never hand-write a duplicate interface.
- Server components by default. `"use client"` only where interactivity requires it.
- Server-only code never imports into a client bundle. Anything touching a service key lives in
  `lib/` and is only called from server code.
- One error shape returned from routes. Error codes are contracts.

## Next.js

- Server actions and route handlers for mutations. No API layer invented for its own sake.
- Audio uploads go browser to storage with a signed URL, never proxied through a route.
- Any page that touches audio or layout is checked in Chrome on a real phone before it is done.

## Model and provider code

- `lib/evaluate.ts` is the only file that knows which model provider is used. Nothing else
  imports a provider SDK.
- Model responses are schema enforced. Never `JSON.parse` free text from a model.
- Every evaluation writes `model` and `rubric_version`. Any prompt or anchor change increments
  the rubric version.
- Speech signals (duration, pace, pauses, fillers) are computed from audio and timestamps. A
  model is never asked to measure them.

## Data

- Migrations checked in, forward only, one concern per migration.
- Row level security on every user-owned table.
- Service role key is server only. The anon key is the only key that reaches a browser.
- Facts (`attempt`) and judgements (`evaluation`) never merge into one table.

## Naming and contracts

Additions are fine, renames need an ADR-level reason:

- Angle slugs (`conflict`, `failure`, ...)
- Grade values (`again`, `hard`, `good`, `easy`)
- Rubric dimension names and `rubric_version`
- Error codes

## Git

- Branch per unit of work: `feature/<name>`, `fix/<name>`. No direct commits to `main`.
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- No AI attribution in commit messages.
- Never force push a shared branch.

## Tests

- Vitest. Test files beside the code as `foo.test.ts`.
- Unit test anything with real logic and no I/O: signal computation, grade derivation, the
  interval ladder, session composition.
- Do not test pages, layout, or the external providers.
- Write that logic test-first, red before green. See the `tdd` skill for the loop and its
  anti-patterns (tautological tests, mocking internals, horizontal slicing).
