import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Keeps the admin session alive and bounces signed-out visitors away from
 * /admin.
 *
 * This is a redirect for the sake of the UI, not the security boundary.
 * The real enforcement is RLS on the database plus the check in
 * app/admin/layout.tsx — a misconfigured matcher here must not be able to
 * expose data.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isLogin;

  if (isAdminArea && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    // Send them back where they were headed once they sign in.
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
