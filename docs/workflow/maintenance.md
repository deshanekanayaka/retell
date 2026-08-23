# Maintenance

Honest state: **stub.** There is nothing running to maintain yet. This lists what will need
care, so it is not discovered late.

## Recurring

- **Dependency updates**: monthly, in their own branch, never mixed with feature work.
- **Spend check**: the whole cost control design (hard caps, per user limits, global kill
  switch) is untested until real traffic exists. Check actual spend against expectation after
  the first cohort test.
- **Provider settings**: confirm that Deepgram and the model provider still default to no
  retention and no training on submitted audio. This underpins the promises in
  `docs/06-data-and-privacy.md` section 1 and is not a one time check.
- **Backups**: Supabase managed. *Restore has never been tested.* Test it before real users.

## Failure playbooks

*Not yet written.* The known failure modes to write playbooks for, once they can happen:

- Transcription provider returns an error or times out. Attempt exists, evaluation does not. The
  user needs a truthful message and their audio must not be lost.
- Model provider returns an error or a schema violation. Same shape: facts kept, judgement
  missing, retry possible later.
- Spend cap reached mid session. The user must be told plainly rather than seeing a broken page.
- Audio upload fails after recording. The recording must survive in the browser long enough to
  retry.

The pattern under all four: **the raw audio is never the thing that gets lost.** Everything else
can be recomputed from it.
