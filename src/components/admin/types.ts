import type { EditableTable } from "@/lib/actions";

export type FieldType = "text" | "textarea" | "select" | "toggle" | "date" | "number";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  /** For `select`. A null value renders as "—" and writes null. */
  options?: { value: string | null; label: string }[];
};

export type Column = {
  /** Key on the row, or a function for derived/joined values. */
  key: string;
  label: string;
  /** CSS grid track for this column. */
  width?: string;
};

export type Resource = {
  table: EditableTable;
  title: string;
  addLabel: string;
  columns: Column[];
  fields: Field[];
  /** Values merged into every insert (e.g. is_alumnus for the alumni page). */
  defaults?: Record<string, unknown>;
};

/** A row as the table renders it: an id plus pre-formatted display cells. */
export type TableRow = {
  id: string;
  cells: string[];
  /** Raw values, used to populate the edit form. */
  values: Record<string, unknown>;
};
