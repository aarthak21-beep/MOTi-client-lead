const CACHE_NAME = 'motiq-pwa-v2';
const BASE = '/MOTi-client-lead/';
const SHELL = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'pwa-icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('motiq-pwa-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Always try the latest deployed page first; use the cached shell only offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(BASE + 'index.html', copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(BASE + 'index.html')) || caches.match(BASE))
    );
    return;
  }

  // Network-first prevents Chrome from keeping old JS/CSS bundles after deployment.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => await caches.match(request) || Response.error())
  );
});
