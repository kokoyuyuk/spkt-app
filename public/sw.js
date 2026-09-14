// Ini adalah Service Worker ringkas untuk melepasi syarat PWA (Installable)
self.addEventListener('install', (event) => {
  console.log('Pekerja Servis SPKT sedang dipasang di latar belakang!');
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Biarkan kosong dahulu. Ini cukup untuk memberitahu Chrome bahawa kita sedia menjadi App!
});