# ADR-017: Transcript rails are located, never quoted

- **Status**: Accepted
- **Date**: 2026-08-26

## Context

FR-22 and 04-voice-and-evaluation.md section 4.1 require the feedback screen to mark the
situation, action and result inside the user's own transcript. Only a model can judge which part
is which, but the schema in section 3.3 had no field carrying that judgement, so the requirement
was unimplementable as written.

The obvious fix is to add `situation`, `action` and `result` as string fields and render what
comes back. A model given a free text field tidies: it repairs a false start, drops a stumble,
smooths a broken clause into a readable sentence. Every one of those is helpful behaviour that
produces a sentence the speaker did not say, displayed beside their real transcript as though
they had said it, on the screen section 4.2 identifies as the most dangerous place to put words
in front of someone.

## Decision

**The model returns positions, never text.** The prompt supplies the transcript pre-split into
numbered sentences; the model replies with `{ start, end }` sentence ranges, or null. Application
code resolves those to word index ranges and stores them. The screen slices the stored transcript
by those positions.

A range is one contiguous run, matching section 4.1's "one rail per part". The three ranges may
not overlap. A range that is out of bounds, inverted, or overlapping one already claimed is
dropped, and the part renders with no rail and no label, which section 4.1 already defines as the
correct silent outcome for an absent part.

## Alternatives rejected

- **Free text per part**: the failure above. An invented sentence reaches the user as their own
  words, which is ADR-009 in a new place.
- **Word index ranges direct from the model**: safe, since an integer cannot smuggle in a word,
  but models count badly and rails would land wrong or go missing often.
- **Verbatim quotes matched back against the transcript**: safe, because the quote is discarded
  after locating the span, but strictly worse than numbering. A quote that drifts by one word
  fails to match and silently costs the user a rail they earned.
- **Ship without rails**: rejected. Section 4.1 spends real space on the treatment and it is
  load-bearing on the one screen the design is most protective of.

## Consequences

- 04-voice-and-evaluation.md section 3.3's schema gains three nullable sentence-range fields.
  `angles` tightens from `string[]` to the nine slugs of 05-spaced-repetition.md section 1.1,
  since an invented slug is a label nothing downstream can point at.
- Deepgram must run with `punctuate=true`. Without sentence boundaries there is nothing to
  number. Verified not to move `filler_count`, which is a contract under section 2.
- Rails are sentence granular. Where one sentence carries two parts, only one can claim it, and
  the other is either dropped or the sentence is absorbed into a neighbouring range. Observed on
  real answers that open by stating their outcome. Accepted as the cost of one rail per part.
- Improving the sentence splitter later cannot retroactively move old rails, because sentence
  numbers are a prompt-time convenience and only resolved word positions are stored.
- The evaluation cannot be invalidated by a bad range. Parts drop individually.

## References

01-PRD.md FR-22, FR-24. 04-voice-and-evaluation.md sections 2, 3.3, 4.1, 4.2.
05-spaced-repetition.md section 1.1. 06-data-and-privacy.md section 2. ADR-009.
context/features/s3-evaluate-and-feedback-spec.md.
