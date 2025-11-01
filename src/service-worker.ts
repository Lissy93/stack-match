/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Assets to cache on install
const ASSETS = [
  ...build, // SvelteKit build files
  ...files  // Static files in /static
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

// Activate event - delete old caches
self.addEventListener('activate', (event) => {
  async function deleteOldCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== CACHE)
        .map((name) => caches.delete(name))
    );
  }

  event.waitUntil(deleteOldCaches());
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  async function respond() {
    const cache = await caches.open(CACHE);

    // Try to serve from cache first (for build assets and static files)
    if (ASSETS.includes(url.pathname)) {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // For API requests, use network-first strategy with cache fallback
    if (url.pathname.startsWith('/api/')) {
      try {
        const response = await fetch(event.request);

        // Cache successful API responses
        if (response.ok) {
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (err) {
        // If network fails, try cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw err;
      }
    }

    // For data.json, use network-first with cache fallback
    if (url.pathname === '/data.json') {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        throw err;
      }
    }

    // For pages, use network-first strategy
    try {
      const response = await fetch(event.request);

      // Cache successful responses
      if (response.ok) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      // If network fails, try cache
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Return a custom offline page or error
      return new Response('Offline - Please check your connection', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    }
  }

  event.respondWith(respond());
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
