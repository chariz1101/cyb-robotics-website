-- ============================================================
-- Cyb Robotics — Seed data: officer positions for AY 2026-2027
-- Optional. Edit the titles/order to match your org's structure.
-- ============================================================

insert into public.officer_positions (title, display_order, term_year) values
  ('President',            1, '2026-2027'),
  ('Vice President',       2, '2026-2027'),
  ('Secretary',            3, '2026-2027'),
  ('Treasurer',            4, '2026-2027'),
  ('Auditor',              5, '2026-2027'),
  ('Public Relations Officer', 6, '2026-2027'),
  ('Technical Head',       7, '2026-2027'),
  ('Creatives Head',       8, '2026-2027')
on conflict (title, term_year) do nothing;
