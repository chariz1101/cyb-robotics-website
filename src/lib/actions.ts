"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** Tables the dashboard is allowed to write. */
const EDITABLE = [
  "members",
  "events",
  "announcements",
  "files",
  "officer_positions",
] as const;

export type EditableTable = (typeof EDITABLE)[number];

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Public routes that show data from a given table. */
const AFFECTED_PATHS: Record<EditableTable, string[]> = {
  members: ["/", "/officers", "/alumni"],
  events: ["/", "/events"],
  announcements: ["/"],
  files: [],
  officer_positions: ["/officers"],
};

function assertEditable(table: string): asserts table is EditableTable {
  if (!EDITABLE.includes(table as EditableTable)) {
    throw new Error(`Table "${table}" is not editable from the dashboard.`);
  }
}

function revalidate(table: EditableTable) {
  for (const path of AFFECTED_PATHS[table]) revalidatePath(path);
  revalidatePath(`/admin/${table}`);
}

/**
 * Blank strings from an empty form field mean "not set", not "the empty
 * string" — otherwise a skipped optional field writes '' where the schema
 * and the UI both expect null.
 *
 * Returns `never` so the result satisfies supabase-js's per-table Insert
 * and Update types. These actions take a table name at runtime, so no
 * single static row type applies; the cast is unavoidable for a generic
 * writer. What actually guards the write is layered elsewhere and does not
 * depend on this type: `assertEditable` restricts the table, the form
 * config restricts the columns, CHECK constraints reject bad enum values,
 * and RLS rejects the whole statement unless the caller is an admin.
 */
function normalize(values: Record<string, unknown>): never {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = value === "" ? null : value;
  }
  return out as never;
}

export async function createRow(
  table: string,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  assertEditable(table);
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from(table).insert(normalize(values));

  if (error) return { ok: false, error: error.message };
  revalidate(table);
  return { ok: true };
}

export async function updateRow(
  table: string,
  id: string,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  assertEditable(table);
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update(normalize(values))
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidate(table);
  return { ok: true };
}

export async function deleteRow(
  table: string,
  id: string,
): Promise<ActionResult> {
  assertEditable(table);
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidate(table);
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
}
