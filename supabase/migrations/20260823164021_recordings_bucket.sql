-- S1: private storage bucket for raw audio. Objects are keyed
-- `{anonymous_session_id}/{recording_id}.webm`, so RLS can scope access by the
-- first path segment the same way the `recording` table scopes by column.
-- See context/features/s1-record-and-upload-spec.md.

insert into storage.buckets (id, name, public)
values ('recordings', 'recordings', false)
on conflict (id) do nothing;

create policy "own recording objects" on storage.objects
  for all
  using (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
