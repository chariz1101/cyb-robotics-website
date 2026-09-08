-- ============================================================
-- Cyb Robotics — Seed data: officer positions for AY 2026-2027
-- Reflects the org's actual VP / Board Member committee structure.
-- ============================================================


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
