-- S1: raw audio recordings, keyed to a Supabase anonymous auth session.
-- Superseded by `attempt` in S2 once transcription needs question/item foreign keys.
-- See context/features/s1-record-and-upload-spec.md.

create table recording (
  id uuid primary key default gen_random_uuid(),
  anonymous_session_id uuid not null references auth.users (id) on delete cascade,
  recording_type text not null check (
    recording_type in ('answer', 'mic_check', 'validation_a', 'validation_b')
  ),
  audio_url text not null,
  created_at timestamptz not null default now()
);

create index recording_anonymous_session_id_idx on recording (anonymous_session_id);

alter table recording enable row level security;

create policy "own recordings" on recording
  for all
  using (auth.uid() = anonymous_session_id)
  with check (auth.uid() = anonymous_session_id);
