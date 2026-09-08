-- ============================================================
-- Cyb Robotics — Officer display order
-- Run AFTER 0004.
-- ============================================================
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
