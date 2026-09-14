import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, content, audience, is_published, publish_date")
    .order("publish_date", { ascending: false, nullsFirst: false });

  const resource: Resource = {
    table: "announcements",
    title: "Announcements",
    addLabel: "Announcement",
    columns: [
      { key: "title", label: "Title", width: "minmax(0,1.8fr)" },
      { key: "audience", label: "Audience", width: "minmax(0,0.7fr)" },
      { key: "publish_date", label: "Publish date", width: "minmax(0,0.8fr)" },
      { key: "is_published", label: "Live", width: "minmax(0,0.5fr)" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "content", label: "Content", type: "textarea", required: true },
      {
        name: "audience",
        label: "Audience",
        type: "select",
        required: true,
        options: [
          { value: "public", label: "Public site" },
          { value: "members", label: "Members portal" },
          { value: "both", label: "Both" },
        ],
      },
      { name: "publish_date", label: "Publish date", type: "date" },
      { name: "is_published", label: "Published", type: "toggle" },
    ],
  };

  const rows: TableRow[] = (announcements ?? []).map((a) => ({
    id: a.id,
    cells: [
      a.title,
      a.audience,
      a.publish_date ? a.publish_date.slice(0, 10) : "",
      a.is_published ? "Yes" : "Draft",
    ],
    values: {
      ...a,
      publish_date: a.publish_date ? a.publish_date.slice(0, 10) : "",
    },
  }));

  return <DataTable resource={resource} rows={rows} />;
}
