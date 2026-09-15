import Link from "next/link";
import { notFound } from "next/navigation";

import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function EventPhotosPage(
  props: PageProps<"/admin/events/[id]/photos">,
) {
  await requireAdmin();
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: event }, { data: photos }] = await Promise.all([
    supabase.from("events").select("id, title").eq("id", id).maybeSingle(),
    supabase
      .from("event_photos")
      .select("id, photo_url, caption, display_order")
      .eq("event_id", id)
      .order("display_order"),
  ]);

  if (!event) notFound();

  const resource: Resource = {
    table: "event_photos",
    title: `Photos — ${event.title}`,
    addLabel: "Photo",
    // Every row belongs to this event; the admin never picks it.
    defaults: { event_id: id },
    columns: [
      { key: "caption", label: "Caption", width: "minmax(0,2fr)" },
      { key: "display_order", label: "Order", width: "minmax(0,0.5fr)" },
    ],
    fields: [
      {
        name: "photo_url",
        label: "Photo",
        type: "upload",
        bucket: "event-media",
        accept: "image/*",
        preview: true,
        required: true,
      },
      { name: "caption", label: "Caption", type: "text" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  };

  const rows: TableRow[] = (photos ?? []).map((p) => ({
    id: p.id,
    cells: [p.caption ?? "", String(p.display_order)],
    values: p,
  }));

  return (
    <div>
      <Link
        href="/admin/events"
        className="font-label text-[10.5px] uppercase tracking-[0.1em] text-brand"
      >
        ← All events
      </Link>
      <div className="mt-4">
        <DataTable resource={resource} rows={rows} />
      </div>
    </div>
  );
}
