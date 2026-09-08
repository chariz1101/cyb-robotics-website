import { createClient } from "@/lib/supabase/server";

import type {
  Announcement,
  EventRecord,
  MemberWithPosition,
  Project,
  RoleGroup,
} from "@/lib/database.types";

/** The academic year the public site currently presents. */
export const CURRENT_TERM = "2026-2027";

const MEMBER_SELECT = `
  id, full_name, photo_url, year_level, course, is_officer, position_id,
  position, bio, is_alumnus, alumnus_batch_year, alumnus_current_role,
  is_published, created_at, updated_at,
  officer_positions ( id, title, display_order, term_year, role_group, committee )
`;

/**
 * Officers for a term, split into the blocks the public page renders:
 * adviser, executive officers, then board members.
 *
 * RLS filters rows, not columns, so the column list above is what keeps
 * unpublished fields out of the response — not the database.
 */
export async function getOfficers(term: string = CURRENT_TERM): Promise<
  Record<RoleGroup, MemberWithPosition[]>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_SELECT)
    .eq("is_officer", true)
    .eq("officer_positions.term_year", term)
    .order("display_order", {
      referencedTable: "officer_positions",
      ascending: true,
    })
    .overrideTypes<MemberWithPosition[]>();

  if (error) throw error;

  const grouped: Record<RoleGroup, MemberWithPosition[]> = {
    adviser: [],
    executive: [],
    board: [],
  };

  for (const member of data ?? []) {
    const group = member.officer_positions?.role_group;
    if (group) grouped[group].push(member);
  }

  return grouped;
}

/** Members who are not officers and not alumni. */
export async function getGeneralMembers(): Promise<MemberWithPosition[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_SELECT)
    .eq("is_officer", false)
    .eq("is_alumnus", false)
    .order("full_name")
    .overrideTypes<MemberWithPosition[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getAlumni(): Promise<MemberWithPosition[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_SELECT)
    .eq("is_alumnus", true)
    .order("alumnus_batch_year", { ascending: false })
    .order("full_name")
    .overrideTypes<MemberWithPosition[]>();

  if (error) throw error;
  return data ?? [];
}

/**
 * Events, newest first. `upcoming` returns events dated today or later in
 * ascending order instead, so the soonest event reads first.
 */
export async function getEvents(
  opts: { upcoming?: boolean; limit?: number } = {},
): Promise<EventRecord[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  let query = supabase.from("events").select("*");

  query = opts.upcoming
    ? query.gte("event_date", today).order("event_date", { ascending: true })
    : query.lt("event_date", today).order("event_date", { ascending: false });

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getProjects(
  opts: { showcase?: boolean; limit?: number } = {},
): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts.showcase) query = query.eq("is_public_showcase", true);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/**
 * Published announcements for an audience.
 *
 * RLS already hides unpublished rows and rows whose publish_date is in the
 * future, so this only narrows by audience.
 */
export async function getAnnouncements(
  audience: "public" | "members" = "public",
  limit = 5,
): Promise<Announcement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .in("audience", [audience, "both"])
    .order("publish_date", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
