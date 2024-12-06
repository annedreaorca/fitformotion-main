self.__WB_DISABLE_DEV_LOGS = true;

const CACHE = "pwabuilder-offline-page";
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js");

// Precache files automatically injected by Workbox
if (workbox) {
  workbox.setConfig({ debug: false });

  const offlineFallbackPage = "/offline.html";
  
  // Precache and route
  workbox.precaching.precacheAndRoute([
    { url: offlineFallbackPage, revision: '1' },
  ]);

  // Offline fallback
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });

  self.addEventListener("install", async (event) => {
    event.waitUntil(
      caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
    );
  });

  if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
  }

  // Register route for navigation
  workbox.routing.registerRoute(
    new RegExp(".*"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE,
    })
  );

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
            const cachedResp = await cache.match(offlineFallbackPage);
            return cachedResp || Response.error();
          }
        })()
      );
    }
  });
} else {
  console.error("Workbox failed to load.");
}
