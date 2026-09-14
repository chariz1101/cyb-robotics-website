import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMembersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: members }, { data: positions }] = await Promise.all([
    supabase
      .from("members")
      .select(
        "id, full_name, year_level, course, is_officer, position_id, bio, photo_url, is_published",
      )
      .eq("is_alumnus", false)
      .order("full_name"),
    supabase
      .from("officer_positions")
      .select("id, title, display_order")
      .order("display_order"),
  ]);

  const positionName = new Map(
    (positions ?? []).map((p) => [p.id, p.title] as const),
  );

  const resource: Resource = {
    table: "members",
    title: "Members",
    addLabel: "Member",
    defaults: { is_alumnus: false },
    columns: [
      { key: "full_name", label: "Name", width: "minmax(0,1.4fr)" },
      { key: "position", label: "Position", width: "minmax(0,1.4fr)" },
      { key: "year_level", label: "Year", width: "minmax(0,0.7fr)" },
      { key: "is_published", label: "Public", width: "minmax(0,0.6fr)" },
    ],
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      {
        name: "position_id",
        label: "Officer position",
        type: "select",
        options: [
          { value: null, label: "— Not an officer —" },
          ...(positions ?? []).map((p) => ({ value: p.id, label: p.title })),
        ],
      },
      { name: "is_officer", label: "Is an officer", type: "toggle" },
      { name: "year_level", label: "Year level", type: "text", placeholder: "3rd Year" },
      { name: "course", label: "Course", type: "text", placeholder: "BS Computer Science" },
      { name: "photo_url", label: "Photo URL", type: "text", placeholder: "https://…" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "is_published", label: "Show on public site", type: "toggle" },
    ],
  };

  const rows: TableRow[] = (members ?? []).map((m) => ({
    id: m.id,
    cells: [
      m.full_name,
      m.position_id ? (positionName.get(m.position_id) ?? "") : "",
      m.year_level ?? "",
      m.is_published ? "Yes" : "Hidden",
    ],
    values: m,
  }));

  return <DataTable resource={resource} rows={rows} />;
}
