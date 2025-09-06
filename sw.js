/**
 * Service Worker para Llaveros3D
 * Cachea recursos críticos para carga instantánea
 */

const CACHE_NAME = 'llaveros3d-v1.0.0';
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/styles.min.css',
    '/script-critical.js',
    '/assets/logo.svg',
    '/assets/carousel/soraire-design-1-small.webp',
    '/assets/carousel/soraire-design-1-small.jpg'
];

const STATIC_RESOURCES = [
    '/script-non-critical.js',
    '/load-css.js',
    '/analytics-modern.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cacheando recursos críticos');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Instalado correctamente');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error en instalación', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Eliminando cache antiguo', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activado correctamente');
                return self.clients.claim();
            })
    );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo interceptar solicitudes del mismo origen
    if (url.origin !== location.origin) {
        return;
    }
    
    // Estrategia para recursos críticos: Cache First
    if (CRITICAL_RESOURCES.some(resource => request.url.includes(resource))) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        console.log('Service Worker: Sirviendo desde cache', request.url);
                        return response;
                    }
                    
                    // Si no está en cache, hacer fetch y cachear
                    return fetch(request)
                        .then(fetchResponse => {
                            if (fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return fetchResponse;
                        });
                })
        );
    }
    
    // Estrategia para recursos estáticos: Stale While Revalidate
    else if (STATIC_RESOURCES.some(resource => request.url.includes(resource))) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    const fetchPromise = fetch(request)
                        .then(fetchResponse => {
                            if (fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return fetchResponse;
                        });
                    
                    return response || fetchPromise;
                })
        );
    }
    
    // Estrategia para imágenes: Cache First con fallback
    else if (request.destination === 'image') {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(request)
                        .then(fetchResponse => {
                            if (fetchResponse.status === 200) {
                                const responseClone = fetchResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return fetchResponse;
                        })
                        .catch(() => {
                            // Fallback para imágenes rotas
                            return new Response('', { status: 404 });
                        });
                })
        );
    }
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
