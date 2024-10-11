/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ["@radix-ui/react-tabs"],
  output: 'standalone',
}

module.exports = nextConfig
