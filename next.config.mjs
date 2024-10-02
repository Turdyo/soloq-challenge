/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "raw.communitydragon.org"
      }
    ]
  }
}

export default nextConfig
