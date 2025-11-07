const CACHE_NAME = "savorly-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/materialize.css",
  "/js/materialize.min.js",
  "/js/materialize.js",
  "/js/ui.js",
  "/js/firebaseDB.js",
  "/img/recipe.png",
  "/img/food.png",
  "/img/icons/apple-touch-icon.png",
  "/img/icons/favicon.ico",
  "/img/icons/logoFull.png",
  "/img/icons/logoSmall.png",
  "/img/icons/savorly-16.png",
  "/img/icons/savorly-32.png",
  "/img/icons/savorly-192.png",
  "/img/icons/savorly-512.png" 

];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service worker: Deleting old cache");
            return cache.delete(cacheNames);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching...", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});