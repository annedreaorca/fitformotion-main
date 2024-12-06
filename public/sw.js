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

eval(__webpack_require__.ts("self.__WB_DISABLE_DEV_LOGS = true;\nconst CACHE = \"pwabuilder-offline-page\";\nimportScripts(\"https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js\");\n// Precache files automatically injected by Workbox\nworkbox.precaching.precacheAndRoute([] || []);\n// Offline fallback\nconst offlineFallbackPage = \"/offline.html\";\nself.addEventListener(\"message\", (event)=>{\n    if (event.data && event.data.type === \"SKIP_WAITING\") {\n        self.skipWaiting();\n    }\n});\nself.addEventListener(\"install\", async (event)=>{\n    event.waitUntil(caches.open(CACHE).then((cache)=>cache.add(offlineFallbackPage)));\n});\nif (workbox.navigationPreload.isSupported()) {\n    workbox.navigationPreload.enable();\n}\nworkbox.routing.registerRoute(new RegExp(\"/*\"), new workbox.strategies.StaleWhileRevalidate({\n    cacheName: CACHE\n}));\nself.addEventListener(\"fetch\", (event)=>{\n    if (event.request.mode === \"navigate\") {\n        event.respondWith((async ()=>{\n            try {\n                const preloadResp = await event.preloadResponse;\n                if (preloadResp) return preloadResp;\n                const networkResp = await fetch(event.request);\n                return networkResp;\n            } catch (error) {\n                const cache = await caches.open(CACHE);\n                const cachedResp = await cache.match(offlineFallbackPage);\n                return cachedResp;\n            }\n        })());\n    }\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wdWJsaWMvY3VzdG9tLXN3LmpzIiwibWFwcGluZ3MiOiJBQUFBQSxLQUFLQyxxQkFBcUIsR0FBRztBQUU3QixNQUFNQyxRQUFRO0FBQ2RDLGNBQWM7QUFFZCxtREFBbUQ7QUFDbkRDLFFBQVFDLFVBQVUsQ0FBQ0MsZ0JBQWdCLENBQUNOLEtBQUtPLGFBQWEsSUFBSSxFQUFFO0FBRTVELG1CQUFtQjtBQUNuQixNQUFNQyxzQkFBc0I7QUFFNUJSLEtBQUtTLGdCQUFnQixDQUFDLFdBQVcsQ0FBQ0M7SUFDaEMsSUFBSUEsTUFBTUMsSUFBSSxJQUFJRCxNQUFNQyxJQUFJLENBQUNDLElBQUksS0FBSyxnQkFBZ0I7UUFDcERaLEtBQUthLFdBQVc7SUFDbEI7QUFDRjtBQUVBYixLQUFLUyxnQkFBZ0IsQ0FBQyxXQUFXLE9BQU9DO0lBQ3RDQSxNQUFNSSxTQUFTLENBQ2JDLE9BQU9DLElBQUksQ0FBQ2QsT0FBT2UsSUFBSSxDQUFDLENBQUNDLFFBQVVBLE1BQU1DLEdBQUcsQ0FBQ1g7QUFFakQ7QUFFQSxJQUFJSixRQUFRZ0IsaUJBQWlCLENBQUNDLFdBQVcsSUFBSTtJQUMzQ2pCLFFBQVFnQixpQkFBaUIsQ0FBQ0UsTUFBTTtBQUNsQztBQUVBbEIsUUFBUW1CLE9BQU8sQ0FBQ0MsYUFBYSxDQUMzQixJQUFJQyxPQUFPLE9BQ1gsSUFBSXJCLFFBQVFzQixVQUFVLENBQUNDLG9CQUFvQixDQUFDO0lBQzFDQyxXQUFXMUI7QUFDYjtBQUdGRixLQUFLUyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUNDO0lBQzlCLElBQUlBLE1BQU1tQixPQUFPLENBQUNDLElBQUksS0FBSyxZQUFZO1FBQ3JDcEIsTUFBTXFCLFdBQVcsQ0FDZixDQUFDO1lBQ0MsSUFBSTtnQkFDRixNQUFNQyxjQUFjLE1BQU10QixNQUFNdUIsZUFBZTtnQkFDL0MsSUFBSUQsYUFBYSxPQUFPQTtnQkFFeEIsTUFBTUUsY0FBYyxNQUFNQyxNQUFNekIsTUFBTW1CLE9BQU87Z0JBQzdDLE9BQU9LO1lBQ1QsRUFBRSxPQUFPRSxPQUFPO2dCQUNkLE1BQU1sQixRQUFRLE1BQU1ILE9BQU9DLElBQUksQ0FBQ2Q7Z0JBQ2hDLE1BQU1tQyxhQUFhLE1BQU1uQixNQUFNb0IsS0FBSyxDQUFDOUI7Z0JBQ3JDLE9BQU82QjtZQUNUO1FBQ0Y7SUFFSjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3B1YmxpYy9jdXN0b20tc3cuanM/ODBkNCJdLCJzb3VyY2VzQ29udGVudCI6WyJzZWxmLl9fV0JfRElTQUJMRV9ERVZfTE9HUyA9IHRydWU7XHJcblxyXG5jb25zdCBDQUNIRSA9IFwicHdhYnVpbGRlci1vZmZsaW5lLXBhZ2VcIjtcclxuaW1wb3J0U2NyaXB0cyhcImh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS93b3JrYm94LWNkbi9yZWxlYXNlcy81LjEuMi93b3JrYm94LXN3LmpzXCIpO1xyXG5cclxuLy8gUHJlY2FjaGUgZmlsZXMgYXV0b21hdGljYWxseSBpbmplY3RlZCBieSBXb3JrYm94XHJcbndvcmtib3gucHJlY2FjaGluZy5wcmVjYWNoZUFuZFJvdXRlKHNlbGYuX19XQl9NQU5JRkVTVCB8fCBbXSk7XHJcblxyXG4vLyBPZmZsaW5lIGZhbGxiYWNrXHJcbmNvbnN0IG9mZmxpbmVGYWxsYmFja1BhZ2UgPSBcIi9vZmZsaW5lLmh0bWxcIjtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGV2ZW50LmRhdGEgJiYgZXZlbnQuZGF0YS50eXBlID09PSBcIlNLSVBfV0FJVElOR1wiKSB7XHJcbiAgICBzZWxmLnNraXBXYWl0aW5nKCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImluc3RhbGxcIiwgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgY2FjaGVzLm9wZW4oQ0FDSEUpLnRoZW4oKGNhY2hlKSA9PiBjYWNoZS5hZGQob2ZmbGluZUZhbGxiYWNrUGFnZSkpXHJcbiAgKTtcclxufSk7XHJcblxyXG5pZiAod29ya2JveC5uYXZpZ2F0aW9uUHJlbG9hZC5pc1N1cHBvcnRlZCgpKSB7XHJcbiAgd29ya2JveC5uYXZpZ2F0aW9uUHJlbG9hZC5lbmFibGUoKTtcclxufVxyXG5cclxud29ya2JveC5yb3V0aW5nLnJlZ2lzdGVyUm91dGUoXHJcbiAgbmV3IFJlZ0V4cChcIi8qXCIpLFxyXG4gIG5ldyB3b3JrYm94LnN0cmF0ZWdpZXMuU3RhbGVXaGlsZVJldmFsaWRhdGUoe1xyXG4gICAgY2FjaGVOYW1lOiBDQUNIRSxcclxuICB9KVxyXG4pO1xyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiZmV0Y2hcIiwgKGV2ZW50KSA9PiB7XHJcbiAgaWYgKGV2ZW50LnJlcXVlc3QubW9kZSA9PT0gXCJuYXZpZ2F0ZVwiKSB7XHJcbiAgICBldmVudC5yZXNwb25kV2l0aChcclxuICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcHJlbG9hZFJlc3AgPSBhd2FpdCBldmVudC5wcmVsb2FkUmVzcG9uc2U7XHJcbiAgICAgICAgICBpZiAocHJlbG9hZFJlc3ApIHJldHVybiBwcmVsb2FkUmVzcDtcclxuXHJcbiAgICAgICAgICBjb25zdCBuZXR3b3JrUmVzcCA9IGF3YWl0IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldHdvcmtSZXNwO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKENBQ0hFKTtcclxuICAgICAgICAgIGNvbnN0IGNhY2hlZFJlc3AgPSBhd2FpdCBjYWNoZS5tYXRjaChvZmZsaW5lRmFsbGJhY2tQYWdlKTtcclxuICAgICAgICAgIHJldHVybiBjYWNoZWRSZXNwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkoKVxyXG4gICAgKTtcclxuICB9XHJcbn0pO1xyXG4iXSwibmFtZXMiOlsic2VsZiIsIl9fV0JfRElTQUJMRV9ERVZfTE9HUyIsIkNBQ0hFIiwiaW1wb3J0U2NyaXB0cyIsIndvcmtib3giLCJwcmVjYWNoaW5nIiwicHJlY2FjaGVBbmRSb3V0ZSIsIl9fV0JfTUFOSUZFU1QiLCJvZmZsaW5lRmFsbGJhY2tQYWdlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZGF0YSIsInR5cGUiLCJza2lwV2FpdGluZyIsIndhaXRVbnRpbCIsImNhY2hlcyIsIm9wZW4iLCJ0aGVuIiwiY2FjaGUiLCJhZGQiLCJuYXZpZ2F0aW9uUHJlbG9hZCIsImlzU3VwcG9ydGVkIiwiZW5hYmxlIiwicm91dGluZyIsInJlZ2lzdGVyUm91dGUiLCJSZWdFeHAiLCJzdHJhdGVnaWVzIiwiU3RhbGVXaGlsZVJldmFsaWRhdGUiLCJjYWNoZU5hbWUiLCJyZXF1ZXN0IiwibW9kZSIsInJlc3BvbmRXaXRoIiwicHJlbG9hZFJlc3AiLCJwcmVsb2FkUmVzcG9uc2UiLCJuZXR3b3JrUmVzcCIsImZldGNoIiwiZXJyb3IiLCJjYWNoZWRSZXNwIiwibWF0Y2giXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./public/custom-sw.js\n"));

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