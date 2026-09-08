-- ============================================================
-- Cyb Robotics — Storage buckets & policies
-- Run AFTER 0001_initial_schema.sql
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('avatars',         'avatars',         true),
  ('event-media',     'event-media',     true),
  ('project-media',   'project-media',   true),
  ('project-code',    'project-code',    true),
  ('directory-files', 'directory-files', true)
on conflict (id) do nothing;

-- Public read on every bucket above (they are marked public, this makes it explicit).
create policy storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('avatars','event-media','project-media','project-code','directory-files'));

-- Only signed-in admins may upload / overwrite / delete.
create policy storage_admin_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars','event-media','project-media','project-code','directory-files')
    and public.is_admin()
  );

create policy storage_admin_update on storage.objects
  for update to authenticated
  using (
    bucket_id in ('avatars','event-media','project-media','project-code','directory-files')
    and public.is_admin()
  )
  with check (
    bucket_id in ('avatars','event-media','project-media','project-code','directory-files')
    and public.is_admin()
  );

create policy storage_admin_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('avatars','event-media','project-media','project-code','directory-files')
    and public.is_admin()
  );
