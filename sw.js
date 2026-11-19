const CACHE_NAME = 'aufstellung-d1-v11';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/fonts/barlow-400-latin.woff2',
  './vendor/fonts/barlow-400-latin-ext.woff2',
  './vendor/fonts/barlow-600-latin.woff2',
  './vendor/fonts/barlow-600-latin-ext.woff2',
  './vendor/fonts/barlow-700-latin.woff2',
  './vendor/fonts/barlow-700-latin-ext.woff2',
  './vendor/fonts/barlow-condensed-700-latin.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => cached);
    })
  );
});
