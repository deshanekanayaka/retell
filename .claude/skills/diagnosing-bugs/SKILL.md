---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
---

# Diagnosing Bugs

A discipline for hard bugs. Skip phases only when explicitly justified.

Redact every secret before showing a command or output: `<REDACTED>` in its place. Retell's
secrets live in `SUPABASE_SERVICE_ROLE_KEY`, the Deepgram key, and the model provider key
(`lib/evaluate.ts` is the only file that should ever touch the latter) — build loops against
env vars so the credential stays in the environment, never pasted into a log or shown verbatim.
A captured request carries auth headers: quote only the lines that carry the signal.

## Phase 1: Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail signal
for the bug (one that goes red on _this_ bug), you will find the cause; bisection,
hypothesis-testing, and instrumentation all just consume it. If you don't have one, no amount of
staring at code will save you. Spend disproportionate effort here. Be aggressive, be creative,
refuse to give up.

### Ways to construct one, in roughly this order

1. **Failing test** at whatever seam reaches the bug (Vitest, per coding-standards.md).
2. **Curl / HTTP script** against a running `pnpm dev` server.
3. **CLI invocation** with a fixture input, diffing output against a known-good snapshot.
4. **Headless browser script** that drives the UI and asserts on DOM/console/network — useful
   for the record → upload → playback path.
5. **Replay a captured trace.** Save a real Deepgram response or model-provider payload to disk,
   replay it through the code path in isolation.
6. **Throwaway harness.** A minimal subset of the system exercising the bug's code path directly.
7. **Property / fuzz loop.** For "sometimes wrong output" bugs — random inputs, look for the
   failure mode.
8. **Bisection harness.** If the bug appeared between two known states, automate boot-check-repeat
   so it can run under `git bisect run`.
9. **Differential loop.** Same input through old vs. new code, or two configs, diff the outputs.
10. **HITL bash script.** Last resort, when a human must click through something.

### Tighten the loop

Once you have _a_ loop, tighten it: faster (skip unrelated init, narrow scope), sharper (assert
the specific symptom, not "didn't crash"), more deterministic (pin time, seed RNG, isolate
filesystem and network).

### Non-deterministic bugs

Aim for a higher reproduction rate, not a clean repro. Loop the trigger, parallelise, add stress,
narrow timing windows. A 50%-flake bug is debuggable; 1% is not — raise the rate until it is.

### When you genuinely cannot build a loop

Stop and say so. List what you tried. Ask for: access to the reproducing environment, a redacted
captured artifact, or permission to add temporary instrumentation. Do not proceed to hypothesise
without a loop.

### Completion criterion: a tight loop that goes red

Name one command, already run at least once (show the invocation and redacted output), that is:

- [ ] **Red-capable**: drives the real code path and asserts the user's exact symptom
- [ ] **Deterministic**: same verdict every run
- [ ] **Fast**: seconds, not minutes
- [ ] **Agent-runnable**: unattended

No red-capable command, no Phase 2 — jumping to a hypothesis first is the failure this skill
prevents.

## Phase 2: Reproduce + minimise

Run the loop, watch it go red. Confirm the failure matches what the user described, and that it
reproduces reliably (or at a debuggable rate).

Minimise: shrink to the smallest scenario that still goes red, cutting one thing at a time and
re-running after each cut. Done when every remaining element is load-bearing.

## Phase 3: Hypothesise

Generate 3-5 ranked, falsifiable hypotheses before testing any of them — each stated as "if X is
the cause, then changing Y makes the bug disappear." Show the ranked list before testing; the
user's domain knowledge often re-ranks it instantly.

## Phase 4: Instrument

One probe per prediction, one variable at a time. Debugger/REPL beats logs; targeted logs beat
"log everything and grep." Tag every debug log with a unique prefix (e.g. `[DEBUG-a4f2]`) so
cleanup is one grep. For performance regressions: measure a baseline first, then bisect — don't
guess from logs.

## Phase 5: Fix + regression test

Write the regression test before the fix, but only at a correct seam — one that exercises the
real bug pattern as it occurs at the call site. If no correct seam exists, that itself is the
finding: note it, the architecture is preventing this bug from being locked down.

If a seam exists: turn the minimised repro into a failing test, watch it fail, apply the fix,
watch it pass, re-run the Phase 1 loop against the original scenario.

## Phase 6: Cleanup

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or the missing seam is documented)
- [ ] All `[DEBUG-...]` instrumentation removed
- [ ] Throwaway prototypes deleted
- [ ] The correct hypothesis is stated in the commit message, so the next debugger learns
