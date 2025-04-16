import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable images from http://localhost:5000/uploads/...
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
