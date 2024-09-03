// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  images:{
    remotePatterns: [
      {
        hostname: 'uts.io'
      }
    ]
  }
};

export default nextConfig;
