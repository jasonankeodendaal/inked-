const CACHE_PAGES = "pwabuilder-pages";
const CACHE_ASSETS = "pwabuilder-assets";
const CACHE_OFFLINE = "pwabuilder-offline-fallback";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = "offline.html";
const offlineFallbackImage = 'https://i.ibb.co/d4dC0B4g/31e985d7-135f-4a54-98f9-f110bd155497-1.png';

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE_OFFLINE)
      .then((cache) => cache.addAll([offlineFallbackPage, offlineFallbackImage]))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Strategy for navigation (HTML pages)
// Network first, falling back to cache. If both fail, serve the offline page.
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE_PAGES,
    plugins: [
      {
        handlerDidError: async () => {
          const cache = await caches.open(CACHE_OFFLINE);
          return await cache.match(offlineFallbackPage);
        },
      },
    ],
  })
);

// Strategy for assets (CSS, JS, images, fonts, etc.)
// Stale while revalidate is good for assets that don't change often.
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'image' ||
    request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE_ASSETS,
  })
);
