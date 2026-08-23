# ADR-001: Record and upload, not a live voice agent

- **Status**: Proposed
- **Date**: 2026-08-22

## Context

Retell needs the user to speak an answer and receive feedback. The obvious approach in 2026 is a
hosted voice agent (Vapi and similar), which handles microphone capture, transcription, an AI
interviewer speaking back, and turn taking in one service. Retell is free to students and used
daily, so per session cost is a hard constraint. The product is also a drill, not a conversation.

## Decision

Answers are recorded in the browser with MediaRecorder, uploaded as a file, transcribed, and
scored. No real time voice agent is used.

## Alternatives rejected

- **Hosted voice agent (Vapi)**: roughly ten times the cost, bills per minute for transcription,
  model and synthesised speech together.
- **Streaming transcription during the answer**: added complexity and failure modes on flaky
  mobile networks, for a few seconds of latency saved.

## Consequences

- Cost per session drops by roughly an order of magnitude.
- The raw audio stays in Retell's own storage, which is a precondition for ADR-011 and for any
  future re-scoring.
- No AI voice reads the question aloud. Questions are text on screen. Spoken questions can be
  added later with text to speech, which is cheap because it is one sentence rather than a
  conversation.
- Feedback arrives after the answer, not during it. This matches the drill format.

## References

01-PRD.md FR-14, FR-15, FR-18. 02-system-architecture.md section 3.2.
