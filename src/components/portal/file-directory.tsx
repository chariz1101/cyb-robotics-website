"use client";

import { useMemo, useState } from "react";

import type { FileCategory } from "@/lib/database.types";

export type DirectoryRow = {
  id: string;
  fileName: string;
  category: FileCategory;
  eventTitle: string | null;
  url: string;
  sizeKb: number | null;
};

const CATEGORIES: { value: FileCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "letter", label: "Letters" },
  { value: "programme", label: "Programmes" },
  { value: "branding", label: "Branding" },
  { value: "documentation", label: "Documentation" },
  { value: "other", label: "Other" },
];

function humanSize(kb: number | null) {
  if (!kb) return "";
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function FileDirectory({ files }: { files: DirectoryRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FileCategory | "all">("all");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (!q) return true;
      return (
        f.fileName.toLowerCase().includes(q) ||
        (f.eventTitle ?? "").toLowerCase().includes(q)
      );
    });
  }, [files, query, category]);

  const grid = "minmax(0,2.4fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,110px)";

  return (
    <div>
      <div className="mt-6.5 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files…"
          aria-label="Search files"
          className="min-w-[220px] flex-1 border border-ink/18 bg-surface px-3.5 py-2.75 text-sm outline-none focus:border-brand"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                aria-pressed={active}
                className={`rounded-[2px] border px-3.25 py-2.25 font-label text-[11px] tracking-[0.08em] ${
                  active
                    ? "border-brand bg-brand text-canvas"
                    : "border-ink/18 text-muted hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border border-ink/12 bg-surface">
        <div
          className="hidden gap-4 border-b border-ink/12 bg-surface-alt px-5 py-3.25 font-label text-[10px] uppercase tracking-[0.12em] text-muted sm:grid"
          style={{ gridTemplateColumns: grid }}
        >
          <span>File name</span>
          <span>Category</span>
          <span>Related event</span>
          <span className="text-right">Action</span>
        </div>

        {shown.length === 0 ? (
          <p className="px-5 py-11 text-center font-label text-xs tracking-[0.06em] text-faint">
            No files match this filter.
          </p>
        ) : (
          shown.map((file) => (
            <div
              key={file.id}
              className="grid items-center gap-3 border-b border-ink/8 px-5 py-3.75 last:border-0 sm:gap-4"
              style={{ gridTemplateColumns: grid }}
            >
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-medium tracking-[-0.005em]">
                  {file.fileName}
                </p>
                <p className="mt-1 font-label text-[10.5px] text-faint">
                  {humanSize(file.sizeKb)}
                </p>
              </div>
              <span className="truncate font-label text-[11px] capitalize tracking-[0.06em] text-brand">
                {file.category}
              </span>
              <span className="truncate text-[13.5px] text-ink-soft">
                {file.eventTitle ?? "—"}
              </span>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                // `download` is ignored cross-origin, so this opens the file.
                // Storage serves PDFs and images inline, which covers the
                // preview half; the browser's own save control does the rest.
                className="justify-self-end rounded-[2px] border border-brand px-3.25 py-2 font-label text-[10.5px] uppercase tracking-[0.08em] text-brand hover:bg-brand hover:text-canvas"
              >
                Open
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
