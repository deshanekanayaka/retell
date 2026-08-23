# Spec Action

Step 2 of the feature workflow. Produces `context/features/<name>-spec.md`.

1. Read the relevant sections of `docs/` for what is being built (start at `docs/00-README.md`
   if unsure which document owns this area).
2. Check for an existing spec at `context/features/<name>-spec.md`. If one exists, update it
   rather than starting over.
3. Fill in every section of `context/features/_TEMPLATE-spec.md`:
   - Overview, citing the FR number(s) from `docs/01-PRD.md` it implements
   - Requirements as testable MUST lines
   - Out of scope
   - Implementation notes, referencing `docs/` rather than restating it
   - Test plan, including calibration impact if the rubric or scheduler is touched
   - Docs impacted — name the files, or "none"
4. **If anything here would contradict `docs/`**, stop immediately and say so plainly: which
   document, which line, what the conflict is. Do not resolve it yourself. That is Deshan's call
   and may need an ADR in `docs/decisions/`.
5. If the spec touches the rubric, scheduling, anything shown to a user as a claim about their
   ability, privacy handling of recordings, or pricing — mark it clearly as a proposal. Draft and
   argue for it, never write it as decided.
6. Save the file at `context/features/<name>-spec.md` and confirm what was written.

Do not touch `context/current-feature.md` in this action — that happens in `load`.
