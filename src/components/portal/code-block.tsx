"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  fileName,
  downloadUrl,
}: {
  code: string;
  fileName?: string | null;
  downloadUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
      // The code is on screen either way, so this stays silent.
    }
  }

  return (
    <div className="mt-8.5 border-t border-ink/10 pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-label text-[11px] uppercase tracking-[0.14em] text-brand">
          Sample code
        </h3>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto rounded-[2px] bg-brand px-4 py-2.5 font-label text-[10.5px] uppercase tracking-[0.08em] text-canvas"
          >
            ↓ {fileName ?? "Download"}
          </a>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`${downloadUrl ? "" : "ml-auto "}rounded-[2px] border border-ink/20 px-4 py-2.5 font-label text-[10.5px] uppercase tracking-[0.08em]`}
        >
          {open ? "Hide code" : "Show code"}
        </button>
        {open && (
          <button
            type="button"
            onClick={copy}
            className="rounded-[2px] border border-brand px-4 py-2.5 font-label text-[10.5px] uppercase tracking-[0.08em] text-brand hover:bg-brand hover:text-canvas"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {open && (
        <pre className="mt-4 overflow-x-auto rounded-[2px] bg-ink px-5.5 py-5.5 font-mono text-[12.5px] leading-[1.7] text-[#B9E3CC]">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
