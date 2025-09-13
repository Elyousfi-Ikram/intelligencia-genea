const CACHE_NAME = 'intelligencia-genea-v1';
const urlsToCache = [
  '/',
  '/assets/header/logo.webp',
  '/assets/homePage/enqueteur.webp',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});