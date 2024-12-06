self.__WB_DISABLE_DEV_LOGS = true;

const CACHE_ASSETS = "fitformotion-assets";
const CACHE_API = "fitformotion-api";
const CACHE_OFFLINE = "fitformotion-offline-page";
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

// Cache static assets (HTML, JS, CSS, images) with StaleWhileRevalidate
workbox.routing.registerRoute(
  new RegExp("/.*"), // Match all routes for caching
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_ASSETS,
  })
);

// Cache API requests for offline usage (for dynamic content)
workbox.routing.registerRoute(
  new RegExp('/api/.*'),  // Adjust this to the API endpoints you need to sync
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_API,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],  // Cache successful responses
      })
    ]
  })
);

// Background Sync setup for API calls (optional)
if (workbox.backgroundSync) {
  const syncQueue = new workbox.backgroundSync.Queue('syncQueue');
  
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),
    new workbox.strategies.NetworkOnly({
      plugins: [
        new workbox.backgroundSync.Plugin('syncQueue', {
          maxRetentionTime: 24 * 60 // Retry for up to 24 hours
        })
      ]
    }),
    ['POST', 'PUT', 'PATCH', 'DELETE'] // Allow these methods to trigger background sync
  );
}

// Serve fallback page when offline (for navigation requests)
self.addEventListener("fetch", (event) => {
  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First try to fetch the page from the network
          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          // If network request fails (offline), fallback to cached page
          const cache = await caches.open(CACHE_ASSETS);
          const cachedResp = await cache.match(event.request);
          return cachedResp || caches.match(OFFLINE_FALLBACK_PAGE); // Fallback to offline page if no match
        }
      })()
    );
  }

  // Optionally, add logic for other resources (e.g., images, CSS) to cache them
  if (event.request.url.includes('.html') || event.request.url.includes('.js') || event.request.url.includes('.css')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Push notification event handler (for future use if needed)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
});
