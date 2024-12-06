import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    swSrc: "public/custom-sw.js", // Custom service worker source
    swDest: "public/sw.js",      // Output service worker file
    include: [/\.html$/, /\.js$/, /\.css$/, /\.png$/, /\.jpg$/, /\.svg$/, /\.json$/, /\.ts$/, /\.tsx$/, /\.gif$/, /\.mp4$/, /\.webp$/], // Files to precache
  },
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
  reactStrictMode: false,
};

export default withPWA(nextConfig);
