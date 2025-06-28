/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove any image domain restrictions that might cause issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
