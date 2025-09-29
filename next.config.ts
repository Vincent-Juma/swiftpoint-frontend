import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❗ tells Vercel / next build not to block on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
