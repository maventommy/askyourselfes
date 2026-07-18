-- Ask Yourselves: aged-portrait storage (paste in Supabase SQL editor, project yezxoevoexpokdzhkabe)

alter table public.profiles add column if not exists portrait_url text;

insert into storage.buckets (id, name, public)
values ('portraits', 'portraits', true)
on conflict (id) do nothing;

-- Public read is acceptable: object paths are <uuid>/aged.png (unguessable), no list policy exists.
create policy "portraits_read" on storage.objects
  for select using (bucket_id = 'portraits');

create policy "portraits_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portraits' and (storage.foldername(name))[1] = auth.uid()::text);
