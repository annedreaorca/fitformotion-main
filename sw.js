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

eval(__webpack_require__.ts("self.__WB_DISABLE_DEV_LOGS = true;\nconst CACHE_ASSETS = \"app-assets-cache\";\nconst CACHE_API = \"app-api-cache\";\nconst CACHE_OFFLINE = \"offline-cache\";\nconst OFFLINE_FALLBACK_PAGE = \"/offline.html\";\n// Import Workbox libraries\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js\");\n// Precache files automatically injected by Workbox\nworkbox.precaching.precacheAndRoute([] || []);\n// Install event: Cache the offline fallback page\nself.addEventListener(\"install\", async (event)=>{\n    event.waitUntil(caches.open(CACHE_OFFLINE).then((cache)=>cache.add(OFFLINE_FALLBACK_PAGE)));\n});\n// Cache static assets (e.g., JS, CSS, images)\nworkbox.routing.registerRoute(new RegExp(\"/.*.(js|css|html|jpg|jpeg|png|svg|ico)$\"), new workbox.strategies.StaleWhileRevalidate({\n    cacheName: CACHE_ASSETS,\n    plugins: [\n        new workbox.cacheableResponse.Plugin({\n            statuses: [\n                0,\n                200\n            ]\n        }),\n        new workbox.expiration.Plugin({\n            maxAgeSeconds: 60 * 60 * 24 * 7,\n            maxEntries: 50\n        })\n    ]\n}));\n// Cache dynamic routes (e.g., /dashboard, /profile)\nworkbox.routing.registerRoute(new RegExp(\"/(dashboard|profile|.*)\"), new workbox.strategies.NetworkFirst({\n    cacheName: \"dynamic-cache\",\n    plugins: [\n        new workbox.cacheableResponse.Plugin({\n            statuses: [\n                0,\n                200\n            ]\n        }),\n        new workbox.expiration.Plugin({\n            maxAgeSeconds: 60 * 60 * 24,\n            maxEntries: 10\n        })\n    ]\n}));\n// Cache API requests that fail while offline\nif (workbox.backgroundSync) {\n    const syncQueue = new workbox.backgroundSync.Queue(\"syncQueue\");\n    // Register the route for API endpoints needing sync\n    workbox.routing.registerRoute(new RegExp(\"/api/.*\"), new workbox.strategies.NetworkOnly({\n        plugins: [\n            new workbox.backgroundSync.Plugin(\"syncQueue\", {\n                maxRetentionTime: 24 * 60 // Retry for up to 24 hours\n            })\n        ]\n    }), [\n        \"POST\",\n        \"PUT\",\n        \"PATCH\",\n        \"DELETE\"\n    ] // Include methods that should trigger background sync\n    );\n}\n// Serve fallback page when offline (for navigation requests)\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        event.respondWith((async ()=>{\n            try {\n                const networkResp = await fetch(event.request);\n                return networkResp;\n            } catch (error) {\n                const cache = await caches.open(CACHE_ASSETS);\n                const cachedResp = await cache.match(event.request);\n                if (cachedResp) {\n                    return cachedResp;\n                }\n                // If no cache, return the offline page\n                return caches.match(OFFLINE_FALLBACK_PAGE);\n            }\n        })());\n    }\n});\n// Background sync for periodic tasks (like syncing data)\nself.addEventListener(\"periodicsync\", (event)=>{\n    if (event.tag === \"syncData\") {\n        event.waitUntil(syncData());\n    }\n});\n// Sync data function (periodic sync)\nasync function syncData() {\n    const cache = await caches.open(CACHE_API);\n// Logic for syncing cached data with the server\n// You could perform a network request here to send data back to the server\n}\n// Enable navigation preload if supported\nif (workbox.navigationPreload.isSupported()) {\n    workbox.navigationPreload.enable();\n}\n// Handle cache expiration and cleanup\nself.addEventListener(\"activate\", (event)=>{\n    const currentCaches = [\n        CACHE_ASSETS,\n        CACHE_API,\n        CACHE_OFFLINE\n    ];\n    event.waitUntil(caches.keys().then((cacheNames)=>{\n        return Promise.all(cacheNames.map((cacheName)=>{\n            if (!currentCaches.includes(cacheName)) {\n                // Delete outdated caches\n                return caches.delete(cacheName);\n            }\n        }));\n    }));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxLQUFLLFlBQVk7UUFDNUJsQyxNQUFNQyxTQUFTLENBQUNrQztJQUNsQjtBQUNGO0FBRUEscUNBQXFDO0FBQ3JDLGVBQWVBO0lBQ2IsTUFBTTlCLFFBQVEsTUFBTUgsT0FBT0MsSUFBSSxDQUFDWjtBQUNoQyxnREFBZ0Q7QUFDaEQsMkVBQTJFO0FBQzdFO0FBRUEseUNBQXlDO0FBQ3pDLElBQUlJLFFBQVF5QyxpQkFBaUIsQ0FBQ0MsV0FBVyxJQUFJO0lBQzNDMUMsUUFBUXlDLGlCQUFpQixDQUFDRSxNQUFNO0FBQ2xDO0FBRUEsc0NBQXNDO0FBQ3RDbEQsS0FBS1csZ0JBQWdCLENBQUMsWUFBWSxDQUFDQztJQUNqQyxNQUFNdUMsZ0JBQWdCO1FBQUNqRDtRQUFjQztRQUFXQztLQUFjO0lBRTlEUSxNQUFNQyxTQUFTLENBQ2JDLE9BQU9zQyxJQUFJLEdBQUdwQyxJQUFJLENBQUMsQ0FBQ3FDO1FBQ2xCLE9BQU9DLFFBQVFDLEdBQUcsQ0FDaEJGLFdBQVdHLEdBQUcsQ0FBQyxDQUFDaEM7WUFDZCxJQUFJLENBQUMyQixjQUFjTSxRQUFRLENBQUNqQyxZQUFZO2dCQUN0Qyx5QkFBeUI7Z0JBQ3pCLE9BQU9WLE9BQU80QyxNQUFNLENBQUNsQztZQUN2QjtRQUNGO0lBRUo7QUFFSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wdWJsaWMvY3VzdG9tLXN3LmpzPzgwZDQiXSwic291cmNlc0NvbnRlbnQiOlsic2VsZi5fX1dCX0RJU0FCTEVfREVWX0xPR1MgPSB0cnVlO1xyXG5cclxuY29uc3QgQ0FDSEVfQVNTRVRTID0gXCJhcHAtYXNzZXRzLWNhY2hlXCI7XHJcbmNvbnN0IENBQ0hFX0FQSSA9IFwiYXBwLWFwaS1jYWNoZVwiO1xyXG5jb25zdCBDQUNIRV9PRkZMSU5FID0gXCJvZmZsaW5lLWNhY2hlXCI7XHJcbmNvbnN0IE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSA9IFwiL29mZmxpbmUuaHRtbFwiO1xyXG5cclxuLy8gSW1wb3J0IFdvcmtib3ggbGlicmFyaWVzXHJcbmltcG9ydFNjcmlwdHMoXCJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vd29ya2JveC1jZG4vcmVsZWFzZXMvNS4xLjIvd29ya2JveC1zdy5qc1wiKTtcclxuXHJcbi8vIFByZWNhY2hlIGZpbGVzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYnkgV29ya2JveFxyXG53b3JrYm94LnByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZShzZWxmLl9fV0JfTUFOSUZFU1QgfHwgW10pO1xyXG5cclxuLy8gSW5zdGFsbCBldmVudDogQ2FjaGUgdGhlIG9mZmxpbmUgZmFsbGJhY2sgcGFnZVxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnN0YWxsXCIsIGFzeW5jIChldmVudCkgPT4ge1xyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIGNhY2hlcy5vcGVuKENBQ0hFX09GRkxJTkUpLnRoZW4oKGNhY2hlKSA9PiBjYWNoZS5hZGQoT0ZGTElORV9GQUxMQkFDS19QQUdFKSlcclxuICApO1xyXG59KTtcclxuXHJcbi8vIENhY2hlIHN0YXRpYyBhc3NldHMgKGUuZy4sIEpTLCBDU1MsIGltYWdlcylcclxud29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgbmV3IFJlZ0V4cCgnLy4qXFwuKGpzfGNzc3xodG1sfGpwZ3xqcGVnfHBuZ3xzdmd8aWNvKSQnKSwgLy8gTWF0Y2ggc3RhdGljIGFzc2V0c1xyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuU3RhbGVXaGlsZVJldmFsaWRhdGUoe1xyXG4gICAgY2FjaGVOYW1lOiBDQUNIRV9BU1NFVFMsXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5ldyB3b3JrYm94LmNhY2hlYWJsZVJlc3BvbnNlLlBsdWdpbih7XHJcbiAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxyXG4gICAgICB9KSxcclxuICAgICAgbmV3IHdvcmtib3guZXhwaXJhdGlvbi5QbHVnaW4oe1xyXG4gICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDcsIC8vIENhY2hlIGFzc2V0cyBmb3IgMSB3ZWVrXHJcbiAgICAgICAgbWF4RW50cmllczogNTAsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICB9KVxyXG4pO1xyXG5cclxuLy8gQ2FjaGUgZHluYW1pYyByb3V0ZXMgKGUuZy4sIC9kYXNoYm9hcmQsIC9wcm9maWxlKVxyXG53b3JrYm94LnJvdXRpbmcucmVnaXN0ZXJSb3V0ZShcclxuICBuZXcgUmVnRXhwKCcvKGRhc2hib2FyZHxwcm9maWxlfC4qKScpLFxyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuTmV0d29ya0ZpcnN0KHtcclxuICAgIGNhY2hlTmFtZTogJ2R5bmFtaWMtY2FjaGUnLFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBuZXcgd29ya2JveC5jYWNoZWFibGVSZXNwb25zZS5QbHVnaW4oe1xyXG4gICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcclxuICAgICAgfSksXHJcbiAgICAgIG5ldyB3b3JrYm94LmV4cGlyYXRpb24uUGx1Z2luKHtcclxuICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQsIC8vIENhY2hlIGZvciAxIGRheVxyXG4gICAgICAgIG1heEVudHJpZXM6IDEwLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgfSlcclxuKTtcclxuXHJcbi8vIENhY2hlIEFQSSByZXF1ZXN0cyB0aGF0IGZhaWwgd2hpbGUgb2ZmbGluZVxyXG5pZiAod29ya2JveC5iYWNrZ3JvdW5kU3luYykge1xyXG4gIGNvbnN0IHN5bmNRdWV1ZSA9IG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlF1ZXVlKCdzeW5jUXVldWUnKTtcclxuICBcclxuICAvLyBSZWdpc3RlciB0aGUgcm91dGUgZm9yIEFQSSBlbmRwb2ludHMgbmVlZGluZyBzeW5jXHJcbiAgd29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgICBuZXcgUmVnRXhwKCcvYXBpLy4qJyksICAvLyBBZGp1c3QgdGhpcyB0byB0aGUgQVBJIGVuZHBvaW50cyB5b3UgbmVlZCB0byBzeW5jXHJcbiAgICBuZXcgd29ya2JveC5zdHJhdGVnaWVzLk5ldHdvcmtPbmx5KHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlBsdWdpbignc3luY1F1ZXVlJywge1xyXG4gICAgICAgICAgbWF4UmV0ZW50aW9uVGltZTogMjQgKiA2MCAvLyBSZXRyeSBmb3IgdXAgdG8gMjQgaG91cnNcclxuICAgICAgICB9KVxyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgIFsnUE9TVCcsICdQVVQnLCAnUEFUQ0gnLCAnREVMRVRFJ10gLy8gSW5jbHVkZSBtZXRob2RzIHRoYXQgc2hvdWxkIHRyaWdnZXIgYmFja2dyb3VuZCBzeW5jXHJcbiAgKTtcclxufVxyXG5cclxuLy8gU2VydmUgZmFsbGJhY2sgcGFnZSB3aGVuIG9mZmxpbmUgKGZvciBuYXZpZ2F0aW9uIHJlcXVlc3RzKVxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJmZXRjaFwiLCAoZXZlbnQpID0+IHtcclxuICBpZiAoZXZlbnQucmVxdWVzdC5tb2RlID09PSBcIm5hdmlnYXRlXCIpIHtcclxuICAgIGV2ZW50LnJlc3BvbmRXaXRoKFxyXG4gICAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCBuZXR3b3JrUmVzcCA9IGF3YWl0IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldHdvcmtSZXNwO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKENBQ0hFX0FTU0VUUyk7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZWRSZXNwID0gYXdhaXQgY2FjaGUubWF0Y2goZXZlbnQucmVxdWVzdCk7XHJcbiAgICAgICAgICBpZiAoY2FjaGVkUmVzcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkUmVzcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIElmIG5vIGNhY2hlLCByZXR1cm4gdGhlIG9mZmxpbmUgcGFnZVxyXG4gICAgICAgICAgcmV0dXJuIGNhY2hlcy5tYXRjaChPRkZMSU5FX0ZBTExCQUNLX1BBR0UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkoKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gQmFja2dyb3VuZCBzeW5jIGZvciBwZXJpb2RpYyB0YXNrcyAobGlrZSBzeW5jaW5nIGRhdGEpXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncGVyaW9kaWNzeW5jJywgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGV2ZW50LnRhZyA9PT0gJ3N5bmNEYXRhJykge1xyXG4gICAgZXZlbnQud2FpdFVudGlsKHN5bmNEYXRhKCkpO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBTeW5jIGRhdGEgZnVuY3Rpb24gKHBlcmlvZGljIHN5bmMpXHJcbmFzeW5jIGZ1bmN0aW9uIHN5bmNEYXRhKCkge1xyXG4gIGNvbnN0IGNhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oQ0FDSEVfQVBJKTtcclxuICAvLyBMb2dpYyBmb3Igc3luY2luZyBjYWNoZWQgZGF0YSB3aXRoIHRoZSBzZXJ2ZXJcclxuICAvLyBZb3UgY291bGQgcGVyZm9ybSBhIG5ldHdvcmsgcmVxdWVzdCBoZXJlIHRvIHNlbmQgZGF0YSBiYWNrIHRvIHRoZSBzZXJ2ZXJcclxufVxyXG5cclxuLy8gRW5hYmxlIG5hdmlnYXRpb24gcHJlbG9hZCBpZiBzdXBwb3J0ZWRcclxuaWYgKHdvcmtib3gubmF2aWdhdGlvblByZWxvYWQuaXNTdXBwb3J0ZWQoKSkge1xyXG4gIHdvcmtib3gubmF2aWdhdGlvblByZWxvYWQuZW5hYmxlKCk7XHJcbn1cclxuXHJcbi8vIEhhbmRsZSBjYWNoZSBleHBpcmF0aW9uIGFuZCBjbGVhbnVwXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYWN0aXZhdGUnLCAoZXZlbnQpID0+IHtcclxuICBjb25zdCBjdXJyZW50Q2FjaGVzID0gW0NBQ0hFX0FTU0VUUywgQ0FDSEVfQVBJLCBDQUNIRV9PRkZMSU5FXTtcclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKChjYWNoZU5hbWVzKSA9PiB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcclxuICAgICAgICBjYWNoZU5hbWVzLm1hcCgoY2FjaGVOYW1lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIWN1cnJlbnRDYWNoZXMuaW5jbHVkZXMoY2FjaGVOYW1lKSkge1xyXG4gICAgICAgICAgICAvLyBEZWxldGUgb3V0ZGF0ZWQgY2FjaGVzXHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pXHJcbiAgKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6WyJzZWxmIiwiX19XQl9ESVNBQkxFX0RFVl9MT0dTIiwiQ0FDSEVfQVNTRVRTIiwiQ0FDSEVfQVBJIiwiQ0FDSEVfT0ZGTElORSIsIk9GRkxJTkVfRkFMTEJBQ0tfUEFHRSIsImltcG9ydFNjcmlwdHMiLCJ3b3JrYm94IiwicHJlY2FjaGluZyIsInByZWNhY2hlQW5kUm91dGUiLCJfX1dCX01BTklGRVNUIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsImFkZCIsInJvdXRpbmciLCJyZWdpc3RlclJvdXRlIiwiUmVnRXhwIiwic3RyYXRlZ2llcyIsIlN0YWxlV2hpbGVSZXZhbGlkYXRlIiwiY2FjaGVOYW1lIiwicGx1Z2lucyIsImNhY2hlYWJsZVJlc3BvbnNlIiwiUGx1Z2luIiwic3RhdHVzZXMiLCJleHBpcmF0aW9uIiwibWF4QWdlU2Vjb25kcyIsIm1heEVudHJpZXMiLCJOZXR3b3JrRmlyc3QiLCJiYWNrZ3JvdW5kU3luYyIsInN5bmNRdWV1ZSIsIlF1ZXVlIiwiTmV0d29ya09ubHkiLCJtYXhSZXRlbnRpb25UaW1lIiwicmVxdWVzdCIsIm1vZGUiLCJyZXNwb25kV2l0aCIsIm5ldHdvcmtSZXNwIiwiZmV0Y2giLCJlcnJvciIsImNhY2hlZFJlc3AiLCJtYXRjaCIsInRhZyIsInN5bmNEYXRhIiwibmF2aWdhdGlvblByZWxvYWQiLCJpc1N1cHBvcnRlZCIsImVuYWJsZSIsImN1cnJlbnRDYWNoZXMiLCJrZXlzIiwiY2FjaGVOYW1lcyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJpbmNsdWRlcyIsImRlbGV0ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./public/custom-sw.js\n"));

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