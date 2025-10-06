import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com"], // 👈 add this line
  },
};

export default nextConfig;
