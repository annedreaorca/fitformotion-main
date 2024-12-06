self.__WB_DISABLE_DEV_LOGS = true;

// Cache name
const CACHE_NAME = "pwabuilder-offline-page";

// URL to your offline page
const OFFLINE_FALLBACK_PAGE = "/offline.html";

// Import Workbox libraries
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// Precache any files listed during the Workbox build process
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Add event listener to skip waiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Install event: cache the offline fallback page
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_FALLBACK_PAGE))
  );
});

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Register route for navigation requests
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_NAME,
  })
);

// Fetch event: serve offline page if the fetch fails
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try the network
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Fallback to offline page
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_FALLBACK_PAGE);
        }
      })()
    );
  }
});
