/**
 * SDN 2 Ngeposari - Progressive Web App Service Worker
 * Implements Google Modern Web Guidance caching strategies:
 * 1. NetworkFirst for HTML navigation requests (always fresh, offline fallback)
 * 2. StaleWhileRevalidate for versioned static assets (CSS, JS, WebP, AVIF, Fonts)
 * 3. Automatic Cache Purge for obsolete cache versions on activate
 */

const CACHE_NAME = 'sdn2-cache-v7.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './tentang.html',
  './fasilitas.html',
  './kegiatan.html',
  './kontak.html',
  './admin.html',
  './css/styles.css?v=7.0',
  './js/config/constants.js?v=7.0',
  './js/utils/formatters.js?v=7.0',
  './js/utils/guards.js?v=7.0',
  './js/components/ui/ConfirmModal.js?v=7.0',
  './js/components/layout/Navbar.js?v=7.0',
  './js/components/layout/Footer.js?v=7.0',
  './js/db.js?v=7.0',
  './js/admin.js?v=7.0',
  './js/main.js?v=7.0',
  './images/logo.webp',
  './images/favicon.png',
  './images/school_hero_bg.webp',
  './site.webmanifest'
];

// Install Event: Pre-cache critical application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache addAll partial warning:', err);
      });
    })
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent routing based on request destination
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Bypass Google Analytics, Firebase live cloud streams, and browser extension schemes
  if (
    url.protocol.startsWith('chrome') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com')
  ) {
    return;
  }

  // 1. Navigation Requests (HTML Pages): NetworkFirst
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedRes = await caches.match(req);
          if (cachedRes) return cachedRes;
          const fallback = await caches.match('./index.html');
          return fallback || Response.error();
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, Images, Fonts): StaleWhileRevalidate
  const isStaticAsset =
    req.destination === 'style' ||
    req.destination === 'script' ||
    req.destination === 'image' ||
    req.destination === 'font' ||
    url.pathname.match(/\.(css|js|webp|avif|png|jpg|jpeg|svg|woff2|ico)$/i);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => cachedRes);

        // Serve from cache immediately if present, otherwise await network
        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
