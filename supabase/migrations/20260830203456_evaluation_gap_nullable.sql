-- A vague answer is exactly the input most likely to make the model ask two
-- things at once in `gap`, which lib/gap.ts's code-level check correctly
-- rejects. Previously that failure discarded the whole evaluation, losing
-- valid scores and rails over one bad field. Now the gap gets its own retry
-- in lib/evaluate.ts, and a second failure stores everything else with
-- `gap` null rather than throwing the evaluation away.

alter table evaluation alter column gap drop not null;
