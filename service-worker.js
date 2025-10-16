const CACHE_NAME = 'beautively-inked-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  // Critical CSS & Fonts
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Dancing+Script:wght@700&display=swap',
  // Critical JS libraries
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  // Key Images
  'https://i.ibb.co/d4dC0B4g/31e985d7-135f-4a54-98f9-f110bd155497-1.png', // Logo
  'https://i.ibb.co/Mkfdy286/image-removebg-preview.png' // Hero BG
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Ignore non-GET requests and chrome extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // For navigation requests (e.g., loading the page), use a Network Falling Back to Cache strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If the network request is successful, cache it and return it.
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If the network request fails, try to serve the response from the cache.
          // Fallback to the root page if the specific page isn't cached.
          return caches.match(event.request).then(response => response || caches.match('/'));
        })
    );
    return;
  }

  // For all other requests (assets like CSS, JS, images), use a Stale-While-Revalidate strategy.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Fetch the latest version from the network.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If successful, update the cache.
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });

        // Return the cached response immediately if it exists, otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      });
    })
  );
});


// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
