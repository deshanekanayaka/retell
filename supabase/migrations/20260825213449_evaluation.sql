-- S3: one model's judgement of one attempt, kept apart from the facts on
-- `attempt` so an answer can be re-scored without re-recording (FR-21).
-- See context/features/s3-evaluate-and-feedback-spec.md.
--
-- `attempt` also gains the question that was asked. `relevance` scores whether
-- the answer addressed the question, which is unanswerable without storing it,
-- and docs/04 section 4 requires the question on the feedback screen for a user
-- returning later. `question_id` waits for the `question` table, the same way
-- S2 deferred its other foreign keys.

alter table attempt add column question_text text;

create table evaluation (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempt (id) on delete cascade,

  -- FR-20. Every judgement carries what produced it, so scores from different
  -- models or rubric versions are never silently compared.
  model text not null,
  rubric_version integer not null,

  relevance smallint not null check (relevance between 0 and 3),
  structure smallint not null check (structure between 0 and 3),
  specificity smallint not null check (specificity between 0 and 3),

  gap text not null,

  -- The nine angle slugs of docs/05 section 1.1, enforced here as well as in
  -- the response schema. Adding a slug is fine, renaming one invalidates every
  -- item pointing at it and needs an ADR.
  angles text[] not null default '{}' check (
    angles <@ array[
      'conflict', 'failure', 'initiative', 'teamwork', 'leadership',
      'pressure', 'ambiguity', 'persuasion', 'learning'
    ]::text[]
  ),

  -- Where each part sits in the attempt's word_timings array, inclusive.
  -- Positions, never text: the model locates the user's words and never
  -- supplies any of its own (ADR-009, docs/04 section 4.1). A part the answer
  -- does not contain, or one the model described unusably, is null and draws
  -- no rail.
  situation_start_word integer,
  situation_end_word integer,
  action_start_word integer,
  action_end_word integer,
  result_start_word integer,
  result_end_word integer,

  constraint situation_range_complete check (
    (situation_start_word is null) = (situation_end_word is null)
  ),
  constraint action_range_complete check (
    (action_start_word is null) = (action_end_word is null)
  ),
  constraint result_range_complete check (
    (result_start_word is null) = (result_end_word is null)
  ),

  -- Phase 2. Derived in application code, never returned by the model (FR-27,
  -- ADR-007). Created now so Phase 2 does not need a second migration here.
  grade text check (grade in ('again', 'hard', 'good', 'easy')),

  created_at timestamptz not null default now()
);

create index evaluation_attempt_id_idx on evaluation (attempt_id);

alter table evaluation enable row level security;

-- Scoped through the attempt, which is where ownership lives. `evaluation` has
-- no session column of its own: duplicating it would let the two disagree.
create policy "own evaluations" on evaluation
  for all
  using (
    exists (
      select 1
      from attempt
      where attempt.id = evaluation.attempt_id
        and attempt.anonymous_session_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from attempt
      where attempt.id = evaluation.attempt_id
        and attempt.anonymous_session_id = auth.uid()
    )
  );
