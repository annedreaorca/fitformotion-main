self.__WB_DISABLE_DEV_LOGS = true;

const CACHE_ASSETS = "app-assets-cache";
const CACHE_API = "app-api-cache";
const CACHE_OFFLINE = "offline-cache";
const OFFLINE_FALLBACK_PAGE = "/offline.html";

// Import Workbox libraries
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// Precache files automatically injected by Workbox
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Install event: Cache the offline fallback page
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE_OFFLINE).then((cache) => cache.add(OFFLINE_FALLBACK_PAGE))
  );
});

// Cache static assets (e.g., JS, CSS, images)
workbox.routing.registerRoute(
  new RegExp('/.*\.(js|css|html|jpg|jpeg|png|svg|ico)$'), // Match static assets
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_ASSETS,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // Cache assets for 1 week
        maxEntries: 50,
      }),
    ],
  })
);

// Cache dynamic content like the dashboard or user pages
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try fetching from the network
          const networkResp = await fetch(event.request);
          // Update the cache with the network response
          const cache = await caches.open(CACHE_ASSETS);
          cache.put(event.request, networkResp.clone());
          return networkResp;
        } catch (error) {
          // If network fails, attempt to serve from cache
          const cache = await caches.open(CACHE_ASSETS);
          const cachedResp = await cache.match(event.request);
          if (cachedResp) {
            return cachedResp;
          }
          // If no cache, return the offline page
          return caches.match(OFFLINE_FALLBACK_PAGE);
        }
      })()
    );
  }
});

// Background Sync setup (for API requests that fail while offline)
if (workbox.backgroundSync) {
  const syncQueue = new workbox.backgroundSync.Queue('syncQueue');
  
  // Register the route for API endpoints needing sync
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),  // Adjust this to the API endpoints you need to sync
    new workbox.strategies.NetworkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('syncQueue', {
          maxRetentionTime: 24 * 60 // Retry for up to 24 hours
        })
      ]
    }),
    ['POST', 'PUT', 'PATCH', 'DELETE'] // Include methods that should trigger background sync
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
  const cache = await caches.open(CACHE_API);
  // Logic for syncing cached data with the server
  // You could perform a network request here to send data back to the server
}

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Push notification event handler (for future use if needed)
self.addEventListener('push', (event) => {
  // Handle push notifications if needed
  console.log('Push event received:', event);
});

// Handle cache expiration and cleanup
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_ASSETS, CACHE_API, CACHE_OFFLINE];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            // Delete outdated caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
