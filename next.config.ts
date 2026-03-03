import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.space.rakuten.co.jp',
      },
    ],
  },
}

export default nextConfig;
