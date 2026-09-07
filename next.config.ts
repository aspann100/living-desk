import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next-mdx-remote needs transpile under Turbopack / Next 16
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
