// 1. تغییر نام کش - این خیلی مهمه!
const CACHE_NAME = 'waste-app-cache-v2'; // نسخه رو از v1 به v2 تغییر دادیم

// 2. لیست کامل فایل‌ها برای کش شدن
const urlsToCache = [
  '/', // این آدرس ریشه است
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' // فایل آیکون‌ها
];

// هنگام نصب سرویس ورکر، فایل‌ها را کش کن
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// هنگام دریافت درخواست (fetch)، از کش استفاده کن
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر فایل در کش بود، همان را برگردان
        if (response) {
          return response;
        }
        // اگر نبود، از اینترنت بگیر
        return fetch(event.request);
      })
  );
});

// 3. حذف کش‌های قدیمی (بخش بسیار مهم برای آپدیت‌ها)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // فقط کش با نام جدید مجاز است
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // اگر نام کش در لیست مجاز نبود، آن را حذف کن
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
