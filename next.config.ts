import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  redirects: async () => [
    {
      source: "/home",
      destination: "/",
      permanent: true,
    },
  ],
  rewrites: async () => [
    {
      source: "/",
      destination: "/home",
    },
  ],
};

export default nextConfig;
