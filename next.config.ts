import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/FR", permanent: false }];
  },
  reactCompiler: true,
};

export default nextConfig;