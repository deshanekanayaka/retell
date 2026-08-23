# Coding Standards

One language, one application. CI enforces lint, typecheck, tests and build on every pull
request.

## Simplicity

Simple beats clever, even when the simple solution looks unimpressive. Write for whoever reads
this at 2am, not whoever admires it in review.

- If it took 10 minutes to work out how your own code works, it is too clever. Rewrite it.
- A boring loop beats a chained one-liner nobody can debug.
- Less inheritance, less polymorphism, fewer classes, all else equal.
- Reach for a language feature because the problem needs it, not because it's new to you.
- Cap nesting at two or three levels. Deeper nesting means extract a function or invert with a
  guard clause.
- Guard clauses and early returns over if/else pyramids. Handle invalid cases first, let the
  happy path run flat at the bottom.
- Simple means low cognitive load, not fewest lines. Compressing code can destroy readability.

## SOLID, the parts that matter day to day

- **Single responsibility**: one reason to change. If you can't describe what something does
  without "and", split it.
- **Dependency inversion**: depend on abstractions, not concrete implementations. Can the
  database or HTTP client be swapped in a test without touching business logic? If not, it's
  wired too tightly.
- **Open/closed and Liskov**: understand them, don't design for them upfront. Refactoring
  targets, not starting constraints.
- **Interface segregation**: a function asks for exactly the data it needs, not the whole
  object.
- Composition over inheritance by default. Inheritance couples you to a hierarchy you rarely
  control.

## Naming style

Names are the highest leverage readability decision. Spend real time on them.

- Should communicate purpose on their own; good code is self documenting.
- Length scales with scope: `i` in a three-line loop is fine, `d` as a module-level variable is
  not.
- Functions are verbs (`calculateDiscount`), booleans read as predicates (`isActive`,
  `hasPermission`), collections are plural.
- Encode the unit where it's ambiguous: `timeoutSeconds`, not `timeout`. `pricePence`, not
  `price`.
- No abbreviations except universally known ones (`id`, `url`, `db`).
- Rename the moment a name stops being accurate. A stale name is worse than no name.
- Kill magic numbers and strings. `MAX_RETRIES = 3` explains itself; a bare `3` does not.

## Functions

- Do one thing. One level of abstraction per function; don't mix orchestration with low-level
  parsing in the same body.
- More than three arguments is a design smell. Usually means a missing object.
- Never a boolean flag that switches behaviour. Two named functions beat one with
  `doFast: true`.
- Return early, return one type. Don't return a value on success and `null`/`undefined` on
  failure from the same function.
- Separate functions that compute from functions that do. Pure logic is testable, side effects
  are not.
- No hidden side effects. A function named `getUser` must never write to the database.

## Comments

- Comment the why: the constraint, the trade-off, the bug this guards against, the reason the
  obvious approach fails. Never the what — `// increment counter` above `counter += 1` is noise
  that drifts out of date.
- If a block needs a comment to explain what it does, extract it into a well-named function
  instead.
- TODO without an owner or a ticket reference is a lie. Either fix it or write down why not.

## Data and state

- Explicit over implicit. No relying on object keys that may or may not exist, no truthiness
  checks on values that could legitimately be `0` or `""`.
- Default to immutable. Reassigning and mutating shared state is where the hard bugs live.
- Never mutate a caller's argument. Return a new value instead.
- Keep state as local as possible. Module-level mutable state and singletons make code
  untestable.
- Make invalid states unrepresentable through types where the language allows it. A typed union
  beats a status string checked in six places.
- Parse, don't validate: convert unstructured input into a typed object once at the boundary,
  then trust it everywhere downstream.

## Coupling

- Low coupling, high cohesion. Things that change together live together; things that don't
  shouldn't know about each other.
- Law of Demeter: talk to immediate collaborators only. `order.customer.address.city` is three
  assumptions about other objects' internals.
- Dependencies point inward. Business logic must not import framework, HTTP, or ORM specifics.
- If changing one module forces changes in three others, the boundary is drawn wrong.

## Practical discipline

- Make it work, make it right, make it fast, in that order. Optimise only after measuring.
- Refactor in a separate commit from behaviour changes. Mixing them makes both unreviewable.
- Boy Scout rule: leave each file slightly cleaner than you found it, proportional to the
  change.
- Consistency inside the codebase beats personal preference. Match the surrounding style even
  when you dislike it.
- When two designs look equally good, pick the one that's easier to delete later.

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
