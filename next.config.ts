// next.config.ts
import type { NextConfig } from "next";
import '@/styles/globals.css'

const nextConfig: NextConfig = {
  images: {
    domains: ["images.ctfassets.net"], // <-- allow Contentful CDN host
  },
};

export default nextConfig;
