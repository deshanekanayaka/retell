-- `attempt` gains a single summary of Deepgram's per-word transcription
-- confidence. Collected from Phase 1 onward with no threshold applied yet,
-- since the real distribution across real answers is unknown (FR-17, FR-42).
-- See context/docs-review-decisions.md decisions 17 to 19.

alter table attempt add column confidence real;
