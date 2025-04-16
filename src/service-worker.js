const CACHE_NAME = 'offline';
const OFFLINE_URL = '/pages/offline.html';


self.addEventListener('install', event => {
    console.log('Installing...');

    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.add(
                new Request(OFFLINE_URL, { cache: 'reload' }),     // the browser fetches the resource from the remote server and update the cache
            );
        })()
    );

    self.skipWaiting();     // Force the waiting service worker to become the active service worker
});


self.addEventListener('activate', event => {
    console.log('Activating...');
});


self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            try {

                const preloadResponse = await event.preloadResponse;    // try to use the navigation preload if it's supported
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(event.request);     // always try the network
                return networkResponse;

            } catch (error) {
                console.log('Fetch failed; returning offline page instead.', error);    // probably a network error
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        })()
    );
});