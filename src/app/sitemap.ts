import type { MetadataRoute } from "next";

/**
 * Public routes only.
 *
 * /portal and /admin are deliberately absent: listing the portal would
 * publish the secret slug that is its only access control.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = ["", "/about", "/officers", "/alumni", "/projects", "/events"];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
