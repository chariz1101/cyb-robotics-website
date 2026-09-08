/**
 * Types for the Cyb Robotics database.
 *
 * Hand-written to match supabase/migrations/. Regenerate from the live
 * schema whenever a migration lands:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 *
 * Keeping this file in sync by hand is a temporary measure, not the plan.
 */

export type RoleGroup = "adviser" | "executive" | "board";
export type EventStatus = "upcoming" | "past" | "cancelled";
export type Audience = "public" | "members" | "both";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type FileCategory =
  | "letter"
  | "programme"
  | "branding"
  | "documentation"
  | "other";

export type OfficerPosition = {
  id: string;
  title: string;
  display_order: number;
  term_year: string | null;
  role_group: RoleGroup;
  committee: string | null;
};

export type Member = {
  id: string;
  full_name: string;
  photo_url: string | null;
  year_level: string | null;
  course: string | null;
  is_officer: boolean;
  position_id: string | null;
  position: string | null;
  bio: string | null;
  is_alumnus: boolean;
  alumnus_batch_year: string | null;
  alumnus_current_role: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/** A member row joined to its position. */
export type MemberWithPosition = Member & {
  officer_positions: OfficerPosition | null;
};

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  status: EventStatus;
  cover_photo_url: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventPhoto = {
  id: string;
  event_id: string;
  photo_url: string;
  caption: string | null;
  display_order: number;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty_level: Difficulty | null;
  cover_image_url: string | null;
  is_public_showcase: boolean;
  is_members_guide: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectStep = {
  id: string;
  project_id: string;
  step_number: number;
  title: string;
  instructions: string;
  image_url: string | null;
};

export type ProjectFile = {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string | null;
  file_url: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  audience: Audience;
  is_published: boolean;
  created_by: string | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
};

export type DirectoryFile = {
  id: string;
  file_name: string;
  category: FileCategory;
  related_event_id: string | null;
  file_url: string;
  file_type: string | null;
  file_size_kb: number | null;
  uploaded_by: string | null;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "super_admin";
  created_at: string;
};

/**
 * Mirrors the shape `supabase gen types` emits. `Relationships` and the
 * `[_ in never]` empty-map form matter: supabase-js infers query return
 * types from this, and a looser shape (e.g. `Record<string, never>`)
 * makes `.maybeSingle()` resolve to `never`.
 */
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      members: Table<Member>;
      officer_positions: Table<OfficerPosition>;
      events: Table<EventRecord>;
      event_photos: Table<EventPhoto>;
      projects: Table<Project>;
      project_steps: Table<ProjectStep>;
      project_files: Table<ProjectFile>;
      announcements: Table<Announcement>;
      files: Table<DirectoryFile>;
      admin_users: Table<AdminUser>;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
