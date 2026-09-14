import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** The public site's shell. /admin deliberately has its own. */
export default function PublicLayout(props: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{props.children}</main>
      <SiteFooter />
    </>
  );
}
