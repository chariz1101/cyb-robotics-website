import type { EditableTable } from "@/lib/actions";
import type { Bucket } from "@/lib/upload";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "toggle"
  | "date"
  | "number"
  | "upload";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  /** For `select`. A null value renders as "—" and writes null. */
  options?: { value: string | null; label: string }[];
  /** For `upload`: which storage bucket the file goes to. */
  bucket?: Bucket;
  /** For `upload`: the file picker's accept attribute. */
  accept?: string;
  /** For `upload`: show a thumbnail of the stored file. */
  preview?: boolean;
  /**
   * For `upload`: field names to fill from the upload result, so the
   * files table can record type and size without the admin typing them.
   */
  fillsFileType?: string;
  fillsSizeKb?: string;
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
  /**
   * Renders one cell as a link to a sub-page — used by events to reach
   * their photo gallery. `index` is the position in `cells`.
   */
  linkCell?: { index: number; href: string; label: string };
};
