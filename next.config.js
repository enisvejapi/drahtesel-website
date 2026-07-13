/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Legacy Supabase Storage URLs still in DB — keep until all bikes re-uploaded locally
        protocol: 'https',
        hostname: 'bqtyoujkaycqejoqahjj.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
}

module.exports = nextConfig
