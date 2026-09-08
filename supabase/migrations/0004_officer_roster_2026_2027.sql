-- ============================================================
-- Cyb Robotics — Officer grouping + AY 2026-2027 roster
-- Run AFTER 0001-0003 (i.e. after supabase/setup.sql).
-- ============================================================
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
