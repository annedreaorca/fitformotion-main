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

eval(__webpack_require__.ts("self.__WB_DISABLE_DEV_LOGS = true;\nconst CACHE_ASSETS = \"fitformotion-assets\";\nconst CACHE_API = \"fitformotion-api\";\nconst CACHE_OFFLINE = \"fitformotion-offline-page\";\nconst OFFLINE_FALLBACK_PAGE = \"/offline.html\";\n// Import Workbox libraries\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js\");\n// Precache files automatically injected by Workbox\nworkbox.precaching.precacheAndRoute([] || []);\n// Install event: Cache the offline fallback page\nself.addEventListener(\"install\", async (event)=>{\n    event.waitUntil(caches.open(CACHE_OFFLINE).then((cache)=>cache.add(OFFLINE_FALLBACK_PAGE)));\n});\n// Cache static assets (HTML, JS, CSS, images) with StaleWhileRevalidate\nworkbox.routing.registerRoute(new RegExp(\"/.*\"), new workbox.strategies.StaleWhileRevalidate({\n    cacheName: CACHE_ASSETS\n}));\n// Cache API requests for offline usage (for dynamic content)\nworkbox.routing.registerRoute(new RegExp(\"/api/.*\"), new workbox.strategies.NetworkFirst({\n    cacheName: CACHE_API,\n    plugins: [\n        new workbox.cacheableResponse.Plugin({\n            statuses: [\n                0,\n                200\n            ]\n        })\n    ]\n}));\n// Background Sync setup for API calls (optional)\nif (workbox.backgroundSync) {\n    const syncQueue = new workbox.backgroundSync.Queue(\"syncQueue\");\n    workbox.routing.registerRoute(new RegExp(\"/api/.*\"), new workbox.strategies.NetworkOnly({\n        plugins: [\n            new workbox.backgroundSync.Plugin(\"syncQueue\", {\n                maxRetentionTime: 24 * 60 // Retry for up to 24 hours\n            })\n        ]\n    }), [\n        \"POST\",\n        \"PUT\",\n        \"PATCH\",\n        \"DELETE\"\n    ] // Allow these methods to trigger background sync\n    );\n}\n// Serve fallback page when offline (for navigation requests)\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        event.respondWith((async ()=>{\n            try {\n                const preloadResp = await event.preloadResponse;\n                if (preloadResp) return preloadResp;\n                const networkResp = await fetch(event.request);\n                return networkResp;\n            } catch (error) {\n                const cache = await caches.open(CACHE_OFFLINE);\n                const cachedResp = await cache.match(OFFLINE_FALLBACK_PAGE);\n                return cachedResp || Response.error();\n            }\n        })());\n    }\n});\n// Enable navigation preload if supported\nif (workbox.navigationPreload.isSupported()) {\n    workbox.navigationPreload.enable();\n}\n// Push notification event handler (for future use if needed)\nself.addEventListener(\"push\", (event)=>{\n    console.log(\"Push event received:\", event);\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvY3VzdG9tLXN3LmpzIiwibWFwcGluZ3MiOiJBQUFBQSxLQUFLQyxxQkFBcUIsR0FBRztBQUU3QixNQUFNQyxlQUFlO0FBQ3JCLE1BQU1DLFlBQVk7QUFDbEIsTUFBTUMsZ0JBQWdCO0FBQ3RCLE1BQU1DLHdCQUF3QjtBQUU5QiwyQkFBMkI7QUFDM0JDLGNBQWM7QUFFZCxtREFBbUQ7QUFDbkRDLFFBQVFDLFVBQVUsQ0FBQ0MsZ0JBQWdCLENBQUNULEtBQUtVLGFBQWEsSUFBSSxFQUFFO0FBRTVELGlEQUFpRDtBQUNqRFYsS0FBS1csZ0JBQWdCLENBQUMsV0FBVyxPQUFPQztJQUN0Q0EsTUFBTUMsU0FBUyxDQUNiQyxPQUFPQyxJQUFJLENBQUNYLGVBQWVZLElBQUksQ0FBQyxDQUFDQyxRQUFVQSxNQUFNQyxHQUFHLENBQUNiO0FBRXpEO0FBRUEsd0VBQXdFO0FBQ3hFRSxRQUFRWSxPQUFPLENBQUNDLGFBQWEsQ0FDM0IsSUFBSUMsT0FBTyxRQUNYLElBQUlkLFFBQVFlLFVBQVUsQ0FBQ0Msb0JBQW9CLENBQUM7SUFDMUNDLFdBQVd0QjtBQUNiO0FBR0YsNkRBQTZEO0FBQzdESyxRQUFRWSxPQUFPLENBQUNDLGFBQWEsQ0FDM0IsSUFBSUMsT0FBTyxZQUNYLElBQUlkLFFBQVFlLFVBQVUsQ0FBQ0csWUFBWSxDQUFDO0lBQ2xDRCxXQUFXckI7SUFDWHVCLFNBQVM7UUFDUCxJQUFJbkIsUUFBUW9CLGlCQUFpQixDQUFDQyxNQUFNLENBQUM7WUFDbkNDLFVBQVU7Z0JBQUM7Z0JBQUc7YUFBSTtRQUNwQjtLQUNEO0FBQ0g7QUFHRixpREFBaUQ7QUFDakQsSUFBSXRCLFFBQVF1QixjQUFjLEVBQUU7SUFDMUIsTUFBTUMsWUFBWSxJQUFJeEIsUUFBUXVCLGNBQWMsQ0FBQ0UsS0FBSyxDQUFDO0lBRW5EekIsUUFBUVksT0FBTyxDQUFDQyxhQUFhLENBQzNCLElBQUlDLE9BQU8sWUFDWCxJQUFJZCxRQUFRZSxVQUFVLENBQUNXLFdBQVcsQ0FBQztRQUNqQ1AsU0FBUztZQUNQLElBQUluQixRQUFRdUIsY0FBYyxDQUFDRixNQUFNLENBQUMsYUFBYTtnQkFDN0NNLGtCQUFrQixLQUFLLEdBQUcsMkJBQTJCO1lBQ3ZEO1NBQ0Q7SUFDSCxJQUNBO1FBQUM7UUFBUTtRQUFPO1FBQVM7S0FBUyxDQUFDLGlEQUFpRDs7QUFFeEY7QUFFQSw2REFBNkQ7QUFDN0RsQyxLQUFLVyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUNDO0lBQzlCLElBQUlBLE1BQU11QixPQUFPLENBQUNDLElBQUksS0FBSyxZQUFZO1FBQ3JDeEIsTUFBTXlCLFdBQVcsQ0FDZixDQUFDO1lBQ0MsSUFBSTtnQkFDRixNQUFNQyxjQUFjLE1BQU0xQixNQUFNMkIsZUFBZTtnQkFDL0MsSUFBSUQsYUFBYSxPQUFPQTtnQkFFeEIsTUFBTUUsY0FBYyxNQUFNQyxNQUFNN0IsTUFBTXVCLE9BQU87Z0JBQzdDLE9BQU9LO1lBQ1QsRUFBRSxPQUFPRSxPQUFPO2dCQUNkLE1BQU16QixRQUFRLE1BQU1ILE9BQU9DLElBQUksQ0FBQ1g7Z0JBQ2hDLE1BQU11QyxhQUFhLE1BQU0xQixNQUFNMkIsS0FBSyxDQUFDdkM7Z0JBQ3JDLE9BQU9zQyxjQUFjRSxTQUFTSCxLQUFLO1lBQ3JDO1FBQ0Y7SUFFSjtBQUNGO0FBRUEseUNBQXlDO0FBQ3pDLElBQUluQyxRQUFRdUMsaUJBQWlCLENBQUNDLFdBQVcsSUFBSTtJQUMzQ3hDLFFBQVF1QyxpQkFBaUIsQ0FBQ0UsTUFBTTtBQUNsQztBQUVBLDZEQUE2RDtBQUM3RGhELEtBQUtXLGdCQUFnQixDQUFDLFFBQVEsQ0FBQ0M7SUFDN0JxQyxRQUFRQyxHQUFHLENBQUMsd0JBQXdCdEM7QUFDdEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcHVibGljL2N1c3RvbS1zdy5qcz84MGQ0Il0sInNvdXJjZXNDb250ZW50IjpbInNlbGYuX19XQl9ESVNBQkxFX0RFVl9MT0dTID0gdHJ1ZTtcclxuXHJcbmNvbnN0IENBQ0hFX0FTU0VUUyA9IFwiZml0Zm9ybW90aW9uLWFzc2V0c1wiO1xyXG5jb25zdCBDQUNIRV9BUEkgPSBcImZpdGZvcm1vdGlvbi1hcGlcIjtcclxuY29uc3QgQ0FDSEVfT0ZGTElORSA9IFwiZml0Zm9ybW90aW9uLW9mZmxpbmUtcGFnZVwiO1xyXG5jb25zdCBPRkZMSU5FX0ZBTExCQUNLX1BBR0UgPSBcIi9vZmZsaW5lLmh0bWxcIjtcclxuXHJcbi8vIEltcG9ydCBXb3JrYm94IGxpYnJhcmllc1xyXG5pbXBvcnRTY3JpcHRzKFwiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3dvcmtib3gtY2RuL3JlbGVhc2VzLzUuMS4yL3dvcmtib3gtc3cuanNcIik7XHJcblxyXG4vLyBQcmVjYWNoZSBmaWxlcyBhdXRvbWF0aWNhbGx5IGluamVjdGVkIGJ5IFdvcmtib3hcclxud29ya2JveC5wcmVjYWNoaW5nLnByZWNhY2hlQW5kUm91dGUoc2VsZi5fX1dCX01BTklGRVNUIHx8IFtdKTtcclxuXHJcbi8vIEluc3RhbGwgZXZlbnQ6IENhY2hlIHRoZSBvZmZsaW5lIGZhbGxiYWNrIHBhZ2Vcclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiaW5zdGFsbFwiLCBhc3luYyAoZXZlbnQpID0+IHtcclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBjYWNoZXMub3BlbihDQUNIRV9PRkZMSU5FKS50aGVuKChjYWNoZSkgPT4gY2FjaGUuYWRkKE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSkpXHJcbiAgKTtcclxufSk7XHJcblxyXG4vLyBDYWNoZSBzdGF0aWMgYXNzZXRzIChIVE1MLCBKUywgQ1NTLCBpbWFnZXMpIHdpdGggU3RhbGVXaGlsZVJldmFsaWRhdGVcclxud29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgbmV3IFJlZ0V4cChcIi8uKlwiKSwgLy8gTWF0Y2ggYWxsIHJvdXRlcyBmb3IgY2FjaGluZ1xyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuU3RhbGVXaGlsZVJldmFsaWRhdGUoe1xyXG4gICAgY2FjaGVOYW1lOiBDQUNIRV9BU1NFVFMsXHJcbiAgfSlcclxuKTtcclxuXHJcbi8vIENhY2hlIEFQSSByZXF1ZXN0cyBmb3Igb2ZmbGluZSB1c2FnZSAoZm9yIGR5bmFtaWMgY29udGVudClcclxud29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgbmV3IFJlZ0V4cCgnL2FwaS8uKicpLCAgLy8gQWRqdXN0IHRoaXMgdG8gdGhlIEFQSSBlbmRwb2ludHMgeW91IG5lZWQgdG8gc3luY1xyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuTmV0d29ya0ZpcnN0KHtcclxuICAgIGNhY2hlTmFtZTogQ0FDSEVfQVBJLFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICBuZXcgd29ya2JveC5jYWNoZWFibGVSZXNwb25zZS5QbHVnaW4oe1xyXG4gICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSwgIC8vIENhY2hlIHN1Y2Nlc3NmdWwgcmVzcG9uc2VzXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfSlcclxuKTtcclxuXHJcbi8vIEJhY2tncm91bmQgU3luYyBzZXR1cCBmb3IgQVBJIGNhbGxzIChvcHRpb25hbClcclxuaWYgKHdvcmtib3guYmFja2dyb3VuZFN5bmMpIHtcclxuICBjb25zdCBzeW5jUXVldWUgPSBuZXcgd29ya2JveC5iYWNrZ3JvdW5kU3luYy5RdWV1ZSgnc3luY1F1ZXVlJyk7XHJcbiAgXHJcbiAgd29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgICBuZXcgUmVnRXhwKCcvYXBpLy4qJyksXHJcbiAgICBuZXcgd29ya2JveC5zdHJhdGVnaWVzLk5ldHdvcmtPbmx5KHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlBsdWdpbignc3luY1F1ZXVlJywge1xyXG4gICAgICAgICAgbWF4UmV0ZW50aW9uVGltZTogMjQgKiA2MCAvLyBSZXRyeSBmb3IgdXAgdG8gMjQgaG91cnNcclxuICAgICAgICB9KVxyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgIFsnUE9TVCcsICdQVVQnLCAnUEFUQ0gnLCAnREVMRVRFJ10gLy8gQWxsb3cgdGhlc2UgbWV0aG9kcyB0byB0cmlnZ2VyIGJhY2tncm91bmQgc3luY1xyXG4gICk7XHJcbn1cclxuXHJcbi8vIFNlcnZlIGZhbGxiYWNrIHBhZ2Ugd2hlbiBvZmZsaW5lIChmb3IgbmF2aWdhdGlvbiByZXF1ZXN0cylcclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiZmV0Y2hcIiwgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGV2ZW50LnJlcXVlc3QubW9kZSA9PT0gXCJuYXZpZ2F0ZVwiKSB7XHJcbiAgICBldmVudC5yZXNwb25kV2l0aChcclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcHJlbG9hZFJlc3AgPSBhd2FpdCBldmVudC5wcmVsb2FkUmVzcG9uc2U7XHJcbiAgICAgICAgICBpZiAocHJlbG9hZFJlc3ApIHJldHVybiBwcmVsb2FkUmVzcDtcclxuXHJcbiAgICAgICAgICBjb25zdCBuZXR3b3JrUmVzcCA9IGF3YWl0IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldHdvcmtSZXNwO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKENBQ0hFX09GRkxJTkUpO1xyXG4gICAgICAgICAgY29uc3QgY2FjaGVkUmVzcCA9IGF3YWl0IGNhY2hlLm1hdGNoKE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSk7XHJcbiAgICAgICAgICByZXR1cm4gY2FjaGVkUmVzcCB8fCBSZXNwb25zZS5lcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkoKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gRW5hYmxlIG5hdmlnYXRpb24gcHJlbG9hZCBpZiBzdXBwb3J0ZWRcclxuaWYgKHdvcmtib3gubmF2aWdhdGlvblByZWxvYWQuaXNTdXBwb3J0ZWQoKSkge1xyXG4gIHdvcmtib3gubmF2aWdhdGlvblByZWxvYWQuZW5hYmxlKCk7XHJcbn1cclxuXHJcbi8vIFB1c2ggbm90aWZpY2F0aW9uIGV2ZW50IGhhbmRsZXIgKGZvciBmdXR1cmUgdXNlIGlmIG5lZWRlZClcclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdwdXNoJywgKGV2ZW50KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ1B1c2ggZXZlbnQgcmVjZWl2ZWQ6JywgZXZlbnQpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbInNlbGYiLCJfX1dCX0RJU0FCTEVfREVWX0xPR1MiLCJDQUNIRV9BU1NFVFMiLCJDQUNIRV9BUEkiLCJDQUNIRV9PRkZMSU5FIiwiT0ZGTElORV9GQUxMQkFDS19QQUdFIiwiaW1wb3J0U2NyaXB0cyIsIndvcmtib3giLCJwcmVjYWNoaW5nIiwicHJlY2FjaGVBbmRSb3V0ZSIsIl9fV0JfTUFOSUZFU1QiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ3YWl0VW50aWwiLCJjYWNoZXMiLCJvcGVuIiwidGhlbiIsImNhY2hlIiwiYWRkIiwicm91dGluZyIsInJlZ2lzdGVyUm91dGUiLCJSZWdFeHAiLCJzdHJhdGVnaWVzIiwiU3RhbGVXaGlsZVJldmFsaWRhdGUiLCJjYWNoZU5hbWUiLCJOZXR3b3JrRmlyc3QiLCJwbHVnaW5zIiwiY2FjaGVhYmxlUmVzcG9uc2UiLCJQbHVnaW4iLCJzdGF0dXNlcyIsImJhY2tncm91bmRTeW5jIiwic3luY1F1ZXVlIiwiUXVldWUiLCJOZXR3b3JrT25seSIsIm1heFJldGVudGlvblRpbWUiLCJyZXF1ZXN0IiwibW9kZSIsInJlc3BvbmRXaXRoIiwicHJlbG9hZFJlc3AiLCJwcmVsb2FkUmVzcG9uc2UiLCJuZXR3b3JrUmVzcCIsImZldGNoIiwiZXJyb3IiLCJjYWNoZWRSZXNwIiwibWF0Y2giLCJSZXNwb25zZSIsIm5hdmlnYXRpb25QcmVsb2FkIiwiaXNTdXBwb3J0ZWQiLCJlbmFibGUiLCJjb25zb2xlIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./public/custom-sw.js\n"));

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