# ADR-012: Desktop Chrome first, real-phone testing deferred

- **Status**: Accepted
- **Date**: 2026-08-23

## Context

docs/03-delivery-plan.md section 7 (definition of done) requires anything touching audio or
layout to be verified in Chrome on a real phone, not only the desktop simulator. S1 introduces
the first browser audio capture and upload work. Deshan's near term focus is proving the
product works at all, on desktop Chrome, before spending time on mobile-specific verification.

## Decision

Through S1 (and until revisited), "done" for audio and layout work means verified in Chrome on
desktop only. Real-phone verification is not required to close out a step. This does not
change ADR-004 (Chrome/Chromium only); it narrows testing scope further, to desktop within
that.

## Alternatives rejected

- **Keep the real-phone gate, slow S1 down**: correct long term, since MediaRecorder and
  permission behaviour genuinely differ on mobile Chrome. Rejected for now because it blocks
  learning whether the core loop works at all, which is the more urgent question.

## Consequences

- Mobile-specific bugs (permission prompt behaviour, MediaRecorder quirks, layout on small
  screens) are not caught until phone testing resumes. Whatever ships through S1 under this
  ADR should be assumed unverified on mobile.
- The two-arm validation page's recruitment plan (docs/03 section 4) targets students who will
  open the link on phones. That test cannot run credibly until this ADR is revisited and phone
  testing resumes.
- FR-35 (in-app browser detection) is deferred for the same underlying reason, tracked
  separately in `context/tasks.md`.

## Revisit trigger

Before recruiting testers for the two-arm validation page or any real user, since that
recruitment plan assumes phone use. At the latest, before S7.

**Superseded (2026-08-29):** the validation track and S7 are cut (03-delivery-plan.md section 4,
context/docs-review-decisions.md decision 52). The trigger is now deployment to friends
(context/docs-review-decisions.md decision 59), which is when real-phone testing resumes
(03-delivery-plan.md section 7, point 3).

## References

docs/03-delivery-plan.md section 7 (definition of done), section 4 (validation track). ADR-004.
