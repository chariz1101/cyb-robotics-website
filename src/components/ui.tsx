import type { ReactNode } from "react";

/**
 * Shared primitives.
 *
 * The canvas motifs live here so pages don't restate them: 2px corners,
 * hairline borders instead of shadows, and wide-tracked uppercase
 * eyebrows above section headings.
 */

export function Section({
  eyebrow,
  title,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  tone?: "light" | "alt" | "deep";
}) {
  const tones = {
    light: "bg-canvas text-ink",
    alt: "bg-surface-alt text-ink",
    deep: "bg-brand-deep text-canvas",
  } as const;

  return (
    <section className={tones[tone]}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {eyebrow && (
          <p className={tone === "deep" ? "eyebrow-on-dark" : "eyebrow"}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2
            className={`mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl ${
              tone === "deep" ? "text-canvas" : "text-ink-strong"
            }`}
          >
            {title}
          </h2>
        )}
        <div className={eyebrow || title ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-line bg-surface p-6 ${className}`}
      style={{ borderRadius: "var(--radius-sharp)" }}
    >
      {children}
    </div>
  );
}

export function PersonCard({
  name,
  role,
  detail,
  photoUrl,
}: {
  name: string;
  role?: string | null;
  detail?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <Card className="flex flex-col items-start gap-4">
      {photoUrl ? (
        // Supabase Storage hosts these; switch to next/image once the bucket
        // domain is added to images.remotePatterns in next.config.ts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt=""
          className="h-20 w-20 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt font-display text-lg font-semibold text-brand"
        >
          {name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </div>
      )}
      <div>
        <p className="font-display font-semibold text-ink-strong">{name}</p>
        {role && <p className="mt-1 text-sm text-brand">{role}</p>}
        {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
      </div>
    </Card>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div
      className="border border-dashed border-line bg-surface-sunk px-6 py-12 text-center text-sm text-muted"
      style={{ borderRadius: "var(--radius-sharp)" }}
    >
      {children}
    </div>
  );
}

export function Button({
  href,
  children,
  tone = "solid",
}: {
  href: string;
  children: ReactNode;
  tone?: "solid" | "outline";
}) {
  const tones = {
    solid: "bg-brand text-canvas hover:bg-brand-deep",
    outline: "border border-brand text-brand hover:bg-brand hover:text-canvas",
  } as const;

  return (
    <a
      href={href}
      className={`inline-block px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${tones[tone]}`}
      style={{ borderRadius: "var(--radius-sharp)" }}
    >
      {children}
    </a>
  );
}
