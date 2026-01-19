import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const inferredBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}` : "");
const basePath = inferredBasePath === "/" ? "" : inferredBasePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  typescript: { ignoreBuildErrors: true },
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
