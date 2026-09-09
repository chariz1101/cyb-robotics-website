"use client";

import { useEffect, useState } from "react";

import type { Field } from "@/components/admin/types";

function initialValues(fields: Field[], initial?: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const value = initial?.[field.name];
    out[field.name] =
      field.type === "toggle" ? Boolean(value) : (value ?? "");
  }
  return out;
}

export function FormModal({
  title,
  fields,
  initial,
  pending,
  onCancel,
  onSave,
}: {
  title: string;
  fields: Field[];
  initial?: Record<string, unknown>;
  pending: boolean;
  onCancel: () => void;
  onSave: (values: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState(() => initialValues(fields, initial));

  // Escape closes, matching the click-outside affordance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const set = (name: string, value: unknown) =>
    setValues((v) => ({ ...v, [name]: value }));

  const inputClass =
    "w-full border border-ink/20 bg-surface px-3.25 py-2.75 text-[14.5px] outline-none focus:border-brand";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-210 flex items-start justify-center overflow-y-auto bg-ink/62 px-6 py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[560px] bg-canvas"
      >
        <div className="flex items-center gap-3.5 border-b border-ink/12 px-6.5 py-5.5">
          <h2 className="text-[19px] font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="ml-auto text-xl leading-none text-muted hover:text-ink"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(values);
          }}
        >
          <div className="flex flex-col gap-4.5 p-6.5">
            {fields.map((field) => {
              const id = `field-${field.name}`;
              const value = values[field.name];

              return (
                <div key={field.name}>
                  <label
                    htmlFor={id}
                    className="mb-2 block font-label text-[10px] uppercase tracking-[0.14em] text-muted"
                  >
                    {field.label}
                    {field.required && <span className="text-danger"> *</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      id={id}
                      rows={4}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={String(value ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                      className={`${inputClass} resize-y`}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={id}
                      required={field.required}
                      value={String(value ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                      className={inputClass}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.label} value={opt.value ?? ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "toggle" ? (
                    <button
                      type="button"
                      id={id}
                      aria-pressed={Boolean(value)}
                      onClick={() => set(field.name, !value)}
                      className={`rounded-[2px] border px-4 py-2.25 font-label text-[11px] uppercase tracking-[0.08em] ${
                        value
                          ? "border-brand bg-brand text-canvas"
                          : "border-ink/20 text-muted"
                      }`}
                    >
                      {value ? "Yes" : "No"}
                    </button>
                  ) : (
                    <input
                      id={id}
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={String(value ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2.5 border-t border-ink/12 bg-surface-sunk px-6.5 py-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-[2px] border border-ink/20 px-4.5 py-3 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-[2px] bg-brand-deep px-5.5 py-3 text-sm font-semibold text-canvas disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
