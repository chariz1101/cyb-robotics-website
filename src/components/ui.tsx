import type { ReactNode } from "react";

/** Standard page header: eyebrow label over a 46px title. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className="label text-brand">{eyebrow}</p>
      <h1 className="mt-3.5 max-w-[22ch] text-[36px] sm:text-[44px] lg:text-[52px]">
        {title}
      </h1>
      {children}
    </>
  );
}

/** Section heading that sits on a hairline rule, with optional right slot. */
export function SectionRule({
  children,
  aside,
  className = "",
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 border-b border-ink/14 pb-3.5 ${className}`}
    >
      <h2 className="font-label text-xs uppercase tracking-[0.14em] text-brand">
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** Hatched image placeholder, used wherever a photo has not been uploaded. */
export function Placeholder({
  label,
  className = "",
  style,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`hatch flex items-center justify-center ${className}`}
    >
      <span className="label-sm text-muted">{label}</span>
    </div>
  );
}

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`border border-ink/12 bg-surface ${
        interactive ? "transition-colors hover:border-brand" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-ink/14 bg-surface-alt/60 px-6 py-12 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function initialsOf(name: string) {
  return name
    .replace(/^Engr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Compact horizontal card for the general membership grid. */
export function MemberChip({
  name,
  meta,
}: {
  name: string;
  meta?: string | null;
}) {
  return (
    <Card className="flex items-center gap-3.5 p-4">
      <span className="flex h-[46px] w-[46px] flex-none items-center justify-center bg-brand-wash text-sm font-semibold text-brand">
        {initialsOf(name)}
      </span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-semibold tracking-[-0.005em]">
          {name}
        </span>
        {meta && (
          <span className="mt-1.5 block font-label text-[10.5px] tracking-[0.06em] text-muted">
            {meta}
          </span>
        )}
      </span>
    </Card>
  );
}
