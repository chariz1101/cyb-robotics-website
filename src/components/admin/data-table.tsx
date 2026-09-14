"use client";

import { useMemo, useState, useTransition } from "react";

import { createRow, deleteRow, updateRow } from "@/lib/actions";
import { FormModal } from "@/components/admin/form-modal";
import type { Resource, TableRow } from "@/components/admin/types";

export function DataTable({
  resource,
  rows,
}: {
  resource: Resource;
  rows: TableRow[];
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<TableRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      row.cells.some((cell) => cell.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  // Data columns plus a fixed track for the actions cell.
  const grid = `${resource.columns
    .map((c) => c.width ?? "minmax(0,1fr)")
    .join(" ")} minmax(0,auto)`;

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  }

  function handleSave(values: Record<string, unknown>) {
    startTransition(async () => {
      const payload = { ...resource.defaults, ...values };
      const result = editing
        ? await updateRow(resource.table, editing.id, payload)
        : await createRow(resource.table, payload);

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(null);
      setAdding(false);
      setError(null);
      flash(editing ? "Changes saved." : `${resource.addLabel} added.`);
    });
  }

  function handleDelete(row: TableRow) {
    const name = row.cells[0] || "this record";
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteRow(resource.table, row.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      flash("Record deleted.");
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label tracking-[0.16em] text-muted">Manage</p>
          <h1 className="mt-2.5 text-[30px] font-bold">{resource.title}</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setAdding(true);
            setError(null);
          }}
          className="rounded-[2px] bg-brand-deep px-4.5 py-3 text-sm font-semibold text-canvas"
        >
          + {resource.addLabel}
        </button>
      </div>

      <div className="mt-5.5 flex flex-wrap items-center gap-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          aria-label={`Search ${resource.title}`}
          className="max-w-[320px] min-w-[200px] flex-1 border border-ink/18 bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand"
        />
        <span className="font-label text-[11px] tracking-[0.06em] text-faint">
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-4 border border-ink/12 bg-surface">
        <div
          className="hidden gap-4 border-b border-ink/12 bg-surface-alt px-5 py-3.25 font-label text-[10px] uppercase tracking-[0.12em] text-muted md:grid"
          style={{ gridTemplateColumns: grid }}
        >
          {resource.columns.map((col) => (
            <span key={col.key}>{col.label}</span>
          ))}
          <span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-11 text-center font-label text-xs tracking-[0.06em] text-faint">
            No records found.
          </p>
        ) : (
          filtered.map((row) => (
            <div
              key={row.id}
              className="grid items-center gap-2 border-b border-ink/6 px-5 py-3.5 last:border-0 md:gap-4"
              style={{ gridTemplateColumns: grid }}
            >
              {row.cells.map((cell, i) => (
                <span
                  key={resource.columns[i]?.key ?? i}
                  className="min-w-0 truncate text-sm text-ink-body"
                >
                  {cell || "—"}
                </span>
              ))}
              <div className="flex justify-self-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(row);
                    setAdding(false);
                    setError(null);
                  }}
                  className="rounded-[2px] border border-ink/20 px-2.75 py-1.75 font-label text-[10.5px] uppercase tracking-[0.08em] hover:border-brand hover:text-brand"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(row)}
                  className="rounded-[2px] border border-danger/30 px-2.75 py-1.75 font-label text-[10.5px] uppercase tracking-[0.08em] text-danger hover:bg-danger hover:text-white disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(adding || editing) && (
        <FormModal
          title={editing ? `Edit ${resource.addLabel}` : `New ${resource.addLabel}`}
          fields={resource.fields}
          initial={editing?.values}
          pending={pending}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
            setError(null);
          }}
          onSave={handleSave}
        />
      )}

      {toast && (
        <p className="fixed bottom-6.5 left-1/2 z-300 -translate-x-1/2 rounded-[2px] bg-ink px-5.5 py-3.5 font-label text-[12.5px] tracking-[0.04em] text-canvas shadow-[0_8px_30px_rgba(11,13,12,0.28)]">
          {toast}
        </p>
      )}
    </div>
  );
}
