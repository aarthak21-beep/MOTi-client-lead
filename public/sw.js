const CACHE_NAME = 'motiq-pwa-v1';
const BASE = '/MOTi-client-lead/';
const SHELL = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest', BASE + 'pwa-icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('motiq-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => { const copy=res.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(BASE+'index.html',copy)); return res; }).catch(async()=> (await caches.match(BASE+'index.html')) || caches.match(BASE)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => { if(res.ok && res.type==='basic'){const copy=res.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));} return res; })));
});
