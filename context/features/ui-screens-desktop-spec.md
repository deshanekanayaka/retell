# UI Screens, Desktop Spec

## Overview

Builds the desktop-viewport visual layer for all 16 Phase 1 screens defined in the "Retell
Phase 1 wireframes" Claude Design project, applying `docs/07-design-system.md` (type, colour,
shape, motion, voice) in place of the wireframe's greyscale placeholders. Presentational only.
No new recording, transcription, evaluation, account, or storage logic. Where a screen's real
behaviour already exists (S1: `PermissionScreen`, `BrowserGate`, `RecordingUI`, `Waveform`,
`ValidationFlow`), this feature restyles those components without changing what they do. Where a
screen's underlying feature has not shipped yet (S4 accounts, S5 onboarding entry/mic-check/tile
picker, S6 session flow, stories, recordings/privacy), this feature builds a static desktop
component with placeholder content in the exact shape the real data will later fill, and no
wiring to real state, routes, or Supabase.

Touches the presentational surface of FR-1 through FR-12 (S5, S4), FR-18, FR-22 through FR-24,
FR-31 (S3), FR-38, FR-39 (S6/privacy), visual shape only. Does not implement any of them; each
still ships for real in its own step per `docs/03-delivery-plan.md` section 3.

## Requirements

- MUST cover all 16 screens from the wireframe, desktop viewport only (1280x800): Landing,
  Browser gate, Permission explainer, Permission denied, Mic check, Setting picker, Question
  ready, Recording, Processing, Recovery, Feedback (+ no-result variant), Signup, Session end
  after skips, Session complete, Stories list (+ empty variant), Recordings and privacy.
- MUST use `docs/07-design-system.md` tokens for type, colour, spacing, shape, and motion. No
  greyscale wireframe styling in the shipped result.
- MUST restyle `PermissionScreen`, `BrowserGate`, `RecordingUI`, `Waveform` in place rather than
  creating parallel components, since their behaviour (S1) already ships.
- MUST NOT add functionality that does not exist today: no signup form submission, no story
  save, no session composition, no deletion, no real transcript/evaluation data. Static or
  visually-placeholder content stands in.
- MUST NOT wire any not-yet-shipped screen into a real, user-reachable route. They live under a
  non-production preview path (see Implementation notes) so nothing in `docs/03-delivery-plan.md`
  section 3's order (S4 after S3, S5 after the validation read, S6 after S5) ships to real users
  ahead of its gate.
- MUST use the real copy from the wireframe verbatim (it is quoted, not placeholder, per the
  wireframe's own legend) except where it conflicts with `context/ai-interaction.md` product
  rules (no em dashes, never "wrong", no competency names, no numeric score). Matches were
  checked and none of the wireframe copy conflicts.
- MUST leave the 04 Permission denied "fictional example answer" as a visibly placeholder block,
  not real copy. `context/tasks.md` already tracks the founder-authored worked example as an
  open, separate task.

## Out of scope

- Any backend logic: Deepgram, `lib/evaluate.ts`, Supabase schema/queries beyond what S1 already
  calls, rate limiting, deletion, account claim.
- Mobile viewport screens (the wireframe project has them; this spec is desktop only per
  Deshan's scoping decision).
- Promoting any screen to a real production route. That happens step by step as S3 through S6
  actually unpark.
- The denial-screen worked example content (parked in `context/tasks.md`).
- Any change to `lib/evaluate.ts`, the rubric, or scheduling.

## Implementation notes

- New shared design tokens (colour, type, spacing) go in one place consumed by all screens,
  matching `docs/07-design-system.md` section 2 and 3, avoiding 16 screens each hand rolling the
  same palette.
- Not-yet-shipped screens live under `app/screens/<name>/page.tsx` (a preview-only route group,
  not linked from any real navigation), so they render and are reviewable without being on the
  path a real user can reach. `app/dev/verify-recording` already establishes the precedent of a
  dev-only route in this repo.
- S1 components (`PermissionScreen`, `BrowserGate`, `RecordingUI`, `Waveform`) get their markup
  and styling updated in place; their existing routes (`/record`, `/validate/a`, `/validate/b`)
  keep working exactly as before, just restyled.
- The 05 Mic check screen's live equivalent is `ValidationFlow`'s `micCheck` step. Restyle that
  inline block rather than inventing a second mic-check component.
- Recording waveform animation (retellWave/retellSweep keyframes in the wireframe) is decorative
  CSS; `Waveform.tsx` already drives a live waveform from the real stream, so only its visual
  styling changes, not its data source.
- Reference `docs/07-design-system.md` for exact tokens rather than restating them here.

## Test plan

- No unit tests: this is presentational markup with no computed logic (per
  `context/coding-standards.md`, "do not test pages or layout").
- `pnpm lint`, `pnpm typecheck`, `pnpm build` must pass.
- Every screen checked in Chrome at 1280x800 by Deshan before completion, per definition of done.
- No calibration impact: the rubric, scheduler, and grading are untouched.

## Docs impacted

`docs/07-design-system.md`, in two places, both decided live with Deshan mid-implementation
rather than planned up front:

- Section 5.1: the waveform spec changed from scrolling bars to a continuous wave, matching what
  `Waveform.tsx` already draws, dropping the rewrite this plan originally called for down to a
  styling pass.
- Section 3.2: added a third exception to "never the resting Delete button" for the account-level
  "Delete everything" control, since it is the one irreversible whole-account action in the
  product. Its confirm step is a separate popup (`DeleteModal`), never inline, keeping the
  original rule's intent for every other delete control.

No FR, ADR, schema, or delivery-plan change.
