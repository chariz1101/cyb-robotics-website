import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/database.types";

/**
 * Refreshes the Supabase session cookie and reports who is signed in.
 *
 * Auth tokens expire; without a refresh on each request the admin gets
 * logged out mid-session. The response carries the refreshed cookies, so
 * callers must return *this* response rather than a fresh one.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser(), not getSession(): it revalidates the token with Supabase
  // instead of trusting a cookie the browser could have tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
