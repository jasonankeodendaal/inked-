// service-worker.js

// Import Workbox from Google's CDN - Upgraded to latest version for performance and features.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

// Precache the main application shell files and the offline page.
// This makes subsequent loads much faster and ensures the offline fallback is always available.
workbox.precaching.precacheAndRoute([
    { url: '/', revision: null },
    { url: '/index.html', revision: null },
    { url: '/index.tsx', revision: null },
    { url: '/favicon.svg', revision: null },
    { url: '/offline.html', revision: null },
    { url: 'https://i.ibb.co/d4dC0B4g/31e985d7-135f-4a54-98f9-f110bd155497-1.png', revision: null }, // Main Logo, used on offline page
]);

// Ensure the new service worker activates immediately to provide updates faster.
self.addEventListener('install', () => {
    self.skipWaiting();
});

// Take control of all open clients and clean up old caches as soon as the service worker activates.
self.addEventListener('activate', event => {
    // The 'activate' event is the perfect place to clean up old caches.
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches created by the previous service worker.
                    if (cacheName.startsWith('pwabuilder-')) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Caching strategy for pages (HTML).
// Network first ensures users get the latest content, falling back to cache if offline.
// If both fail, the precached offline page is served for a great offline experience.
workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
        cacheName: 'pages-cache',
        plugins: [
            {
                // This custom plugin catches errors (e.g., offline) and serves the fallback page.
                handlerDidError: async () => await caches.match('/offline.html'),
            },
        ],
    })
);

// Caching strategy for assets (CSS, JS, images, fonts).
// Stale-While-Revalidate provides a balance of speed (serving from cache) and freshness (updating in the background).
workbox.routing.registerRoute(
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'worker' ||
        request.destination === 'image' ||
        request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'assets-cache',
        plugins: [
            // Ensure that only successful responses are cached and handle opaque responses from CDNs.
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            // Keep the cache from growing indefinitely.
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100, // Max 100 assets
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);
