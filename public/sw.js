const CACHE = 'salina-v4';
const SHELL = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // API volání — vždy ze sítě, nikdy z cache
  if (e.request.url.includes('/api/')) return;

  // Shell — cache first, fallback na síť
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
