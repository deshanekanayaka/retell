# Deployment

Honest state: **nothing is deployed yet.** This is the intended shape, written before S0 so
setup has something to follow.

## Environments

| Env | Host | Deployed by |
| --- | --- | --- |
| Production | Vercel | Push to `main`, after CI passes |
| Preview | Vercel | Every pull request, automatically |
| Local | `pnpm dev` | Developer machine |

Database and object storage are Supabase. Production and preview share one project in Phase 1,
which is acceptable only because there are no real users yet.

**Revisit before the cohort test:** preview deployments writing to the production database is
not acceptable once real recordings exist. A separate Supabase project for preview is required
before S7.

## Migrations

Checked into the repository, applied forward only, never edited after being applied. Applied to
production as part of the deploy, never by hand from a developer machine.

## Scheduled jobs

One, from S4: delete unclaimed anonymous audio older than 24 hours (FR-8). Runs as a scheduled
function. It must never be run manually against production.

## Secrets

Environment variables only. Never committed, never logged, never sent to the client.

| Secret | Where |
| --- | --- |
| Supabase service role key | Server environment only. Never in a client bundle |
| Supabase anon key | Client, by design |
| Deepgram API key | Server only |
| Model provider API key | Server only |

Any key that appears in a client bundle is treated as compromised and rotated.
