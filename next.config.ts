// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.scdn.co", "mosaic.scdn.co"],
  },
  experimental: {
    // @ts-expect-error — типы Next.js 15.4 ещё не знают этого поля
    allowedDevOrigins: ["http://127.0.0.1:3000"],
  },
};

export default nextConfig;
