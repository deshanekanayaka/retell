-- S2: facts about a transcribed answer. `recording` narrows from here on to
-- the three types that are never transcribed (mic_check, validation_a,
-- validation_b); answer audio now lives on this table instead.
-- user_id, session_id, item_id, question_id are deferred to the specs that
-- add those tables. See context/features/s2-transcribe-and-signals-spec.md.

create table attempt (
  id uuid primary key default gen_random_uuid(),
  anonymous_session_id uuid not null references auth.users (id) on delete cascade,
  audio_url text not null,
  duration_ms integer,
  transcript text,
  word_timings jsonb,
  filler_count integer,
  words_per_minute integer,
  longest_pause_ms integer,
  created_at timestamptz not null default now()
);

create index attempt_anonymous_session_id_idx on attempt (anonymous_session_id);

alter table attempt enable row level security;

create policy "own attempts" on attempt
  for all
  using (auth.uid() = anonymous_session_id)
  with check (auth.uid() = anonymous_session_id);
