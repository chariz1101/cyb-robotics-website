-- ============================================================
-- Cyb Robotics Organization Website — FULL DATABASE SETUP
-- ============================================================
-- HOW TO USE: copy this ENTIRE file and paste it into the
-- Supabase Dashboard > SQL Editor, then press Run.
--
-- This combines 0001_initial_schema.sql, 0002_storage_buckets.sql
-- and 0003_seed_officer_positions.sql into a single script.
-- Safe to run once on a fresh project.
-- ============================================================

-- ============================================================

-- ------------------------------------------------------------
-- 0. Extensions & helpers
-- ------------------------------------------------------------
create extension if not exists pgcrypto;  -- gen_random_uuid()

-- Keeps updated_at honest on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- 1. admin_users  (mirrors auth.users)
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin'
                check (role in ('admin', 'super_admin')),
  created_at  timestamptz not null default now()
);

-- SECURITY DEFINER so RLS policies can ask "is this caller an admin?"
-- without re-triggering RLS on admin_users (which would infinitely recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ------------------------------------------------------------
-- 2. officer_positions
-- ------------------------------------------------------------
create table if not exists public.officer_positions (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  display_order  int  not null,
  term_year      text,
  unique (title, term_year)
);

create index if not exists officer_positions_order_idx
  on public.officer_positions (term_year, display_order);

-- ------------------------------------------------------------
-- 3. members
-- ------------------------------------------------------------
create table if not exists public.members (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  photo_url             text,
  year_level            text,
  course                text,
  is_officer            boolean not null default false,
  position_id           uuid references public.officer_positions(id) on delete set null,
  position              text,
  bio                   text,
  is_alumnus            boolean not null default false,
  alumnus_batch_year    text,
  alumnus_current_role  text,
  is_published          boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- An officer must have a position; an alumnus is not a sitting officer.
  constraint members_officer_needs_position
    check (not is_officer or position_id is not null or position is not null),
  constraint members_alumnus_not_officer
    check (not (is_alumnus and is_officer))
);

create index if not exists members_officer_idx  on public.members (is_officer) where is_officer;
create index if not exists members_alumnus_idx  on public.members (is_alumnus) where is_alumnus;
create index if not exists members_position_idx on public.members (position_id);

create trigger members_set_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 4. events
-- ------------------------------------------------------------
create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  event_date       date not null,
  status           text not null default 'upcoming'
                     check (status in ('upcoming', 'past', 'cancelled')),
  cover_photo_url  text,
  is_published     boolean not null default true,
  created_by       uuid references public.admin_users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists events_published_date_idx
  on public.events (is_published, event_date desc);
create index if not exists events_created_by_idx on public.events (created_by);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. event_photos
-- ------------------------------------------------------------
create table if not exists public.event_photos (
  id             uuid primary key default gen_random_uuid(),
  event_id       uuid not null references public.events(id) on delete cascade,
  photo_url      text not null,
  caption        text,
  display_order  int  not null default 0
);

create index if not exists event_photos_event_idx
  on public.event_photos (event_id, display_order);

-- ------------------------------------------------------------
-- 6. projects
-- ------------------------------------------------------------
create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text,
  category            text,
  difficulty_level    text check (difficulty_level in ('Beginner', 'Intermediate', 'Advanced')),
  cover_image_url     text,
  is_public_showcase  boolean not null default false,
  is_members_guide    boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists projects_showcase_idx on public.projects (is_public_showcase) where is_public_showcase;
create index if not exists projects_guide_idx    on public.projects (is_members_guide)   where is_members_guide;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. project_steps
-- ------------------------------------------------------------
create table if not exists public.project_steps (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  step_number   int  not null,
  title         text not null,
  instructions  text not null,
  image_url     text,
  unique (project_id, step_number)
);

create index if not exists project_steps_project_idx
  on public.project_steps (project_id, step_number);

-- ------------------------------------------------------------
-- 8. project_files
-- ------------------------------------------------------------
create table if not exists public.project_files (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  file_name   text not null,
  file_type   text,
  file_url    text not null
);

create index if not exists project_files_project_idx on public.project_files (project_id);

-- ------------------------------------------------------------
-- 9. announcements
-- ------------------------------------------------------------
create table if not exists public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  audience      text not null default 'public'
                  check (audience in ('public', 'members', 'both')),
  is_published  boolean not null default false,
  created_by    uuid references public.admin_users(id) on delete set null,
  publish_date  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists announcements_published_idx
  on public.announcements (is_published, publish_date desc);
create index if not exists announcements_created_by_idx on public.announcements (created_by);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 10. files  (members directory: letters, programmes, branding, docs)
-- ------------------------------------------------------------
create table if not exists public.files (
  id                uuid primary key default gen_random_uuid(),
  file_name         text not null,
  category          text not null
                      check (category in ('letter', 'programme', 'branding', 'documentation', 'other')),
  related_event_id  uuid references public.events(id) on delete set null,
  file_url          text not null,
  file_type         text,
  file_size_kb      int check (file_size_kb is null or file_size_kb >= 0),
  uploaded_by       uuid references public.admin_users(id) on delete set null,
  created_at        timestamptz not null default now()
);

create index if not exists files_category_idx    on public.files (category);
create index if not exists files_event_idx       on public.files (related_event_id);
create index if not exists files_uploaded_by_idx on public.files (uploaded_by);

-- ============================================================
-- 11. Row Level Security
-- ============================================================
alter table public.admin_users       enable row level security;
alter table public.officer_positions enable row level security;
alter table public.members           enable row level security;
alter table public.events            enable row level security;
alter table public.event_photos      enable row level security;
alter table public.projects          enable row level security;
alter table public.project_steps     enable row level security;
alter table public.project_files     enable row level security;
alter table public.announcements     enable row level security;
alter table public.files             enable row level security;

-- --- admin_users: a signed-in admin sees only their own row. No app-side writes.
create policy admin_users_select_self on public.admin_users
  for select to authenticated
  using (id = auth.uid());

-- --- officer_positions
create policy officer_positions_public_read on public.officer_positions
  for select to anon, authenticated using (true);
create policy officer_positions_admin_all on public.officer_positions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- members
create policy members_public_read on public.members
  for select to anon, authenticated using (is_published);
create policy members_admin_all on public.members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- events
create policy events_public_read on public.events
  for select to anon, authenticated using (is_published);
create policy events_admin_all on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- event_photos (visible only if the parent event is published)
create policy event_photos_public_read on public.event_photos
  for select to anon, authenticated
  using (exists (select 1 from public.events e
                 where e.id = event_photos.event_id and e.is_published));
create policy event_photos_admin_all on public.event_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- projects
create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (is_public_showcase or is_members_guide);
create policy projects_admin_all on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- project_steps / project_files
-- Readable by anon: the members page is unlisted, not auth-gated, so the URL is
-- the gate. RLS still blocks all anonymous writes.
create policy project_steps_public_read on public.project_steps
  for select to anon, authenticated using (true);
create policy project_steps_admin_all on public.project_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy project_files_public_read on public.project_files
  for select to anon, authenticated using (true);
create policy project_files_admin_all on public.project_files
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- announcements
create policy announcements_public_read on public.announcements
  for select to anon, authenticated
  using (is_published and (publish_date is null or publish_date <= now()));
create policy announcements_admin_all on public.announcements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --- files (same unlisted-URL reasoning as project_files)
create policy files_public_read on public.files
  for select to anon, authenticated using (true);
create policy files_admin_all on public.files
  for all to authenticated using (public.is_admin()) with check (public.is_admin());



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



insert into public.officer_positions (title, display_order, term_year) values
  ('President',            1, '2026-2027'),
  ('Vice President for Income-Generating Projects', 2, '2026-2027'),
  ('Board Member for Income-Generating Projects', 3, '2026-2027'),
  ('Vice President for Logistics', 4, '2026-2027'),
  ('Board Member for Logistics', 5, '2026-2027'),
  ('Vice President for Programs', 6, '2026-2027'),
  ('Board Member for Programs', 7, '2026-2027'),
  ('Vice President for Public Relations', 8, '2026-2027'),
  ('Board Member for Public Relations', 9, '2026-2027'),
  ('Vice President for Research and Development', 10, '2026-2027'),
  ('Board Member for Research and Development', 11, '2026-2027'),
  ('Secretary', 12, '2026-2027'),
  ('Treasurer', 13, '2026-2027'),
  ('Auditor', 14, '2026-2027')
on conflict (title, term_year) do nothing;


--
-- Two things the roster surfaced that the schema could not express:
--
-- 1. The adviser is faculty, not a student officer. There was no
--    position for her and no way to keep her out of the officer list.
-- 2. The design canvas shows "Executive officers" and "General members"
--    as separate blocks, and board members are a third group.
--    display_order alone cannot express that grouping.
--
-- Both are fixed by two columns on officer_positions. The display_order
-- values already agreed on are left exactly as they are.

-- ------------------------------------------------------------
-- 1. Grouping columns
-- ------------------------------------------------------------
alter table public.officer_positions
  add column if not exists role_group text not null default 'executive'
    check (role_group in ('adviser', 'executive', 'board')),
  add column if not exists committee text;

comment on column public.officer_positions.role_group is
  'Which block this position renders in on the public officers page.';
comment on column public.officer_positions.committee is
  'Committee a VP/Board Member belongs to; null for President, Secretary, Treasurer, Auditor and the Adviser.';

-- Tag the existing rows.
update public.officer_positions set role_group = 'board'
  where term_year = '2026-2027' and title like 'Board Member%';

update public.officer_positions set committee = 'Income-Generating Projects'
  where term_year = '2026-2027' and title like '%Income-Generating Projects';
update public.officer_positions set committee = 'Logistics'
  where term_year = '2026-2027' and title like '%Logistics';
update public.officer_positions set committee = 'Programs'
  where term_year = '2026-2027' and title like '%Programs';
update public.officer_positions set committee = 'Public Relations'
  where term_year = '2026-2027' and title like '%Public Relations';
update public.officer_positions set committee = 'Research and Development'
  where term_year = '2026-2027' and title like '%Research and Development';

-- The adviser sits above everything else.
insert into public.officer_positions (title, display_order, term_year, role_group)
values ('Adviser', 0, '2026-2027', 'adviser')
on conflict (title, term_year) do nothing;

create index if not exists officer_positions_group_idx
  on public.officer_positions (term_year, role_group, display_order);

-- ------------------------------------------------------------
-- 2. Roster — AY 2026-2027
-- ------------------------------------------------------------
-- Guarded by a name check so re-running is safe. Board Member titles
-- appear twice on purpose: two people share one position row, which the
-- members -> officer_positions FK allows.

insert into public.members (full_name, is_officer, position_id, is_published)
select v.full_name, true, op.id, true
from (values
    -- Adviser
    ('Engr. Lea M. Gabawa',      'Adviser'),

    -- Executive officers
    ('Clarence Anthony Bolivar', 'President'),
    ('Elaijah Aman',             'Secretary'),
    ('Marielle Louise Dorado',   'Treasurer'),
    ('Gwen Tricia Cirujales',    'Auditor'),
    ('Steven Ken Pontillas',     'Vice President for Logistics'),
    ('Zyrus Canteras',           'Vice President for Income-Generating Projects'),
    ('Fritz Marick Fernandez',   'Vice President for Research and Development'),
    ('Samantha Galan',           'Vice President for Programs'),
    ('Megan Maligad',            'Vice President for Public Relations'),

    -- Board members
    ('Lorin Sernicula',          'Board Member for Logistics'),
    ('Oliver Ledesma',           'Board Member for Logistics'),
    ('Carlos John Aristoki',     'Board Member for Income-Generating Projects'),
    ('Angel Guelos',             'Board Member for Income-Generating Projects'),
    ('Diosylle Auditor',         'Board Member for Research and Development'),
    ('James Remegio',            'Board Member for Research and Development'),
    ('Mary Anne Labiscase',      'Board Member for Programs'),
    ('Sean Genona',              'Board Member for Programs'),
    ('Rania Dwayne Bravo',       'Board Member for Public Relations'),
    ('Mikhaela Cruz',            'Board Member for Public Relations')
  ) as v(full_name, title)
join public.officer_positions op
  on op.title = v.title and op.term_year = '2026-2027'
where not exists (
  select 1 from public.members m where m.full_name = v.full_name
);


--
-- Reorders positions to match the org's published announcement:
-- President, Secretary, Treasurer, Auditor, then the Vice Presidents,
-- then the Board Members, with the Adviser last.
--
-- The earlier numbering interleaved each committee's VP and Board
-- Member (VP IGP 2, Board IGP 3, ...), which grouped by committee
-- rather than by rank.

update public.officer_positions as op
set display_order = v.ord
from (values
    ('President',                                       1),
    ('Secretary',                                       2),
    ('Treasurer',                                       3),
    ('Auditor',                                         4),
    ('Vice President for Logistics',                    5),
    ('Vice President for Income-Generating Projects',   6),
    ('Vice President for Research and Development',     7),
    ('Vice President for Programs',                     8),
    ('Vice President for Public Relations',             9),
    ('Board Member for Logistics',                     10),
    ('Board Member for Income-Generating Projects',    11),
    ('Board Member for Research and Development',      12),
    ('Board Member for Programs',                      13),
    ('Board Member for Public Relations',              14),
    -- The adviser renders in her own block at the foot of the page.
    ('Adviser',                                        15)
  ) as v(title, ord)
where op.title = v.title and op.term_year = '2026-2027';
