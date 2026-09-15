import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("title");

  const resource: Resource = {
    table: "projects",
    title: "Projects & guides",
    addLabel: "Project",
    columns: [
      { key: "title", label: "Title", width: "minmax(0,1.6fr)" },
      { key: "category", label: "Category", width: "minmax(0,0.8fr)" },
      { key: "is_public_showcase", label: "Public", width: "minmax(0,0.5fr)" },
      { key: "is_members_guide", label: "Guide", width: "minmax(0,0.5fr)" },
      { key: "steps", label: "Steps", width: "minmax(0,0.6fr)" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Category", type: "text", placeholder: "Arduino" },
      {
        name: "difficulty_level",
        label: "Difficulty",
        type: "select",
        options: [
          { value: null, label: "— None —" },
          { value: "Beginner", label: "Beginner" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Advanced", label: "Advanced" },
        ],
      },
      {
        name: "parts_list",
        label: "Parts list (one per line)",
        type: "textarea",
        placeholder: "1x Arduino Uno\n1x HC-SR04 ultrasonic sensor",
      },
      {
        name: "cover_image_url",
        label: "Cover image",
        type: "upload",
        bucket: "project-media",
        accept: "image/*",
        preview: true,
      },
      { name: "is_public_showcase", label: "Show on public projects page", type: "toggle" },
      { name: "is_members_guide", label: "Show as a members guide", type: "toggle" },
    ],
  };

  const rows: TableRow[] = (projects ?? []).map((p) => ({
    id: p.id,
    cells: [
      p.title,
      p.category ?? "",
      p.is_public_showcase ? "Yes" : "No",
      p.is_members_guide ? "Yes" : "No",
      "",
    ],
    values: p,
    linkCell: { index: 4, href: `/admin/projects/${p.id}`, label: "Steps →" },
  }));

  return <DataTable resource={resource} rows={rows} />;
}
