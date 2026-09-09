/**
 * Applies to the whole /admin area, login included.
 *
 * Deliberately contains no auth check: the login page lives under this
 * segment, and a guard here would redirect it to itself. Authentication
 * wraps (dashboard) instead.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout(props: LayoutProps<"/admin">) {
  return props.children;
}
