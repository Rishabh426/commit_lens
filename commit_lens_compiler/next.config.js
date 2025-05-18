/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ["tree-sitter", "tree-sitter-c", "tree-sitter-cpp"]
  }
};

module.exports = nextConfig;