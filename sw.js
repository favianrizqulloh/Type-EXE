/* Service Worker for TypeEXE - simple cache-first strategy
   Notes:
   - This SW will cache core app shell assets so the app can load offline after a first online visit.
   - To embed Chart.js and Fira Code offline, place the files at:
       /assets/vendor/chart.min.js
       /assets/fonts/FiraCode.woff2
     then reload the app while online so the SW caches them.
   - Update CACHE_VERSION to invalidate caches on new releases.
*/

const CACHE_VERSION = 'v1';
const CACHE_NAME = `typeexe-static-${CACHE_VERSION}`;

const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/logo.png',
  '/assets/vendor/chart.min.js',
  '/assets/fonts/FiraCode.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS.map((p) => new Request(p, { cache: 'reload' }))).catch((err) => {
        // If any core asset fails to cache, still finish install so app can try network fallback.
        console.warn('SW: cache.addAll failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Always try cache first for navigation and same-origin assets
  if (req.mode === 'navigate' || url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          // Optionally cache the fetched resource
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        }).catch(() => {
          // Fallback: if navigation and index.html cached, return it
          return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // For other requests (CDN or fonts), try cache first then network
  event.respondWith(
    caches.match(req).then((resp) => resp || fetch(req).then((res) => {
      // cache streaming-safe copy for same-origin assets only
      if (url.origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return res;
    })).catch(() => {
      // If everything fails, try a generic fallback (not provided)
      return new Response('', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});
