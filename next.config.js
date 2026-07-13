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
        protocol: 'https',
        hostname: 'bqtyoujkaycqejoqahjj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.drahteselnorderney.de',
      },
    ],
  },
}

module.exports = nextConfig
