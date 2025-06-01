const CACHE_NAME = "offline-cache-v1";
const OFFLINE_URL = "/index.html"; // fallback for React Router

// Install: Cache the main shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(["/", OFFLINE_URL, "/manifest.json", "/favicon.ico"])
      )
  );
  self.skipWaiting(); // activate immediately
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache as you go (runtime caching)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((response) => {
            // Optional: cache only static assets
            if (
              event.request.url.includes("/static/") ||
              event.request.url.endsWith(".js") ||
              event.request.url.endsWith(".css")
            ) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }
            return response;
          })
          .catch(() => caches.match(OFFLINE_URL)) // Fallback to index.html
      );
    })
  );
});
