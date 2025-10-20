// sw.js - simple cache-first service worker for the site shell

const CACHE_NAME = 'papagayos-v1';
const PRECACHE_ASSETS = [
  '/', '/index.html',
  '/assets/css/app.css',
  '/assets/js/app.js',
  '/assets/icons/logo_papagayos.jpg',
  '/assets/images/1118.jpg'
  // No agrego las 01..19 por defecto; se pueden añadirse luego si querés que se pre-cacheen.
];

// install: cache shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

// activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// fetch: cache-first for navigation and assets
self.addEventListener('fetch', event => {
  const req = event.request;
  // only handle GET
  if(req.method !== 'GET') return;
  // network-first for API-ish requests (none here), otherwise cache-first
  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(response => {
        // optionally cache the response
        return caches.open(CACHE_NAME).then(cache => {
          // clone and store; exclude opaque responses from cross-origin CDN if needed
          try { cache.put(req, response.clone()); } catch(e){/* ignore */ }
          return response;
        });
      }).catch(() => {
        // fallback for navigation to index.html
        if (req.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});

