import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ["tree-sitter", "tree-sitter-c", "tree-sitter-cpp"]
  }
};

export default nextConfig;
