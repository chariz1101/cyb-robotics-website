import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

/**
 * Supabase client for Client Components.
 *
 * Uses the anon key, so every query runs under the anonymous RLS
 * policies. Never reach for the service role key here — it bypasses RLS
 * entirely and must not reach the browser.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
