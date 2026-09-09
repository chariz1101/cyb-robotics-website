import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAlumniPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: alumni } = await supabase
    .from("members")
    .select(
      "id, full_name, course, alumnus_batch_year, alumnus_current_role, photo_url, is_published",
    )
    .eq("is_alumnus", true)
    .order("alumnus_batch_year", { ascending: false })
    .order("full_name");

  const resource: Resource = {
    table: "members",
    title: "Alumni",
    addLabel: "Alumnus",
    // An alumnus is never a sitting officer — the schema enforces this too.
    defaults: { is_alumnus: true, is_officer: false, position_id: null },
    columns: [
      { key: "full_name", label: "Name", width: "minmax(0,1.3fr)" },
      { key: "alumnus_batch_year", label: "Batch", width: "minmax(0,0.6fr)" },
      { key: "alumnus_current_role", label: "Now", width: "minmax(0,1.5fr)" },
      { key: "is_published", label: "Public", width: "minmax(0,0.6fr)" },
    ],
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "alumnus_batch_year", label: "Batch year", type: "text", placeholder: "2024" },
      {
        name: "alumnus_current_role",
        label: "Current role",
        type: "text",
        placeholder: "Software Engineer, Acme Inc.",
      },
      { name: "course", label: "Course", type: "text" },
      { name: "photo_url", label: "Photo URL", type: "text", placeholder: "https://…" },
      { name: "is_published", label: "Show on public site", type: "toggle" },
    ],
  };

  const rows: TableRow[] = (alumni ?? []).map((a) => ({
    id: a.id,
    cells: [
      a.full_name,
      a.alumnus_batch_year ?? "",
      a.alumnus_current_role ?? "",
      a.is_published ? "Yes" : "Hidden",
    ],
    values: a,
  }));

  return <DataTable resource={resource} rows={rows} />;
}
