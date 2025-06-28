// service-worker.js
// نام و نسخه کش
const CACHE_NAME = 'form-offline-v1';

// لیست تمام فایل‌هایی که برای کارکرد آفلاین برنامه نیاز است
const urlsToCache = [
  './',
  './index.html',
  './assets/css/jdp.min.css',
  './assets/css/bootstrap-icons.min.css',
  './assets/css/choices.min.css',
  './assets/js/html2canvas.min.js',
  './assets/js/jdp.min.js',
  './assets/js/choices.min.js',
  './assets/fonts/vazirmatn/Vazirmatn-RD-Regular.woff2', // دقت کنید که اسم فایل فونت دقیقاً همین باشه
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
        console.log('Opened cache');
        return cache.addAll(urlsToCache)
          .catch(error => { // **اینجا اضافه شد**
            console.error('Failed to add to cache:', error);
            // می‌توانید اینجا یک پیام خطا هم به کاربر نشان دهید
          });
      })
  );
});

// رویداد fetch: درخواست‌ها را رهگیری کرده و از کش پاسخ می‌دهد
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر پاسخ در کش موجود بود، آن را برمی‌گرداند
        if (response) {
          return response;
        }
        // در غیر این صورت، درخواست را به شبکه ارسال می‌کند
        return fetch(event.request)
          .catch(() => { // **می‌توانید یک fallback برای حالت آفلاین اضافه کنید**
            // مثلاً برای صفحات HTML:
            // return caches.match('/offline.html');
            // یا یک پاسخ خالی برای جلوگیری از خطا
            return new Response('You are offline and the requested resource is not in the cache.', { status: 503, statusText: 'Service Unavailable' });
          });
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
