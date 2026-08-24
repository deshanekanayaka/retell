# Retell

A five minute daily voice session that drills your own interview stories against real question
variants, so answering well becomes a habit instead of a cram. Everyone else gives you a mock
interview once you already have one booked; Retell makes practice a daily habit so you are ready
before you apply. Free in Phase 1, no payment code.

## Context files

Read these first, every session:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

Deep documentation and source of truth lives in `docs/`; the index is @docs/00-README.md.
Feature work must not contradict `docs/`. If it needs to, that is a spec change and possibly an
ADR, decided by Deshan first.

## Repo layout

Single Next.js application. No monorepo.

- `app/` : Next.js App Router, pages and server routes
- `components/` : React components
- `lib/` : server logic. `lib/evaluate.ts` is the only file that knows which model provider is used
- `supabase/migrations/` : checked in, forward only
- `docs/`, `context/` : documentation layers, see docs/00-README.md

Must NOT be scaffolded yet: no queue or background worker, no cache layer, no admin interface,
no analytics beyond the metrics in docs/01-PRD.md section 6, no payment code, no iOS path.

## Commands

Verified working as of S0.

- Dev server: `pnpm dev` (http://localhost:3000)
- Tests: `pnpm test` | Build: `pnpm build`
- Lint and typecheck: `pnpm lint` and `pnpm typecheck`

## Hard rules

**Product boundaries.** These are ADR-level and are never worked around:

- Never write, draft, embellish or suggest story content for a user. Retell elicits, structures,
  probes and labels only. Anything it writes becomes a lie a candidate repeats in a real
  interview (ADR-009).
- Never promise or imply an outcome. No "get hired", no "pass your interview", no success rates.
- Recordings are private. No sharing, no feed, no training use without explicit opt in, and
  delete means delete.
- No question shown to a user ever names a competency (leadership, teamwork, problem solving).
- No dark patterns on the habit layer. Streaks and reminders yes, guilt and loss framing no.

**Founder authored, propose only.** Draft and argue, never decide:

- The scoring rubric and how grades are derived
- Scheduling rules and intervals
- Anything shown to a user as a claim about their ability
- Privacy handling of recordings
- Pricing

**Engineering.**

- Lint, typecheck, tests and build are gates. Never weakened, skipped or marked flaky to merge.
- Raw audio is never lost. Everything downstream can be recomputed from it; it cannot.
- Facts and judgements stay in separate tables. Every evaluation is stamped with model and
  rubric version.
- Migrations checked in, forward only. Secrets in environment variables only, server side only.
- Ask before committing. Never commit with a failing build or tests.
- Conventional commits. No AI attribution in commit messages.

**Copy.**

- No em dashes anywhere, in prose, docs or UI.
- Never tell a user their answer is wrong. Weak, vague or unstructured, never wrong.
- Never say "AI-powered" or "AI coach" in user-facing copy.
- Plain, short, warm. Feedback is specific or it is not shown.
- No praise the work does not support. Warmth is not congratulation.
- Voice and tone are owned by docs/07-design-system.md section 6. These lines summarise it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
