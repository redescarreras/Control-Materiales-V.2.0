// Service Worker para Control Material V-2.0
const CACHE_NAME = 'material-v2-cache-v1';

// Archivos básicos de la interfaz para guardar offline
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './logo-redes_Transparente-216x216.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// 1. INSTALACIÓN: Guarda los archivos de la interfaz en la caché del dispositivo (PC/Tablet)
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 PWA: Archivos cacheados correctamente');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. ACTIVACIÓN: Limpia cachés viejas si actualizas la versión de la app
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 PWA: Limpiando caché antigua');
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH: Intercepta las peticiones
self.addEventListener('fetch', function(event) {
    // Evita interceptar peticiones a Firebase y librerías externas complejas
    if (!event.request.url.startsWith('http') || event.request.url.includes('firebase')) {
        return;
    }

    event.respondWith(
        fetch(event.request).then(function(response) {
            // Si hay internet, devuelve la versión fresca y la guarda en caché
            return caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch(function() {
            // Si no hay internet (estás offline en la tablet), devuelve la versión guardada
            return caches.match(event.request);
        })
    );
});