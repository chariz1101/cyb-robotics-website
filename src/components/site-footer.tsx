import Link from "next/link";

const SOCIALS = [
  { href: "https://www.facebook.com/", label: "Facebook" },
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://github.com/", label: "GitHub" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-deep text-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-base font-bold">CYB Robotics Organization</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-soft">
            CICT · WVSU · La Paz, Iloilo City
          </p>
        </div>

        <div>
          <p className="eyebrow-on-dark">Connect</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-soft transition-colors hover:text-canvas"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="mailto:cybrobotics@wvsu.edu.ph"
                className="text-brand-soft transition-colors hover:text-canvas"
              >
                cybrobotics@wvsu.edu.ph
              </a>
            </li>
            <li className="text-brand-mid">CICT Building, Room 204</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow-on-dark">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["about", "projects", "events"].map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="capitalize text-brand-soft transition-colors hover:text-canvas"
                >
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-brand-mid">
          &copy; {new Date().getFullYear()} CYB Robotics Organization. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
