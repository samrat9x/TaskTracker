const cacheName = "complement-cache-v3";
const assetsToCache = [
  "index.html",
  "manifest.json",
  "icon-192x192.png", // Add your icon files here
  "icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("install", (event) => {
  // Force the waiting service worker to become active
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim control of the current page
  event.waitUntil(clients.claim());
});
