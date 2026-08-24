# Screens

Every screen in the product, what exists today, and what is deliberately not built yet.

**Read the Status column before concluding a screen is broken.** Most of them are `Static` on
purpose: the visual layer was built ahead of the behaviour so the design could be reviewed as a
whole, and each one gets wired up in the delivery step that owns it
(docs/03-delivery-plan.md section 3). A screen with placeholder bars where a transcript belongs
is finished for what it is, not half-done.

## Status meanings

| Status | Means |
| --- | --- |
| `Live` | Real behaviour, wired to real data or devices |
| `Static` | Visual layer only, preview route, no behaviour. Waiting on its delivery step |
| `Partial` | Real behaviour, but something specific is knowingly missing. Listed in Gaps |
| `Missing` | Does not exist |

## The screens

| # | Screen | Route | Status | Ships in | Gap |
| --- | --- | --- | --- | --- | --- |
| 01 | Landing | `/` | Live | S5, shipped early | none |
| 02 | Browser gate | any route, non-Chrome | Live | S1 | In-app browser detection deferred (FR-35, ADR-012) |
| 03 | Permission explainer | `/record` | Live | S1 | none |
| 04 | Permission denied | `/record` after denial, preview at `/screens/permission-denied` | Partial | S1 | Worked example is a placeholder block. Founder-authored copy pending, tracked in tasks.md |
| 05 | Mic check | `/validate/a` | Live | S5 | Only reachable through the validation arm, not a real onboarding flow |
| 06 | Setting picker | `/screens/setting-picker` | Static | S5 | Tiles do not advance. No selection state |
| 07 | Question ready | `/screens/question-ready` | Static | S6 | Question is hardcoded. Skip does nothing |
| 08 | Recording | `/record` | Live | S1 | none |
| 09 | Processing | `/record` while uploading, preview at `/screens/processing` | Live | S1 | Waits on upload only. Nothing is transcribed or evaluated yet (S2, S3) |
| 10 | Recovery | `/screens/recovery` | Static | S6 | Not triggered by anything. The under-15-second rule is S6 (FR-10) |
| 11 | Feedback | `/screens/feedback` | Static | S3 | Transcript, gap and chips are placeholders |
| 11b | Feedback, no result | `/screens/feedback/no-result` | Static | S3 | Same as 11 |
| 12 | Signup | `/screens/signup` | Static | S4 | Input is disabled. No submit, no account creation |
| 13 | Session end after skips | `/screens/session-end` | Static | S6 | Skip counting is S6 (FR-11) |
| 14 | Session complete | `/screens/session-complete` | Static | S6 | Story count is hardcoded |
| 15 | Stories list | `/screens/stories` | Static | S4 | Stories are placeholders. No real story data exists yet |
| 15b | Stories list, empty | `/screens/stories/empty` | Static | S4 | Same as 15 |
| 16 | Recordings and privacy | `/screens/recordings-privacy` | Static | S6 | Download and delete do nothing. Deletion is FR-38 |
| 17 | Privacy | `/privacy` | Partial | undecided | Plain-language placeholder. Needs named processors, a contact route and formal terms before real users |

Preview routes live under `/screens`, indexed at `/screens` itself, and are deliberately not
linked from anything a real user reaches.

Two dev-only routes exist alongside them: `/dev/verify-recording` and `/dev/contrast-check`.
Neither is product surface.

## Both open questions are now closed

**FR-22 was amended, not restored.** It required duration and pace as a third block on the
feedback screen. That block was removed during design review, and rather than put it back the
requirement changed: ADR-016 records why, and docs/01, 02, 04 and 07 were updated in the same
change. Duration and pace are still computed and stored under FR-17, which is untouched.

**Screen 17 now exists** at `/privacy`, as a plain-language placeholder built only from what
docs/06 already commits to. It states that it is not a finished legal document rather than
pretending otherwise, and lists what is still missing.

## Keeping this honest

Update the row in the same change that alters a screen's status. A stale inventory is worse
than none, because it is the document someone reads instead of opening the app.
