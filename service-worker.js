const CACHE = "pwabuilder-offline-page";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = "offline.html";
const assetsToCache = [
    offlineFallbackPage,
    // Logo used on the offline page
    'https://i.ibb.co/d4dC0B4g/31e985d7-135f-4a54-98f9-f110bd155497-1.png',
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(assetsToCache))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Cache assets (CSS, JS, images) using a Stale-While-Revalidate strategy.
// This route will not handle navigation requests, which are handled by the custom fetch listener below.
workbox.routing.registerRoute(
  ({request}) => request.mode !== 'navigate',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

// Custom fetch handler for navigation requests: try network, then fallback to offline page.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        console.log('Fetch failed; returning offline page instead.', error);
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
