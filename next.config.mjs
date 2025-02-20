import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  // Removed workboxOptions to avoid conflicts with custom service worker
  swSrc: "custom-sw.js", // Ensure this file is in the root or src/
  swDest: "public/sw.js",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unwzztwkcbisuiue.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true, // Keep this enabled for debugging
};

export default withPWA(nextConfig);
