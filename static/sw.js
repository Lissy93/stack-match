// Stub file to prevent 404 errors from browsers that auto-request /sw.js
// The actual service worker is at /service-worker.js (registered via hooks.client.ts)

// This is an empty service worker that does nothing
// It exists only to prevent console errors from speculative browser requests
self.addEventListener('install', () => {
  // Immediately activate
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Take control immediately
  self.clients.claim();
});

// No fetch handler - this service worker doesn't intercept any requests
