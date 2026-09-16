import Link from "next/link";
import { notFound } from "next/navigation";

import { DataTable } from "@/components/admin/data-table";
import type { Resource, TableRow } from "@/components/admin/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectStepsPage(
  props: PageProps<"/admin/projects/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: project }, { data: steps }, { data: files }] =
    await Promise.all([
      supabase.from("projects").select("id, title").eq("id", id).maybeSingle(),
      supabase
        .from("project_steps")
        .select("*")
        .eq("project_id", id)
        .order("step_number"),
      supabase.from("project_files").select("*").eq("project_id", id),
    ]);

  if (!project) notFound();

  const stepResource: Resource = {
    table: "project_steps",
    title: `Steps — ${project.title}`,
    addLabel: "Step",
    defaults: { project_id: id },
    columns: [
      { key: "step_number", label: "#", width: "minmax(0,0.3fr)" },
      { key: "title", label: "Title", width: "minmax(0,2fr)" },
    ],
    fields: [
      { name: "step_number", label: "Step number", type: "number", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "instructions", label: "Instructions", type: "textarea", required: true },
      {
        name: "image_url",
        label: "Diagram or photo",
        type: "upload",
        bucket: "project-media",
        accept: "image/*",
        preview: true,
      },
    ],
  };

  const fileResource: Resource = {
    table: "project_files",
    title: "Sample code & downloads",
    addLabel: "File",
    defaults: { project_id: id },
    columns: [
      { key: "file_name", label: "File name", width: "minmax(0,2fr)" },
      { key: "file_type", label: "Type", width: "minmax(0,0.6fr)" },
    ],
    fields: [
      { name: "file_name", label: "File name", type: "text", required: true },
      {
        name: "file_url",
        label: "File",
        type: "upload",
        bucket: "project-code",
        required: true,
        fillsFileType: "file_type",
      },
    ],
  };

  const stepRows: TableRow[] = (steps ?? []).map((s) => ({
    id: s.id,
    cells: [String(s.step_number), s.title],
    values: s,
  }));

  const fileRows: TableRow[] = (files ?? []).map((f) => ({
    id: f.id,
    cells: [f.file_name, f.file_type ?? ""],
    values: f,
  }));

  return (
    <div>
      <Link
        href="/admin/projects"
        className="font-label text-[10.5px] uppercase tracking-[0.1em] text-brand"
      >
        ← All projects
      </Link>
      <div className="mt-4">
        <DataTable resource={stepResource} rows={stepRows} />
      </div>
      <div className="mt-12">
        <DataTable resource={fileResource} rows={fileRows} />
      </div>
    </div>
  );
}
