// service-worker.js
// A robust, offline-first service worker.

const CACHE_NAME = 'beautively-inked-cache-v1';

// Files to cache on install. These form the "app shell".
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx', // The main JS module
  '/manifest.json',
  '/offline.html', // The offline fallback page
  'https://i.ibb.co/fVzq56Ng/31e985d7-135f-4a54-98f9-f110bd155497-2.png', // Main logo
];

// Install event: cache the app shell.
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => {
      // Activate the new service worker immediately.
      return self.skipWaiting();
    })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', name);
            return caches.delete(name);
          }
        })
      )
    ).then(() => {
        // Take control of all open clients.
        return self.clients.claim();
    })
  );
});

// Fetch event: handle requests with different strategies.
self.addEventListener('fetch', event => {
  // For navigation requests (e.g., loading a page), use a Network-First strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If the network request is successful, cache it and return it.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If the network fails, try to serve the page from the cache.
          // If it's not in the cache, serve the offline fallback page.
          return caches.match(event.request)
            .then(response => response || caches.match('/offline.html'));
        })
    );
    return;
  }

  // For other requests (assets like images, scripts), use a Cache-First, then network strategy.
  // This is fast and efficient for static assets.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // If we have a cached response, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise, fetch from the network.
      return fetch(event.request).then(networkResponse => {
        // Cache the new response for future use and return it.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
