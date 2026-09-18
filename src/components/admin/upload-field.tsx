"use client";

import { useRef, useState } from "react";

import { uploadFile, type Bucket, type UploadResult } from "@/lib/upload";

export function UploadField({
  id,
  bucket,
  accept,
  value,
  preview,
  onUploaded,
}: {
  id: string;
  bucket: Bucket;
  accept?: string;
  value: string;
  preview?: boolean;
  onUploaded: (result: UploadResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onUploaded(await uploadFile(bucket, file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      // Clear the input so re-picking the same file fires onChange again.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="border border-dashed border-ink/28 bg-surface p-5.5 text-center">
        {value ? (
          <div className="flex items-center gap-3.5 text-left">
            {preview && (
              /* Deliberately not next/image: this previews whatever URL the
                 record already holds, which for older rows may be a host
                 outside images.remotePatterns — next/image would refuse it
                 and the admin would see a broken preview instead of their
                 file. It is a 56px thumbnail on an admin-only screen. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="h-14 w-14 flex-none border border-ink/12 object-cover"
              />
            )}
            <p className="min-w-0 flex-1 truncate font-label text-[11px] tracking-[0.06em] text-muted">
              {value.split("/").pop()}
            </p>
            <button
              type="button"
              onClick={() => onUploaded({ url: "", fileType: "", sizeKb: 0 })}
              className="font-label text-[10.5px] uppercase tracking-[0.08em] text-danger"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="font-label text-[11px] tracking-[0.08em] text-muted">
            {busy ? "Uploading…" : "No file chosen"}
          </p>
        )}

        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-[2px] border border-brand px-3.5 py-2 font-label text-[10.5px] uppercase tracking-[0.08em] text-brand hover:bg-brand hover:text-canvas disabled:opacity-50"
        >
          {value ? "Replace file" : "Choose file"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-1.75 font-label text-[11.5px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
