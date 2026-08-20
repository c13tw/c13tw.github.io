const CACHE_NAME = "money-diary-pwa-v1";
const PRECACHE_URLS = [
  "./pwa.html",
  "./index.html",
  "./manifest.webmanifest",
  "./app-icon.svg",
  "../hero-main.png",
  "../boy-computer.png",
  "../boy-wave.png",
  "../boy-money.png",
  "../boy-notebook.png",
  "../boy-podium.png",
  "../cat-black-peek2.png",
  "../cat-tabby-peek.png",
  "../cat-tabby-peek2.png",
  "../cat-black-wallet.png",
  "../cat-tabby-calculator.png",
  "../cat-black-growth.png",
  "../cats-duo-coins.png",
  "../cats-sleep-together.png",
  "../scene-desk-all.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        if(!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => {
        if(event.request.mode === "navigate") return caches.match("./pwa.html");
      });
    })
  );
});