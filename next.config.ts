import type { NextConfig } from "next";

/**
 * next/image needs an explicit allowlist for remote hosts, so photos
 * served from Supabase Storage would otherwise have to be plain <img>
 * tags — downloading a 1400px upload into a 220px card.
 *
 * The host is derived from the Supabase URL rather than hard-coded, so
 * this keeps working if the project is ever moved or recreated.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? URL.parse(process.env.NEXT_PUBLIC_SUPABASE_URL)?.hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
