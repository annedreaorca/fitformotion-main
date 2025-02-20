self.__WB_DISABLE_DEV_LOGS = true;

const CACHE_ASSETS = "app-assets-cache";
const CACHE_API = "app-api-cache";
const CACHE_OFFLINE = "offline-cache";
const OFFLINE_FALLBACK_PAGE = "/offline.html"; // Make sure this file exists!

// Import Workbox only when needed
if (typeof workbox === "undefined") {
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");
}

if (workbox) {
  // Precache files from Workbox Manifest
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Install event: Cache the offline fallback page
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_OFFLINE).then((cache) => cache.add(OFFLINE_FALLBACK_PAGE))
    );
    self.skipWaiting();
  });

  // Cache static assets
  workbox.routing.registerRoute(
    /\.(js|css|html|jpg|jpeg|png|svg|ico)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_ASSETS,
      plugins: [
        new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
        new workbox.expiration.Plugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }),
      ],
    })
  );

  // Cache dynamic routes (dashboard, profile, etc.)
  workbox.routing.registerRoute(
    new RegExp("/(dashboard|profile|.*)"),
    new workbox.strategies.NetworkFirst({
      cacheName: "dynamic-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
        new workbox.expiration.Plugin({ maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 }),
      ],
    })
  );

  // Background sync for failed API requests
  if (workbox.backgroundSync) {
    const syncQueue = new workbox.backgroundSync.Queue("syncQueue");

    workbox.routing.registerRoute(
      new RegExp("/api/.*"),
      new workbox.strategies.NetworkOnly({
        plugins: [
          new workbox.backgroundSync.Plugin("syncQueue", { maxRetentionTime: 24 * 60 }),
        ],
      }),
      ["POST", "PUT", "PATCH", "DELETE"]
    );
  }

  // Serve offline page for navigation requests
  self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(OFFLINE_FALLBACK_PAGE))
      );
    }
  });

  // Enable navigation preload if supported
  if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
  }

  // Clean up old caches
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_ASSETS, CACHE_API, CACHE_OFFLINE].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
    );
  });

  self.clients.claim();
}
