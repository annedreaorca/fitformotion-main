self.__WB_DISABLE_DEV_LOGS = true;

const CACHE = "pwabuilder-offline-page";
const OFFLINE_FALLBACK_PAGE = "/offline.html";

// Import Workbox libraries
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// Precache files automatically injected by Workbox
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Install event: Cache the offline fallback page
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(OFFLINE_FALLBACK_PAGE))
  );
});

// Background Sync setup
if (workbox.backgroundSync) {
  const syncQueue = new workbox.backgroundSync.Queue('syncQueue');
  
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),  // Adjust this to the API endpoints you need to sync
    new workbox.strategies.NetworkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('syncQueue', {
          maxRetentionTime: 24 * 60 // Retry for up to 24 hours
        })
      ]
    }),
    'POST' // Only POST requests will trigger background sync
  );
}

// Periodic Sync setup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(syncData());
  }
});

// Sync Data function (periodic sync)
async function syncData() {
  const cache = await caches.open(CACHE);
  // Add logic to sync cached data to the server here
  // You could perform a network request here to send data back to the server
}

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Serve fallback page when offline (for navigation requests)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) return preloadResp;

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(OFFLINE_FALLBACK_PAGE);
          return cachedResp || Response.error();
        }
      })()
    );
  }
});

// Register a route for static assets (e.g., HTML, JS, CSS)
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
);

// Push notification event handler (for future use if needed)
self.addEventListener('push', (event) => {
  // Handle push notifications if needed
  console.log('Push event received:', event);
});
