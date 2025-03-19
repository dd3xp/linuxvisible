import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  // 打包相关配置
  // output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
