import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth";

/**
 * Wraps only the signed-in dashboard.
 *
 * The auth check lives here rather than in admin/layout.tsx because
 * /admin/login shares that segment — guarding it there redirects the login
 * page to itself.
 *
 * proxy.ts already bounces signed-out visitors; this is what enforces it,
 * so a route the matcher misses is still closed.
 */
export default async function DashboardLayout(
  props: LayoutProps<"/admin">,
) {
  const admin = await requireAdmin();

  return (
    <div className="grid flex-1 items-stretch bg-surface-alt md:[grid-template-columns:minmax(0,244px)_minmax(0,1fr)]">
      <AdminSidebar email={admin.email} fullName={admin.full_name} />
      <div className="min-w-0 px-6 py-8 md:px-8.5 md:pb-17.5">
        {props.children}
      </div>
    </div>
  );
}
