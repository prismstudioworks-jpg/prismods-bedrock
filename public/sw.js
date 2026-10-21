// Service Worker for PWA

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Required fetch handler for PWA installation
  event.respondWith(
    fetch(event.request).catch(() => {
      // You can add offline fallbacks here later if you want
    })
  );
});
