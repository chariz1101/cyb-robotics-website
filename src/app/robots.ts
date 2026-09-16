import type { MetadataRoute } from "next";

/**
 * The members portal and the admin dashboard are kept out of search.
 *
 * For /admin this is tidiness — it is behind auth. For /members-portal it
 * is part of the access model: the page is protected by an unguessable
 * URL, and an indexed URL is no longer unguessable. The disallow is a
 * prefix so the secret slug never appears in robots.txt, which is itself
 * a public file.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/members-portal"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
