// Import modul Workbox yang dibutuhkan
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';

import { BASE_URL } from './config';

// Ambil manifest dan aktifkan pre-caching
const assetManifest = self.__WB_MANIFEST;
precacheAndRoute(assetManifest);

// Caching untuk Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'fonts-cache',
  })
);

// Caching untuk CDN FontAwesome atau CDN lain yang mengandung 'fontawesome'
registerRoute(
  ({ url }) =>
    url.origin === 'https://cdnjs.cloudflare.com' ||
    url.hostname.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome-cache',
  })
);

// Caching untuk avatar dari ui-avatars.com
registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'ava-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Network First untuk data dari backend (selain gambar)
registerRoute(
  ({ request, url }) => {
    const apiOrigin = new URL(BASE_URL).origin;
    return url.origin === apiOrigin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'API-cache',
  })
);

// Caching gambar dari backend dengan strategi StaleWhileRevalidate
registerRoute(
  ({ request, url }) => {
    const apiOrigin = new URL(BASE_URL).origin;
    return url.origin === apiOrigin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'API-images',
  })
);

// Caching MapTiler static maps tiles
registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({
    cacheName: 'map-tiles-cache',
  })
);

// Listener push notification
self.addEventListener('push', event => {
  console.log('[SW] Push event received');

  const showNotif = async () => {
    await self.registration.showNotification('Notifikasi Baru!', {
      body: 'Cerita terbaru telah ditambahkan.',
    });
  };

  event.waitUntil(showNotif());
});
