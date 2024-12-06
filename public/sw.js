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

eval(__webpack_require__.ts("self.__WB_DISABLE_DEV_LOGS = true;\nconst CACHE = \"pwabuilder-offline-page\";\nconst OFFLINE_FALLBACK_PAGE = \"/offline.html\";\n// Import Workbox libraries\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js\");\n// Precache files automatically injected by Workbox\nworkbox.precaching.precacheAndRoute([] || []);\n// Install event: Cache the offline fallback page\nself.addEventListener(\"install\", async (event)=>{\n    event.waitUntil(caches.open(CACHE).then((cache)=>cache.add(OFFLINE_FALLBACK_PAGE)));\n});\n// Background Sync setup\nif (workbox.backgroundSync) {\n    const syncQueue = new workbox.backgroundSync.Queue(\"syncQueue\");\n    workbox.routing.registerRoute(new RegExp(\"/api/.*\"), new workbox.strategies.NetworkOnly({\n        plugins: [\n            new workbox.backgroundSync.Plugin(\"syncQueue\", {\n                maxRetentionTime: 24 * 60 // Retry for up to 24 hours\n            })\n        ]\n    }), \"POST\" // Only POST requests will trigger background sync\n    );\n}\n// Periodic Sync setup\nself.addEventListener(\"periodicsync\", (event)=>{\n    if (event.tag === \"syncData\") {\n        event.waitUntil(syncData());\n    }\n});\n// Sync Data function (periodic sync)\nasync function syncData() {\n    const cache = await caches.open(CACHE);\n// Add logic to sync cached data to the server here\n// You could perform a network request here to send data back to the server\n}\n// Enable navigation preload if supported\nif (workbox.navigationPreload.isSupported()) {\n    workbox.navigationPreload.enable();\n}\n// Serve fallback page when offline (for navigation requests)\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        event.respondWith((async ()=>{\n            try {\n                const preloadResp = await event.preloadResponse;\n                if (preloadResp) return preloadResp;\n                const networkResp = await fetch(event.request);\n                return networkResp;\n            } catch (error) {\n                const cache = await caches.open(CACHE);\n                const cachedResp = await cache.match(OFFLINE_FALLBACK_PAGE);\n                return cachedResp || Response.error();\n            }\n        })());\n    }\n});\n// Register a route for static assets (e.g., HTML, JS, CSS)\nworkbox.routing.registerRoute(new RegExp(\"/*\"), new workbox.strategies.StaleWhileRevalidate({\n    cacheName: CACHE\n}));\n// Push notification event handler (for future use if needed)\nself.addEventListener(\"push\", (event)=>{\n    // Handle push notifications if needed\n    console.log(\"Push event received:\", event);\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvY3VzdG9tLXN3LmpzIiwibWFwcGluZ3MiOiJBQUFBQSxLQUFLQyxxQkFBcUIsR0FBRztBQUU3QixNQUFNQyxRQUFRO0FBQ2QsTUFBTUMsd0JBQXdCO0FBRTlCLDJCQUEyQjtBQUMzQkMsY0FBYztBQUVkLG1EQUFtRDtBQUNuREMsUUFBUUMsVUFBVSxDQUFDQyxnQkFBZ0IsQ0FBQ1AsS0FBS1EsYUFBYSxJQUFJLEVBQUU7QUFFNUQsaURBQWlEO0FBQ2pEUixLQUFLUyxnQkFBZ0IsQ0FBQyxXQUFXLE9BQU9DO0lBQ3RDQSxNQUFNQyxTQUFTLENBQ2JDLE9BQU9DLElBQUksQ0FBQ1gsT0FBT1ksSUFBSSxDQUFDLENBQUNDLFFBQVVBLE1BQU1DLEdBQUcsQ0FBQ2I7QUFFakQ7QUFFQSx3QkFBd0I7QUFDeEIsSUFBSUUsUUFBUVksY0FBYyxFQUFFO0lBQzFCLE1BQU1DLFlBQVksSUFBSWIsUUFBUVksY0FBYyxDQUFDRSxLQUFLLENBQUM7SUFFbkRkLFFBQVFlLE9BQU8sQ0FBQ0MsYUFBYSxDQUMzQixJQUFJQyxPQUFPLFlBQ1gsSUFBSWpCLFFBQVFrQixVQUFVLENBQUNDLFdBQVcsQ0FBQztRQUNqQ0MsU0FBUztZQUNQLElBQUlwQixRQUFRWSxjQUFjLENBQUNTLE1BQU0sQ0FBQyxhQUFhO2dCQUM3Q0Msa0JBQWtCLEtBQUssR0FBRywyQkFBMkI7WUFDdkQ7U0FDRDtJQUNILElBQ0EsT0FBTyxrREFBa0Q7O0FBRTdEO0FBRUEsc0JBQXNCO0FBQ3RCM0IsS0FBS1MsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUNDO0lBQ3JDLElBQUlBLE1BQU1rQixHQUFHLEtBQUssWUFBWTtRQUM1QmxCLE1BQU1DLFNBQVMsQ0FBQ2tCO0lBQ2xCO0FBQ0Y7QUFFQSxxQ0FBcUM7QUFDckMsZUFBZUE7SUFDYixNQUFNZCxRQUFRLE1BQU1ILE9BQU9DLElBQUksQ0FBQ1g7QUFDaEMsbURBQW1EO0FBQ25ELDJFQUEyRTtBQUM3RTtBQUVBLHlDQUF5QztBQUN6QyxJQUFJRyxRQUFReUIsaUJBQWlCLENBQUNDLFdBQVcsSUFBSTtJQUMzQzFCLFFBQVF5QixpQkFBaUIsQ0FBQ0UsTUFBTTtBQUNsQztBQUVBLDZEQUE2RDtBQUM3RGhDLEtBQUtTLGdCQUFnQixDQUFDLFNBQVMsQ0FBQ0M7SUFDOUIsSUFBSUEsTUFBTXVCLE9BQU8sQ0FBQ0MsSUFBSSxLQUFLLFlBQVk7UUFDckN4QixNQUFNeUIsV0FBVyxDQUNmLENBQUM7WUFDQyxJQUFJO2dCQUNGLE1BQU1DLGNBQWMsTUFBTTFCLE1BQU0yQixlQUFlO2dCQUMvQyxJQUFJRCxhQUFhLE9BQU9BO2dCQUV4QixNQUFNRSxjQUFjLE1BQU1DLE1BQU03QixNQUFNdUIsT0FBTztnQkFDN0MsT0FBT0s7WUFDVCxFQUFFLE9BQU9FLE9BQU87Z0JBQ2QsTUFBTXpCLFFBQVEsTUFBTUgsT0FBT0MsSUFBSSxDQUFDWDtnQkFDaEMsTUFBTXVDLGFBQWEsTUFBTTFCLE1BQU0yQixLQUFLLENBQUN2QztnQkFDckMsT0FBT3NDLGNBQWNFLFNBQVNILEtBQUs7WUFDckM7UUFDRjtJQUVKO0FBQ0Y7QUFFQSwyREFBMkQ7QUFDM0RuQyxRQUFRZSxPQUFPLENBQUNDLGFBQWEsQ0FDM0IsSUFBSUMsT0FBTyxPQUNYLElBQUlqQixRQUFRa0IsVUFBVSxDQUFDcUIsb0JBQW9CLENBQUM7SUFDMUNDLFdBQVczQztBQUNiO0FBR0YsNkRBQTZEO0FBQzdERixLQUFLUyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUNDO0lBQzdCLHNDQUFzQztJQUN0Q29DLFFBQVFDLEdBQUcsQ0FBQyx3QkFBd0JyQztBQUN0QyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9wdWJsaWMvY3VzdG9tLXN3LmpzPzgwZDQiXSwic291cmNlc0NvbnRlbnQiOlsic2VsZi5fX1dCX0RJU0FCTEVfREVWX0xPR1MgPSB0cnVlO1xyXG5cclxuY29uc3QgQ0FDSEUgPSBcInB3YWJ1aWxkZXItb2ZmbGluZS1wYWdlXCI7XHJcbmNvbnN0IE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSA9IFwiL29mZmxpbmUuaHRtbFwiO1xyXG5cclxuLy8gSW1wb3J0IFdvcmtib3ggbGlicmFyaWVzXHJcbmltcG9ydFNjcmlwdHMoXCJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vd29ya2JveC1jZG4vcmVsZWFzZXMvNS4xLjIvd29ya2JveC1zdy5qc1wiKTtcclxuXHJcbi8vIFByZWNhY2hlIGZpbGVzIGF1dG9tYXRpY2FsbHkgaW5qZWN0ZWQgYnkgV29ya2JveFxyXG53b3JrYm94LnByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZShzZWxmLl9fV0JfTUFOSUZFU1QgfHwgW10pO1xyXG5cclxuLy8gSW5zdGFsbCBldmVudDogQ2FjaGUgdGhlIG9mZmxpbmUgZmFsbGJhY2sgcGFnZVxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnN0YWxsXCIsIGFzeW5jIChldmVudCkgPT4ge1xyXG4gIGV2ZW50LndhaXRVbnRpbChcclxuICAgIGNhY2hlcy5vcGVuKENBQ0hFKS50aGVuKChjYWNoZSkgPT4gY2FjaGUuYWRkKE9GRkxJTkVfRkFMTEJBQ0tfUEFHRSkpXHJcbiAgKTtcclxufSk7XHJcblxyXG4vLyBCYWNrZ3JvdW5kIFN5bmMgc2V0dXBcclxuaWYgKHdvcmtib3guYmFja2dyb3VuZFN5bmMpIHtcclxuICBjb25zdCBzeW5jUXVldWUgPSBuZXcgd29ya2JveC5iYWNrZ3JvdW5kU3luYy5RdWV1ZSgnc3luY1F1ZXVlJyk7XHJcbiAgXHJcbiAgd29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgICBuZXcgUmVnRXhwKCcvYXBpLy4qJyksICAvLyBBZGp1c3QgdGhpcyB0byB0aGUgQVBJIGVuZHBvaW50cyB5b3UgbmVlZCB0byBzeW5jXHJcbiAgICBuZXcgd29ya2JveC5zdHJhdGVnaWVzLk5ldHdvcmtPbmx5KHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIG5ldyB3b3JrYm94LmJhY2tncm91bmRTeW5jLlBsdWdpbignc3luY1F1ZXVlJywge1xyXG4gICAgICAgICAgbWF4UmV0ZW50aW9uVGltZTogMjQgKiA2MCAvLyBSZXRyeSBmb3IgdXAgdG8gMjQgaG91cnNcclxuICAgICAgICB9KVxyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgICdQT1NUJyAvLyBPbmx5IFBPU1QgcmVxdWVzdHMgd2lsbCB0cmlnZ2VyIGJhY2tncm91bmQgc3luY1xyXG4gICk7XHJcbn1cclxuXHJcbi8vIFBlcmlvZGljIFN5bmMgc2V0dXBcclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdwZXJpb2RpY3N5bmMnLCAoZXZlbnQpID0+IHtcclxuICBpZiAoZXZlbnQudGFnID09PSAnc3luY0RhdGEnKSB7XHJcbiAgICBldmVudC53YWl0VW50aWwoc3luY0RhdGEoKSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIFN5bmMgRGF0YSBmdW5jdGlvbiAocGVyaW9kaWMgc3luYylcclxuYXN5bmMgZnVuY3Rpb24gc3luY0RhdGEoKSB7XHJcbiAgY29uc3QgY2FjaGUgPSBhd2FpdCBjYWNoZXMub3BlbihDQUNIRSk7XHJcbiAgLy8gQWRkIGxvZ2ljIHRvIHN5bmMgY2FjaGVkIGRhdGEgdG8gdGhlIHNlcnZlciBoZXJlXHJcbiAgLy8gWW91IGNvdWxkIHBlcmZvcm0gYSBuZXR3b3JrIHJlcXVlc3QgaGVyZSB0byBzZW5kIGRhdGEgYmFjayB0byB0aGUgc2VydmVyXHJcbn1cclxuXHJcbi8vIEVuYWJsZSBuYXZpZ2F0aW9uIHByZWxvYWQgaWYgc3VwcG9ydGVkXHJcbmlmICh3b3JrYm94Lm5hdmlnYXRpb25QcmVsb2FkLmlzU3VwcG9ydGVkKCkpIHtcclxuICB3b3JrYm94Lm5hdmlnYXRpb25QcmVsb2FkLmVuYWJsZSgpO1xyXG59XHJcblxyXG4vLyBTZXJ2ZSBmYWxsYmFjayBwYWdlIHdoZW4gb2ZmbGluZSAoZm9yIG5hdmlnYXRpb24gcmVxdWVzdHMpXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImZldGNoXCIsIChldmVudCkgPT4ge1xyXG4gIGlmIChldmVudC5yZXF1ZXN0Lm1vZGUgPT09IFwibmF2aWdhdGVcIikge1xyXG4gICAgZXZlbnQucmVzcG9uZFdpdGgoXHJcbiAgICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNvbnN0IHByZWxvYWRSZXNwID0gYXdhaXQgZXZlbnQucHJlbG9hZFJlc3BvbnNlO1xyXG4gICAgICAgICAgaWYgKHByZWxvYWRSZXNwKSByZXR1cm4gcHJlbG9hZFJlc3A7XHJcblxyXG4gICAgICAgICAgY29uc3QgbmV0d29ya1Jlc3AgPSBhd2FpdCBmZXRjaChldmVudC5yZXF1ZXN0KTtcclxuICAgICAgICAgIHJldHVybiBuZXR3b3JrUmVzcDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc3QgY2FjaGUgPSBhd2FpdCBjYWNoZXMub3BlbihDQUNIRSk7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZWRSZXNwID0gYXdhaXQgY2FjaGUubWF0Y2goT0ZGTElORV9GQUxMQkFDS19QQUdFKTtcclxuICAgICAgICAgIHJldHVybiBjYWNoZWRSZXNwIHx8IFJlc3BvbnNlLmVycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSgpXHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG4vLyBSZWdpc3RlciBhIHJvdXRlIGZvciBzdGF0aWMgYXNzZXRzIChlLmcuLCBIVE1MLCBKUywgQ1NTKVxyXG53b3JrYm94LnJvdXRpbmcucmVnaXN0ZXJSb3V0ZShcclxuICBuZXcgUmVnRXhwKFwiLypcIiksXHJcbiAgbmV3IHdvcmtib3guc3RyYXRlZ2llcy5TdGFsZVdoaWxlUmV2YWxpZGF0ZSh7XHJcbiAgICBjYWNoZU5hbWU6IENBQ0hFLFxyXG4gIH0pXHJcbik7XHJcblxyXG4vLyBQdXNoIG5vdGlmaWNhdGlvbiBldmVudCBoYW5kbGVyIChmb3IgZnV0dXJlIHVzZSBpZiBuZWVkZWQpXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIChldmVudCkgPT4ge1xyXG4gIC8vIEhhbmRsZSBwdXNoIG5vdGlmaWNhdGlvbnMgaWYgbmVlZGVkXHJcbiAgY29uc29sZS5sb2coJ1B1c2ggZXZlbnQgcmVjZWl2ZWQ6JywgZXZlbnQpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbInNlbGYiLCJfX1dCX0RJU0FCTEVfREVWX0xPR1MiLCJDQUNIRSIsIk9GRkxJTkVfRkFMTEJBQ0tfUEFHRSIsImltcG9ydFNjcmlwdHMiLCJ3b3JrYm94IiwicHJlY2FjaGluZyIsInByZWNhY2hlQW5kUm91dGUiLCJfX1dCX01BTklGRVNUIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwid2FpdFVudGlsIiwiY2FjaGVzIiwib3BlbiIsInRoZW4iLCJjYWNoZSIsImFkZCIsImJhY2tncm91bmRTeW5jIiwic3luY1F1ZXVlIiwiUXVldWUiLCJyb3V0aW5nIiwicmVnaXN0ZXJSb3V0ZSIsIlJlZ0V4cCIsInN0cmF0ZWdpZXMiLCJOZXR3b3JrT25seSIsInBsdWdpbnMiLCJQbHVnaW4iLCJtYXhSZXRlbnRpb25UaW1lIiwidGFnIiwic3luY0RhdGEiLCJuYXZpZ2F0aW9uUHJlbG9hZCIsImlzU3VwcG9ydGVkIiwiZW5hYmxlIiwicmVxdWVzdCIsIm1vZGUiLCJyZXNwb25kV2l0aCIsInByZWxvYWRSZXNwIiwicHJlbG9hZFJlc3BvbnNlIiwibmV0d29ya1Jlc3AiLCJmZXRjaCIsImVycm9yIiwiY2FjaGVkUmVzcCIsIm1hdGNoIiwiUmVzcG9uc2UiLCJTdGFsZVdoaWxlUmV2YWxpZGF0ZSIsImNhY2hlTmFtZSIsImNvbnNvbGUiLCJsb2ciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./public/custom-sw.js\n"));

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