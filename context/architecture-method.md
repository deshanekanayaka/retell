# How we work through an architecture

A reusable method, built from walking through docs/02's answer pipeline on 2026-08-29. Use this
whenever a system needs to be designed or reviewed from scratch, instead of reading a finished
diagram and hoping it clicks.

## The four passes, in order

Never skip ahead to arrows before every box is isolated. A diagram with the wrong boxes is wrong
no matter how well it's drawn.

### 1. List the components

Name every place something happens or something is stored. One line each, no arrows yet.

For each candidate, ask: is this its own thing, or does it belong folded into a component
already on the list? Two components should merge only if they do the same *kind* of job. Two
things that call different external services, or that hold different kinds of state, stay
separate even if the same vendor happens to provide both (auth and database can be the same
vendor and still be two boxes).

### 2. Isolate each one

For every component, state three things:

- **In.** What it receives, and from where.
- **Out.** What it returns.
- **Must never.** The specific thing this component is not allowed to do, usually because that
  job belongs to a different box.

A component isn't understood until this is written down. If the "must never" line is vague or
missing, the boundary hasn't been found yet.

### 3. Connect them, one arrow at a time

Draw the first arrow only once every box has a boundary. Add one arrow, say out loud why it
starts where it starts, then add the next. Don't jump to the finished diagram, the order the
arrows get added in is usually the order a real request actually flows, and skipping to the end
hides steps that don't fit.

### 4. Check the arrows against the boundaries from step 2

Every "must never" from step 2 should be visible as an arrow, or as the *absence* of one, in the
final diagram. If a rule from step 2 has no corresponding arrow, either the rule was never
enforced, or the diagram is missing a step.

## Questions worth asking about any component

- What does this receive, and could that input be forged or tampered with before it arrives?
- Does this component hold state between requests, or is it stateless? If it holds state, is
  that its actual job, or did state creep in because two responsibilities got merged into one
  box?
- If this component's answer is wrong or malicious, what is the next component's line of
  defence? ("Defence in depth": two components independently refusing the same bad input is
  stronger than one check that everything else trusts blindly.)
- Is this box named after a vendor (Deepgram, Claude, Supabase) or after a job (transcription
  service, judgement service, store)? Name it after the job. Vendors get swapped, jobs don't.

## Signs a diagram needs redoing, not patching

- A box does two unrelated things (it decides *and* it stores; it calls an external API *and* it
  remembers things between calls).
- An arrow carries more than the receiving component's stated job needs. If the judgement
  service's job is "score a transcript against a question," it should never receive duration,
  filler count, or anything else, even if that data is lying around and easy to pass in.
- A rule that matters ("never trust a client-supplied id") exists only as a sentence in a
  document, with no arrow or check anywhere in the diagram enforcing it.

## What this method is for

Not every change needs this. Reach for it when:

- A whole subsystem is being designed from nothing.
- An existing diagram is being reviewed and something about it feels wrong but hard to name.
- Two components are tangled and it's unclear where the seam between them should go.

A small, obvious change (add one column, fix one arrow) doesn't need all four passes, just fix
it.
