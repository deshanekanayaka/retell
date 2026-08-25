# Plan Action

Step 4 of the feature workflow. This is the step where ambiguity gets resolved, not during
implementation.

1. Read `context/current-feature.md` Goals and Notes.
2. If anything is ambiguous, batch every clarifying question into one message and ask before
   writing the plan. Guessing and implementing the guess is a workflow failure even if the code
   happens to work.
3. Write into `## Implementation plan` in current-feature.md:
   - Files to touch, in the order they will be touched
   - The smallest working slice to implement first
   - The test plan (unit cases; note if a migration or RLS policy is needed)
4. **This is a gate: show the plan and end the turn here.** Do not proceed to `start` in the
   same turn or assume approval — this is the working agreement's step 2 obligation, the
   disagreements-and-gaps surface here, not after code is written.
