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

// Cache dynamic pages after login (e.g., /dashboard)
self.addEventListener('fetch', (event) => {
  // Handle protected pages
  if (event.request.url.includes('/dashboard') || event.request.url.includes('/profile')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_ASSETS);

        // Try fetching from the network first
        try {
          const networkResp = await fetch(event.request);

          // If network is successful, cache the response for offline use
          cache.put(event.request, networkResp.clone());

          return networkResp;
        } catch (error) {
          // If offline, serve from cache
          const cachedResp = await cache.match(event.request);
          if (cachedResp) {
            return cachedResp;
          }

          // If no cached version is available, return offline page
          return caches.match(OFFLINE_FALLBACK_PAGE);
        }
      })()
    );
  }

  // Serve fallback page for navigation requests if offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE_ASSETS);
          const cachedResp = await cache.match(event.request);
          return cachedResp || caches.match(OFFLINE_FALLBACK_PAGE); // Fallback to offline page
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
