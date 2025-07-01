// 1. نسخه کش را حتماً عوض کنید تا مرورگر مجبور به آپدیت شود
const CACHE_NAME = 'form-offline-v3'; // از v1 به v2 تغییر یافت

// 2. لیست کامل و صحیح فایل‌ها
const urlsToCache = [
  './',
  './index.html',
  './style.css',          // <<< این اضافه شد
  './script.js',          // <<< این اضافه شد
  './manifest.json',      // <<< این اضافه شد
  './assets/css/jdp.min.css',
  './assets/css/bootstrap-icons.min.css',
  './assets/css/choices.min.css',
  './assets/js/html2canvas.min.js',
  './assets/js/jdp.min.js',
  './assets/js/choices.min.js',
  './assets/fonts/vazirmatn/Vazirmatn-RD-Regular.woff2',
  './assets/fonts/vazirmatn/Vazirmatn-RD-Medium.woff2',
  './assets/fonts/vazirmatn/Vazirmatn-RD-Bold.woff2',
  './assets/fonts/bootstrap-icons.woff',
  './assets/fonts/bootstrap-icons.woff2',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

// رویداد نصب: فایل‌ها را در کش ذخیره می‌کند
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching new files for version:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // سرویس ورکر جدید را بلافاصله فعال می‌کند
});

// رویداد fetch: درخواست‌ها را رهگیری کرده و از کش پاسخ می‌دهد
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر پاسخ در کش موجود بود، آن را برمی‌گرداند. در غیر این صورت از شبکه درخواست می‌کند.
        return response || fetch(event.request);
      })
  );
});

// رویداد activate: کش‌های قدیمی را پاک می‌کند
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
