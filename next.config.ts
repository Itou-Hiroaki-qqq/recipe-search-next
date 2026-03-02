import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.space.rakuten.co.jp',
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig;
