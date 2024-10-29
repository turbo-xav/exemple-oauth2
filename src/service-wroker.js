// service-worker.js
self.addEventListener('install', (event) => {
  console.log("Service Worker installed");
});

self.addEventListener('activate', (event) => {
  console.log("Service Worker activated");
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_TOKEN') {
    self.token = event.data.token;
  }
});

self.addEventListener('fetch', (event) => {
  if (self.token && event.request.url.includes('/api/')) {
    const modified = new Request(event.request, {
      headers: {
        'Authorization': `Bearer ${self.token}`,
      },
    });
    event.respondWith(fetch(modified));
  }
});
