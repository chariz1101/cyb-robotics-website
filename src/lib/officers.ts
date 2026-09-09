import type { MemberWithPosition, RoleGroup } from "./database.types";

/**
 * Split officers into the blocks the page renders, each ordered by
 * `officer_positions.display_order`.
 *
 * The sort lives here rather than in the PostgREST query. Supabase's
 * `.order(col, { referencedTable })` sorts rows *within* an embedded list,
 * which is a no-op for a to-one relation like member -> position: it
 * silently returns rows in whatever order Postgres produced.
 *
 * Kept free of the Supabase client so the ordering is testable without a
 * database — see scripts/check-officer-order.mjs.
 */
export function groupOfficers(
  rows: MemberWithPosition[],
): Record<RoleGroup, MemberWithPosition[]> {
  const grouped: Record<RoleGroup, MemberWithPosition[]> = {
    adviser: [],
    executive: [],
    board: [],
  };

  for (const member of rows) {
    const group = member.officer_positions?.role_group;
    if (group) grouped[group].push(member);
  }

  for (const list of Object.values(grouped)) {
    list.sort((a, b) => {
      const ao = a.officer_positions?.display_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.officer_positions?.display_order ?? Number.MAX_SAFE_INTEGER;
      // Two people share each Board Member position, so ties are expected;
      // name keeps their order stable between requests.
      return ao - bo || a.full_name.localeCompare(b.full_name);
    });
  }

  return grouped;
}
