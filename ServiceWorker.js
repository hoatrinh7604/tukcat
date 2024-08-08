const cacheName = "CatB-Cat Battle-1.0.88";
const contentToCache = [
    "Build/WebGL.loader.js",
    "Build/WebGL.framework.js.unityweb",
    "Build/WebGL.data.unityweb",
    "Build/WebGL.wasm.unityweb",
    "TemplateData/style.css",
    "index.js",
	"index.html",
    "load-sdk.js",
];

// self.addEventListener('install', function(event) {
	// console.log('ServiceWorker 2 -' + CACHE_NAME);
    // self.skipWaiting();  // Activate worker immediately
    // event.waitUntil(
        // caches.open(CACHE_NAME)
            // .then(function(cache) {
				// console.log('[Service Worker] Caching new resource:');
                // return cache.addAll(contentToCache);
            // })
    // );
// });

self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install cacheName=" + cacheName);
  //self.skipWaiting();  // Activate worker immediately
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name !== cacheName;
          })
          .map((name) => {
            console.log("[Service Worker] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );

  e.waitUntil(
    (async function () {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(contentToCache);
	  await self.skipWaiting();
    })()
  );
});


// self.addEventListener('activate', function(event) {
	// console.log('[Service Worker] Delete!!!');
	// const currentCaches = [cacheName];
    // event.waitUntil(
        // caches.keys().then(function(cacheNames) {
			// console.log('[Service Worker] Delete!!! = ' + cacheNames);
            // return Promise.all(
                // cacheNames.map(function(cacheName) {
					// console.log('[Service Worker] Delete!!! cacheName = ' + cacheName);
                    // if (cacheName !== CACHE_NAME) {
						// console.log('[Service Worker] Delete!!!');
                        // return caches.delete(cacheName);
                    // }
                // })
            // );
        // })
    // );
    // return self.clients.claim();
// });
self.addEventListener('activate', event => {
	const currentCaches = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", function (e) {
	console.log("[Service Worker] Install cacheName=" + cacheName);
  e.respondWith(
    (async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) {
        return response;
      }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      if(e.request.method !== "GET") {
        return Promise.reject('no-match')
      }
	   else
	  {
		cache.put(e.request, response.clone());
	  }
      return response;
    })()
  );
});

// Listening for messages from the client
self.addEventListener('message', function(event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Inform clients about the new version
// self.addEventListener('activate', event => {
    // event.waitUntil(
        // self.clients.matchAll().then(clients => {
            // clients.forEach(client => {
                // client.postMessage('newVersionAvailable');
            // });
        // })
    // );
// });
