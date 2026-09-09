import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in admin, or a redirect to the login page.
 *
 * proxy.ts already bounces signed-out visitors, but this is the check that
 * actually enforces it: a route the matcher misses must still be closed.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  // Authenticated with Supabase but with no admin_users row: RLS will deny
  // every write anyway, so fail here with an explanation rather than
  // letting them into a dashboard where nothing saves.
  if (!admin) redirect("/admin/login?error=not-admin");

  return admin;
}

/** First name, for the dashboard greeting. */
export function firstNameOf(fullName: string | null, email: string) {
  if (fullName) return fullName.split(" ")[0];
  return email.split("@")[0];
}
