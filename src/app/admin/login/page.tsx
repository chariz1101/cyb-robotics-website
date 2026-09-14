import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const { error } = await props.searchParams;

  return (
    <div
      className="flex flex-1 items-center justify-center bg-ink px-6 py-15"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(246,246,241,0.028) 0 12px, transparent 12px 24px)",
      }}
    >
      <div className="w-full max-w-[400px]">
        <div className="mb-7.5 flex flex-col items-center gap-3">
          <Image
            src="/cyb-logo.png"
            alt=""
            width={60}
            height={60}
            priority
            className="h-15 w-15 object-contain"
          />
          <p className="label text-[11px] tracking-[0.2em] text-brand-soft">
            Cyb Robotics Admin
          </p>
        </div>

        <div className="bg-canvas p-8">
          <LoginForm
            initialError={
              error === "not-admin"
                ? "That account is not registered as an administrator."
                : undefined
            }
          />
          <Link
            href="/"
            className="mt-2.5 block w-full py-2.5 text-center font-label text-[11px] uppercase tracking-[0.08em] text-muted hover:text-ink"
          >
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
