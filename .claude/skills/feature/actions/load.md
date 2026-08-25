# Load Action

Step 3 of the feature workflow.

1. Resolve $ARGUMENTS:
   - A filename or feature slug: read `context/features/{name}-spec.md`. Error if it does not
     exist — run `/feature spec` first.
   - Empty: error, "load requires a spec name — run /feature spec first if there isn't one yet."
2. Update `context/current-feature.md`:
   - `# Current Feature: <name from spec Overview>`
   - `## Status` → `Not Started`
   - `## Goals` → the spec's Requirements, as bullet points
   - `## Implementation plan` → leave empty, filled by `/feature plan`
   - `## Notes` → the spec's Out of scope and Implementation notes, condensed
3. Confirm what was loaded and name the next step: `/feature plan`.
