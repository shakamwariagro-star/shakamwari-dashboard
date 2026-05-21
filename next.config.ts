import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
  },
  // Send anything that used to be the React dashboard to the client-approved HTML.
  async redirects() {
    return [
      { source: '/login',              destination: '/lab-dashboard.html', permanent: false },
      { source: '/dashboard',          destination: '/lab-dashboard.html', permanent: false },
      { source: '/dashboard/:path*',   destination: '/lab-dashboard.html', permanent: false },
      { source: '/coordinator',        destination: '/lab-dashboard.html', permanent: false },
      { source: '/coordinator/:path*', destination: '/lab-dashboard.html', permanent: false },
      { source: '/expert',             destination: '/lab-dashboard.html', permanent: false },
      { source: '/expert/:path*',      destination: '/lab-dashboard.html', permanent: false },
    ];
  },
};

export default nextConfig;
