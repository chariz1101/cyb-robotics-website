-- ============================================================
-- Cyb Robotics — Parts list for project guides
-- Run AFTER 0005.
-- ============================================================
--
-- The members-portal guide layout shows a parts list above the steps
-- ("1x Arduino Uno, 1x HC-SR04, jumper wires…"). There was nowhere to
-- store it: description is prose and the steps are instructions.

alter table public.projects
  add column if not exists parts_list text;

comment on column public.projects.parts_list is
  'Components needed for a members-guide project, one per line.';
