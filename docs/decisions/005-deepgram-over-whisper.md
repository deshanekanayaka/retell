# ADR-005: Deepgram over Whisper, for filler words

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Retell measures delivery, and filler rate is one of the few objectively measurable delivery
signals in a transcript. Whisper, in every hosted and self hosted form, is trained to produce
clean readable text and silently removes "um", "uh" and false starts. This is not a setting.
An OpenAI key was already available, which favoured Whisper on convenience.

## Decision

Transcription uses Deepgram's pre-recorded endpoint with filler words and word level timestamps
enabled.

## Alternatives rejected

- **OpenAI Whisper or its successors**: removes the disfluencies the product exists to measure.
- **Browser Web Speech API**: free, but no filler words and unreliable outside Chrome.
- **Self hosted Whisper**: fixed cost, but the same disfluency problem plus operations work.

## Consequences

- Filler count, pace and longest pause are all computed from the transcription output rather
  than inferred by a model.
- A second vendor relationship and a second key.
- Metered pricing rather than a fixed fee. Bounded by the caps in ADR-006 and
  02-system-architecture.md section 3.5.
- Raw audio retention means any provider decision can be reversed by re-transcribing history.

## References

01-PRD.md FR-16, FR-17. 04-voice-and-evaluation.md section 2.
