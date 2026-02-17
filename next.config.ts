import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: "/_expo/:path*",
        has: [{ type: "host", value: "app.dailycheck.ch" }],
        destination: "/_expo/:path*",
      },
      {
        source: "/assets/:path*",
        has: [{ type: "host", value: "app.dailycheck.ch" }],
        destination: "/assets/:path*",
      },
      {
        source: "/favicon.ico",
        has: [{ type: "host", value: "app.dailycheck.ch" }],
        destination: "/favicon.ico",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "app.dailycheck.ch" }],
        destination: "/app-index.html",
      },
    ];
  },
};

export default nextConfig;
