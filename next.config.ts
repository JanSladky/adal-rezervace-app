import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  experimental: {
    serverActions: true,
  },
  runtime: "nodejs", // Ne "edge"
};

export default nextConfig;
