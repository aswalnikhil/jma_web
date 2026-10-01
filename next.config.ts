import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tailwind's CSS is small; inlining it removes the render-blocking
    // stylesheet request and improves FCP/LCP for first-time visitors.
    inlineCss: true,
  },
};

export default nextConfig;
