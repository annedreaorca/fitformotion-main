import withPWAInit from "@ducanh2912/next-pwa";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unwzztwkcbisuiue.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  reactStrictMode: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        type: 'asset/resource', // Use Webpack's built-in asset module for images
        generator: {
          filename: 'static/media/[name].[contenthash][ext][query]', // Versioned image filenames
        },
      });
    }
    return config;
  },
};

const withPWA = withPWAInit({
  dest: "public", // Directory for service worker and PWA files
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // Set to `true` to disable PWA features for development
  workboxOptions: {
    disableDevLogs: true, // Disable dev logs for Workbox
    runtimeCaching: [
      {
        urlPattern: /\/_next\/static\//, // Catch all Next.js static files
        handler: 'StaleWhileRevalidate', // Cache and update in the background
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
          },
        },
      },
      {
        urlPattern: /.*\.(?:jpg|jpeg|png|gif|svg)$/i, // For images
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 365, // Cache images for 1 year
          },
        },
      },
    ],
  },
});

// Export the config with PWA functionality
export default withPWA(nextConfig);
