const cacheName = "complement-cache-v2";
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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME) // Keep only the new cache
          .map((cache) => caches.delete(cache))
      );
    })
  );
});
