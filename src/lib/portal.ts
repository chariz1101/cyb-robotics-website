import { notFound } from "next/navigation";

/**
 * The unlisted members portal lives at /members-portal/<secret>.
 *
 * Access control is the unguessable URL, not authentication — that is the
 * product decision recorded in the SRS. This helper is the single place
 * that decides whether a slug is the real one.
 */
export function assertPortalSlug(slug: string) {
  const secret = portalSlug();

  // With no secret configured every guess would otherwise be accepted, so
  // failing closed is the only safe default.
  if (!secret || slug !== secret) notFound();
}

/**
 * The secret slug, taken as the last path segment of the configured value.
 *
 * env.local.example documents this as the value in
 * "/members-portal/<this-value>", and it is just as natural to paste the
 * whole path in. Both spellings — and stray slashes — resolve to the same
 * slug here, rather than silently 404ing the entire portal in a way that
 * looks like a code bug.
 */
export function portalSlug() {
  const raw = process.env.MEMBERS_PAGE_SECRET_SLUG ?? "";
  const segments = raw.split("/").filter(Boolean);
  return segments.at(-1) ?? "";
}

export function portalPath(...segments: string[]) {
  return ["/members-portal", portalSlug(), ...segments].join("/");
}
