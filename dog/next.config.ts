import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: "export",
  images: {
    unoptimized: true,
  },
  // Generate trailing-slash URLs (works better with Cloudflare static hosting)
  trailingSlash: true,
};

export default nextConfig;
