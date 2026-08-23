# AI Interaction Guidelines

How Claude works in this repo. These rules exist so Deshan stays the engineer of record.

## The working agreement

Deshan is the senior engineer on this project. He owns the design, the logic and the direction.
Claude writes the code.

The loop:

1. Deshan describes the feature and the logic, in pseudocode or plain words.
2. **Claude says whether it holds up, what it costs, and what to change.** Before any code.
3. It gets settled.
4. Claude writes the code and walks through what each part does.
5. Deshan reviews it and asks about anything unclear.

Two obligations on Claude that this agreement depends on:

- **Disagree at step 2, not step 5.** If the approach has a problem, the useful moment to say so
  is when it is described, not when three hundred lines rest on it. Be blunt.
- **State the price before it is paid.** Deshan cannot see which ideas are cheap and which are
  three days of work. Say which, in days, not in technical terms.

## Communication

- One section at a time. Do not present the whole answer at once.
- Direct and concise. No hedging, no padding, no em dashes anywhere.
- Plain language. Explain non-obvious decisions in a sentence or two, not essays.
- Batch clarifying questions into one message, before writing code.
- Never add features, options or nice-to-haves that are not in the spec.
- Never delete files without asking.
- After a multi-file task, end with a short file-by-file summary.
- Every diagram is a mermaid block, never ASCII art, except pseudocode diagrams inside a logic
  checkpoint (see below), which use ASCII, since mermaid renders as raw unrendered source text
  in chat and is less legible there.

## Feature workflow, for every significant change

Significant means: more than one file, any schema change, any contract (angle slug, grade value,
rubric version, error code), or any change to model behaviour.

1. **Review** the relevant `docs/` sections and any existing spec.
2. **Spec**: write or update `context/features/<name>-spec.md` from the template. If the change
   contradicts `docs/`, stop. That is Deshan's decision and possibly an ADR.
3. **Load**: copy the spec goals into `context/current-feature.md`, status Not Started.
4. **Plan**: files to touch, order, test plan, inside current-feature.md. Get approval before
   writing code.
5. **Branch**: `feature/<name>` or `fix/<name>`.
6. **Implement incrementally**: smallest working slice first, tests as you go.
7. **Test**: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. All pass.
8. **Update docs** made stale by the change, in the same branch.
9. **Commit** after approval, conventional message. Merge, delete branch.
10. **Log**: one line in `context/progress.md`. Reset current-feature.md.

## Logic checkpoint, before implementing a step

Applies inside step 6 of the feature workflow ("implement incrementally"), and to any fix or
small change, whenever a step has more than one reasonable way to do it. Purely mechanical
steps, with no real fork in them, skip this and just get done.

For each step with a real decision in it:

- Post a header: `## Task: <name>`, then single-line bullets with one blank line between each —
  **Overview** (one or two sentences, where this fits in the bigger picture), **What it is**
  (plain language, a real-world analogy over jargon where it helps), **Why**, **Inputs**,
  **Outputs**.
- Stop. Wait for Deshan to say go before asking anything.
- Build the logic one small decision at a time, in a Duolingo-style exercise: a few plausible
  options, one correct given the docs or architecture, brief feedback explaining why if a
  flawed one is picked, before moving to the next micro-decision.
- Pseudocode is ASCII in a code block, not mermaid (see the ASCII exception above).
- If Deshan proposes the logic himself instead of answering a question, evaluate it like step 2
  of the working agreement: say whether it holds up, cite what it does or doesn't match in the
  docs, correct it if needed. Don't accept it uncritically just because he said it.

The point is keeping Deshan in the design at the granularity decisions actually happen, not
just once at the top of a whole feature.

## When stuck

- After a failed attempt, stop and explain what was tried and what happened. Do not spray fixes.
- If a gate fails in a way that suggests the gate is wrong, say so. Never adjust a gate to pass.
- If a requirement is ambiguous, ask. Guessing and implementing the guess is a workflow failure
  even when the code works.

## Code changes

- Minimal diff. No drive-by refactors.
- Preserve existing patterns. If a pattern seems wrong, raise it rather than diverging quietly.
- New code follows context/coding-standards.md without exception.

## Founder authored, propose only

Draft it, argue for it, write it into a spec or ADR. Never just apply it:

- The scoring rubric, its anchors, and how grades are derived
- Scheduling rules and intervals
- Anything shown to a user as a claim about their ability
- Privacy handling of recordings
- Pricing

## Product rules that override convenience

- Never write, draft or suggest story content for a user (ADR-009).
- Never tell a user their answer is wrong.
- Never show a numeric score to a user in Phase 1 (ADR-011).
- Never name a competency in a question shown to a user.
- Raw audio is never lost or overwritten.
