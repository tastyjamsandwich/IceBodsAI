/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ["@radix-ui/react-tabs"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'prisma', '@prisma/client']
    }
    return config
  },
}

module.exports = nextConfig
