# Retell

A five minute daily voice session that drills your own interview stories against real question
variants, so answering well becomes a habit instead of a cram. You record your own career
stories, then answer behavioural questions out loud, and get your own words back with one gap
named.

Free in Phase 1, no payment code. Phase 1 answers one question: do people come back on day four?

## Stack

Next.js (App Router, TypeScript), Tailwind, Supabase (Postgres, Auth, Storage), Deepgram for
transcription, Claude for evaluation. Hosted on Vercel. See
[docs/02-system-architecture.md](docs/02-system-architecture.md) for the full picture and what
was rejected.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase, Deepgram, and Anthropic keys
pnpm dev                     # http://localhost:3000
```

Other commands:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentation

Start with [docs/00-README.md](docs/00-README.md) for the full document map. `docs/` is the
source of truth; `context/` is a compact summary loaded every session and never overrides it.

| Question | Doc |
| --- | --- |
| What we are building and for whom | [docs/01-PRD.md](docs/01-PRD.md) |
| System design, stack, what is not built | [docs/02-system-architecture.md](docs/02-system-architecture.md) |
| Order of work, gates, kill criteria | [docs/03-delivery-plan.md](docs/03-delivery-plan.md) |
| Capture, transcription, the rubric | [docs/04-voice-and-evaluation.md](docs/04-voice-and-evaluation.md) |
| Items, grading, scheduling, sessions | [docs/05-spaced-repetition.md](docs/05-spaced-repetition.md) |
| Schema, retention, privacy promises | [docs/06-data-and-privacy.md](docs/06-data-and-privacy.md) |

## Working on this repo

Read [CLAUDE.md](CLAUDE.md) and the files under `context/` before starting work. Notably:

- Branch per unit of work (`feature/<name>`, `fix/<name>`), conventional commits, no direct
  commits to `main`.
- Lint, typecheck, tests, and build are gates. Never weakened or skipped to merge.
- `lib/evaluate.ts` is the only file that knows which model provider is used.
- Raw audio is never lost. Facts and judgements are stored in separate tables.
