/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/custom-sw.js":
/*!*****************************!*\
  !*** ./public/custom-sw.js ***!
  \*****************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("self.__WB_DISABLE_DEV_LOGS = true;\nconst CACHE_ASSETS = \"app-assets-cache\";\nconst CACHE_API = \"app-api-cache\";\nconst CACHE_OFFLINE = \"offline-cache\";\nconst OFFLINE_FALLBACK_PAGE = \"/offline.html\";\n// Import Workbox libraries\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js\");\n// Precache files automatically injected by Workbox\nworkbox.precaching.precacheAndRoute([] || []);\n// Install event: Cache the offline fallback page\nself.addEventListener(\"install\", async (event)=>{\n    event.waitUntil(caches.open(CACHE_OFFLINE).then((cache)=>cache.add(OFFLINE_FALLBACK_PAGE)));\n});\n// Cache static assets (e.g., JS, CSS, images)\nworkbox.routing.registerRoute(new RegExp(\"/.*.(js|css|html|jpg|jpeg|png|svg|ico)$\"), new workbox.strategies.StaleWhileRevalidate({\n    cacheName: CACHE_ASSETS,\n    plugins: [\n        new workbox.cacheableResponse.Plugin({\n            statuses: [\n                0,\n                200\n            ]\n        }),\n        new workbox.expiration.Plugin({\n            maxAgeSeconds: 60 * 60 * 24 * 7,\n            maxEntries: 50\n        })\n    ]\n}));\n// Cache dynamic content like the dashboard or user pages\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        event.respondWith((async ()=>{\n            try {\n                // Try fetching from the network\n                const networkResp = await fetch(event.request);\n                // Update the cache with the network response\n                const cache = await caches.open(CACHE_ASSETS);\n                cache.put(event.request, networkResp.clone());\n                return networkResp;\n            } catch (error) {\n                // If network fails, attempt to serve from cache\n                const cache = await caches.open(CACHE_ASSETS);\n                const cachedResp = await cache.match(event.request);\n                if (cachedResp) {\n                    return cachedResp;\n                }\n                // If no cache, return the offline page\n                return caches.match(OFFLINE_FALLBACK_PAGE);\n            }\n        })());\n    }\n});\n// Background Sync setup (for API requests that fail while offline)\nif (workbox.backgroundSync) {\n    const syncQueue = new workbox.backgroundSync.Queue(\"syncQueue\");\n    // Register the route for API endpoints needing sync\n    workbox.routing.registerRoute(new RegExp(\"/api/.*\"), new workbox.strategies.NetworkOnly({\n        plugins: [\n            new workbox.backgroundSync.Plugin(\"syncQueue\", {\n                maxRetentionTime: 24 * 60 // Retry for up to 24 hours\n            })\n        ]\n    }), [\n        \"POST\",\n        \"PUT\",\n        \"PATCH\",\n        \"DELETE\"\n    ] // Include methods that should trigger background sync\n    );\n}\n// Periodic Sync setup\nself.addEventListener(\"periodicsync\", (event)=>{\n    if (event.tag === \"syncData\") {\n        event.waitUntil(syncData());\n    }\n});\n// Sync Data function (periodic sync)\nasync function syncData() {\n    const cache = await caches.open(CACHE_API);\n// Logic for syncing cached data with the server\n// You could perform a network request here to send data back to the server\n}\n// Enable navigation preload if supported\nif (workbox.navigationPreload.isSupported()) {\n    workbox.navigationPreload.enable();\n}\n// Push notification event handler (for future use if needed)\nself.addEventListener(\"push\", (event)=>{\n    // Handle push notifications if needed\n    console.log(\"Push event received:\", event);\n});\n// Handle cache expiration and cleanup\nself.addEventListener(\"activate\", (event)=>{\n    const currentCaches = [\n        CACHE_ASSETS,\n        CACHE_API,\n        CACHE_OFFLINE\n    ];\n    event.waitUntil(caches.keys().then((cacheNames)=>{\n        return Promise.all(cacheNames.map((cacheName)=>{\n            if (!currentCaches.includes(cacheName)) {\n                // Delete outdated caches\n                return caches.delete(cacheName);\n            }\n        }));\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQSx5Q0FBeUM7QUFDekMsSUFBSUksUUFBUTBDLGlCQUFpQixDQUFDQyxXQUFXLElBQUk7SUFDM0MzQyxRQUFRMEMsaUJBQWlCLENBQUNFLE1BQU07QUFDbEM7QUFFQSw2REFBNkQ7QUFDN0RuRCxLQUFLVyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUNDO0lBQzdCLHNDQUFzQztJQUN0Q3dDLFFBQVFDLEdBQUcsQ0FBQyx3QkFBd0J6QztBQUN0QztBQUVBLHNDQUFzQztBQUN0Q1osS0FBS1csZ0JBQWdCLENBQUMsWUFBWSxDQUFDQztJQUNqQyxNQUFNMEMsZ0JBQWdCO1FBQUNwRDtRQUFjQztRQUFXQztLQUFjO0lBRTlEUSxNQUFNQyxTQUFTLENBQ2JDLE9BQU95QyxJQUFJLEdBQUd2QyxJQUFJLENBQUMsQ0FBQ3dDO1FBQ2xCLE9BQU9DLFFBQVFDLEdBQUcsQ0FDaEJGLFdBQVdHLEdBQUcsQ0FBQyxDQUFDbkM7WUFDZCxJQUFJLENBQUM4QixjQUFjTSxRQUFRLENBQUNwQyxZQUFZO2dCQUN0Qyx5QkFBeUI7Z0JBQ3pCLE9BQU9WLE9BQU8rQyxNQUFNLENBQUNyQztZQUN2QjtRQUNGO0lBRUo7QUFFSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wdWJsaWMvY3VzdG9tLXN3LmpzPzgwZDQiXSwic291cmNlc0NvbnRlbnQiOlsic2VsZi5fX1dCX0RJU0FCTEVfREVWX0xPR1MgPSB0cnVlO1xyXG5cclxuY29uc3QgQ0FDSEVfQVNTRVRTID0gXCJhcHAtYXNzZXRzLWNhY2hlXCI7XHJcbmNvbnN0IENBQ0hFX0FQSSA9IFwiYXBwLWFwaS1jYWNoZVwiO1xyXG5jb25zdCBDQUNIRV9PRkZMSU5FID0gXCJvZmZsaW5lLWNhY2hlXCI7XHJcbmNvbnN0IE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSA9IFwiL29mZmxpbmUuaHRtbFwiO1xyXG5cclxuLy8gSW1wb3J0IFdvcmtib3ggbGlicmFyaWVzXHJcbmltcG9ydFNjcmlwdHMoXCJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vd29ya2JveC1jZG4vcmVsZWFzZXMvNS4xLjIvd29ya2JveC1zdy5qc1wiKTtcclxuXHJcbi8vIFByZWNhY2hlIGZpbGVzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYnkgV29ya2JveFxyXG53b3JrYm94LnByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZShzZWxmLl9fV0JfTUFOSUZFU1QgfHwgW10pO1xyXG5cclxuLy8gSW5zdGFsbCBldmVudDogQ2FjaGUgdGhlIG9mZmxpbmUgZmFsbGJhY2sgcGFnZVxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnN0YWxsXCIsIGFzeW5jIChldmVudCkgPT4ge1xyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIGNhY2hlcy5vcGVuKENBQ0hFX09GRkxJTkUpLnRoZW4oKGNhY2hlKSA9PiBjYWNoZS5hZGQoT0ZGTElORV9GQUxMQkFDS19QQUdFKSlcclxuICApO1xyXG59KTtcclxuXHJcbi8vIENhY2hlIHN0YXRpYyBhc3NldHMgKGUuZy4sIEpTLCBDU1MsIGltYWdlcylcclxud29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgbmV3IFJlZ0V4cCgnLy4qXFwuKGpzfGNzc3xodG1sfGpwZ3xqcGVnfHBuZ3xzdmd8aWNvKSQnKSwgLy8gTWF0Y2ggc3RhdGljIGFzc2V0c1xyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuU3RhbGVXaGlsZVJldmFsaWRhdGUoe1xyXG4gICAgY2FjaGVOYW1lOiBDQUNIRV9BU1NFVFMsXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5ldyB3b3JrYm94LmNhY2hlYWJsZVJlc3BvbnNlLlBsdWdpbih7XHJcbiAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxyXG4gICAgICB9KSxcclxuICAgICAgbmV3IHdvcmtib3guZXhwaXJhdGlvbi5QbHVnaW4oe1xyXG4gICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDcsIC8vIENhY2hlIGFzc2V0cyBmb3IgMSB3ZWVrXHJcbiAgICAgICAgbWF4RW50cmllczogNTAsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICB9KVxyXG4pO1xyXG5cclxuLy8gQ2FjaGUgZHluYW1pYyBjb250ZW50IGxpa2UgdGhlIGRhc2hib2FyZCBvciB1c2VyIHBhZ2VzXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCAoZXZlbnQpID0+IHtcclxuICBpZiAoZXZlbnQucmVxdWVzdC5tb2RlID09PSAnbmF2aWdhdGUnKSB7XHJcbiAgICBldmVudC5yZXNwb25kV2l0aChcclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgLy8gVHJ5IGZldGNoaW5nIGZyb20gdGhlIG5ldHdvcmtcclxuICAgICAgICAgIGNvbnN0IG5ldHdvcmtSZXNwID0gYXdhaXQgZmV0Y2goZXZlbnQucmVxdWVzdCk7XHJcbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIGNhY2hlIHdpdGggdGhlIG5ldHdvcmsgcmVzcG9uc2VcclxuICAgICAgICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oQ0FDSEVfQVNTRVRTKTtcclxuICAgICAgICAgIGNhY2hlLnB1dChldmVudC5yZXF1ZXN0LCBuZXR3b3JrUmVzcC5jbG9uZSgpKTtcclxuICAgICAgICAgIHJldHVybiBuZXR3b3JrUmVzcDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgLy8gSWYgbmV0d29yayBmYWlscywgYXR0ZW1wdCB0byBzZXJ2ZSBmcm9tIGNhY2hlXHJcbiAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKENBQ0hFX0FTU0VUUyk7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZWRSZXNwID0gYXdhaXQgY2FjaGUubWF0Y2goZXZlbnQucmVxdWVzdCk7XHJcbiAgICAgICAgICBpZiAoY2FjaGVkUmVzcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkUmVzcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIElmIG5vIGNhY2hlLCByZXR1cm4gdGhlIG9mZmxpbmUgcGFnZVxyXG4gICAgICAgICAgcmV0dXJuIGNhY2hlcy5tYXRjaChPRkZMSU5FX0ZBTExCQUNLX1BBR0UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkoKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gQmFja2dyb3VuZCBTeW5jIHNldHVwIChmb3IgQVBJIHJlcXVlc3RzIHRoYXQgZmFpbCB3aGlsZSBvZmZsaW5lKVxyXG5pZiAod29ya2JveC5iYWNrZ3JvdW5kU3luYykge1xyXG4gIGNvbnN0IHN5bmNRdWV1ZSA9IG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlF1ZXVlKCdzeW5jUXVldWUnKTtcclxuICBcclxuICAvLyBSZWdpc3RlciB0aGUgcm91dGUgZm9yIEFQSSBlbmRwb2ludHMgbmVlZGluZyBzeW5jXHJcbiAgd29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgICBuZXcgUmVnRXhwKCcvYXBpLy4qJyksICAvLyBBZGp1c3QgdGhpcyB0byB0aGUgQVBJIGVuZHBvaW50cyB5b3UgbmVlZCB0byBzeW5jXHJcbiAgICBuZXcgd29ya2JveC5zdHJhdGVnaWVzLk5ldHdvcmtPbmx5KHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlBsdWdpbignc3luY1F1ZXVlJywge1xyXG4gICAgICAgICAgbWF4UmV0ZW50aW9uVGltZTogMjQgKiA2MCAvLyBSZXRyeSBmb3IgdXAgdG8gMjQgaG91cnNcclxuICAgICAgICB9KVxyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgIFsnUE9TVCcsICdQVVQnLCAnUEFUQ0gnLCAnREVMRVRFJ10gLy8gSW5jbHVkZSBtZXRob2RzIHRoYXQgc2hvdWxkIHRyaWdnZXIgYmFja2dyb3VuZCBzeW5jXHJcbiAgKTtcclxufVxyXG5cclxuLy8gUGVyaW9kaWMgU3luYyBzZXR1cFxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3BlcmlvZGljc3luYycsIChldmVudCkgPT4ge1xyXG4gIGlmIChldmVudC50YWcgPT09ICdzeW5jRGF0YScpIHtcclxuICAgIGV2ZW50LndhaXRVbnRpbChzeW5jRGF0YSgpKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gU3luYyBEYXRhIGZ1bmN0aW9uIChwZXJpb2RpYyBzeW5jKVxyXG5hc3luYyBmdW5jdGlvbiBzeW5jRGF0YSgpIHtcclxuICBjb25zdCBjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKENBQ0hFX0FQSSk7XHJcbiAgLy8gTG9naWMgZm9yIHN5bmNpbmcgY2FjaGVkIGRhdGEgd2l0aCB0aGUgc2VydmVyXHJcbiAgLy8gWW91IGNvdWxkIHBlcmZvcm0gYSBuZXR3b3JrIHJlcXVlc3QgaGVyZSB0byBzZW5kIGRhdGEgYmFjayB0byB0aGUgc2VydmVyXHJcbn1cclxuXHJcbi8vIEVuYWJsZSBuYXZpZ2F0aW9uIHByZWxvYWQgaWYgc3VwcG9ydGVkXHJcbmlmICh3b3JrYm94Lm5hdmlnYXRpb25QcmVsb2FkLmlzU3VwcG9ydGVkKCkpIHtcclxuICB3b3JrYm94Lm5hdmlnYXRpb25QcmVsb2FkLmVuYWJsZSgpO1xyXG59XHJcblxyXG4vLyBQdXNoIG5vdGlmaWNhdGlvbiBldmVudCBoYW5kbGVyIChmb3IgZnV0dXJlIHVzZSBpZiBuZWVkZWQpXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIChldmVudCkgPT4ge1xyXG4gIC8vIEhhbmRsZSBwdXNoIG5vdGlmaWNhdGlvbnMgaWYgbmVlZGVkXHJcbiAgY29uc29sZS5sb2coJ1B1c2ggZXZlbnQgcmVjZWl2ZWQ6JywgZXZlbnQpO1xyXG59KTtcclxuXHJcbi8vIEhhbmRsZSBjYWNoZSBleHBpcmF0aW9uIGFuZCBjbGVhbnVwXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhdGUnLCAoZXZlbnQpID0+IHtcclxuICBjb25zdCBjdXJyZW50Q2FjaGVzID0gW0NBQ0hFX0FTU0VUUywgQ0FDSEVfQVBJLCBDQUNIRV9PRkZMSU5FXTtcclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKChjYWNoZU5hbWVzKSA9PiB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcclxuICAgICAgICBjYWNoZU5hbWVzLm1hcCgoY2FjaGVOYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIWN1cnJlbnRDYWNoZXMuaW5jbHVkZXMoY2FjaGVOYW1lKSkge1xyXG4gICAgICAgICAgICAvLyBEZWxldGUgb3V0ZGF0ZWQgY2FjaGVzXHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJzZWxmIiwiX19XQl9ESVNBQkxFX0RFVl9MT0dTIiwiQ0FDSEVfQVNTRVRTIiwiQ0FDSEVfQVBJIiwiQ0FDSEVfT0ZGTElORSIsIk9GRkxJTkVfRkFMTEJBQ0tfUEFHRSIsImltcG9ydFNjcmlwdHMiLCJ3b3JrYm94IiwicHJlY2FjaGluZyIsInByZWNhY2hlQW5kUm91dGUiLCJfX1dCX01BTklGRVNUIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsImFkZCIsInJvdXRpbmciLCJyZWdpc3RlclJvdXRlIiwiUmVnRXhwIiwic3RyYXRlZ2llcyIsIlN0YWxlV2hpbGVSZXZhbGlkYXRlIiwiY2FjaGVOYW1lIiwicGx1Z2lucyIsImNhY2hlYWJsZVJlc3BvbnNlIiwiUGx1Z2luIiwic3RhdHVzZXMiLCJleHBpcmF0aW9uIiwibWF4QWdlU2Vjb25kcyIsIm1heEVudHJpZXMiLCJyZXF1ZXN0IiwibW9kZSIsInJlc3BvbmRXaXRoIiwibmV0d29ya1Jlc3AiLCJmZXRjaCIsInB1dCIsImNsb25lIiwiZXJyb3IiLCJjYWNoZWRSZXNwIiwibWF0Y2giLCJiYWNrZ3JvdW5kU3luYyIsInN5bmNRdWV1ZSIsIlF1ZXVlIiwiTmV0d29ya09ubHkiLCJtYXhSZXRlbnRpb25UaW1lIiwidGFnIiwic3luY0RhdGEiLCJuYXZpZ2F0aW9uUHJlbG9hZCIsImlzU3VwcG9ydGVkIiwiZW5hYmxlIiwiY29uc29sZSIsImxvZyIsImN1cnJlbnRDYWNoZXMiLCJrZXlzIiwiY2FjaGVOYW1lcyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJpbmNsdWRlcyIsImRlbGV0ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./public/custom-sw.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/custom-sw.js");
/******/ 	
/******/ })()
;