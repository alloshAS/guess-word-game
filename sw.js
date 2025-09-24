self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("guess-word-game-cache-v1").then(cache => {
      return cache.addAll([
        "/guess-word-game/",
        "/guess-word-game/index.html",
        "/guess-word-game/style.css",
        "/guess-word-game/script.js",
        "/guess-word-game/images",
        "/guess-word-game/audio",
        "/guess-word-game/manifest.json",
        "/guess-word-game/words.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
