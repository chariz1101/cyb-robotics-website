import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEventsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, event_date, status, cover_photo_url, is_published")
    .order("event_date", { ascending: false });

  const resource: Resource = {
    table: "events",
    title: "Events",
    addLabel: "Event",
    columns: [
      { key: "title", label: "Title", width: "minmax(0,1.6fr)" },
      { key: "event_date", label: "Date", width: "minmax(0,0.8fr)" },
      { key: "status", label: "Status", width: "minmax(0,0.7fr)" },
      { key: "is_published", label: "Public", width: "minmax(0,0.6fr)" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "event_date", label: "Date", type: "date", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "upcoming", label: "Upcoming" },
          { value: "past", label: "Past" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      { name: "description", label: "Description", type: "textarea" },
      { name: "cover_photo_url", label: "Cover photo URL", type: "text", placeholder: "https://…" },
      { name: "is_published", label: "Show on public site", type: "toggle" },
    ],
  };

  const rows: TableRow[] = (events ?? []).map((e) => ({
    id: e.id,
    cells: [
      e.title,
      e.event_date,
      e.status,
      e.is_published ? "Yes" : "Draft",
    ],
    values: e,
  }));

  return <DataTable resource={resource} rows={rows} />;
}
