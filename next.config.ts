import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
