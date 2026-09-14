import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFilesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: files }, { data: events }] = await Promise.all([
    supabase
      .from("files")
      .select(
        "id, file_name, category, related_event_id, file_url, file_type, file_size_kb",
      )
      .order("created_at", { ascending: false }),
    supabase.from("events").select("id, title").order("event_date", { ascending: false }),
  ]);

  const eventTitle = new Map((events ?? []).map((e) => [e.id, e.title] as const));

  const resource: Resource = {
    table: "files",
    title: "Files",
    addLabel: "File",
    columns: [
      { key: "file_name", label: "File name", width: "minmax(0,1.6fr)" },
      { key: "category", label: "Category", width: "minmax(0,0.8fr)" },
      { key: "related_event_id", label: "Related event", width: "minmax(0,1.2fr)" },
    ],
    fields: [
      { name: "file_name", label: "File name", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "letter", label: "Letter" },
          { value: "programme", label: "Programme" },
          { value: "branding", label: "Branding" },
          { value: "documentation", label: "Documentation" },
          { value: "other", label: "Other" },
        ],
      },
      { name: "file_url", label: "File URL", type: "text", required: true, placeholder: "https://…" },
      {
        name: "related_event_id",
        label: "Related event",
        type: "select",
        options: [
          { value: null, label: "— None —" },
          ...(events ?? []).map((e) => ({ value: e.id, label: e.title })),
        ],
      },
      { name: "file_type", label: "File type", type: "text", placeholder: "pdf" },
      { name: "file_size_kb", label: "Size (KB)", type: "number" },
    ],
  };

  const rows: TableRow[] = (files ?? []).map((f) => ({
    id: f.id,
    cells: [
      f.file_name,
      f.category,
      f.related_event_id ? (eventTitle.get(f.related_event_id) ?? "") : "",
    ],
    values: f,
  }));

  return <DataTable resource={resource} rows={rows} />;
}
