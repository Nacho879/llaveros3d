/**
 * Google Analytics 4 - Implementación ultra-optimizada
 * Carga condicional solo cuando se necesita, reduce JavaScript no utilizado
 */

(function() {
    'use strict';
    
    // Configuración
    const GA_MEASUREMENT_ID = 'G-LNWWRG1GB3';
    let analyticsLoaded = false;
    let analyticsQueue = [];
    
    // Configurar dataLayer mínimo
    window.dataLayer = window.dataLayer || [];
    
    // Función gtag ligera que encola eventos hasta que se carga GA
    function gtag() {
        if (analyticsLoaded) {
            dataLayer.push(arguments);
        } else {
            analyticsQueue.push(arguments);
        }
    }
    
    // Función para cargar Google Analytics solo cuando sea necesario
    function loadGoogleAnalytics() {
        if (analyticsLoaded) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            script.crossOrigin = 'anonymous';
            
            script.onload = function() {
                analyticsLoaded = true;
                
                // Configurar GA4 con configuración mínima
                gtag('js', new Date());
                gtag('config', GA_MEASUREMENT_ID, {
                    send_page_view: false,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false,
                    transport_type: 'beacon'
                });
                
                // Procesar cola de eventos
                analyticsQueue.forEach(event => dataLayer.push(event));
                analyticsQueue = [];
                
                // Enviar page_view
                gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname
                });
                
                resolve();
            };
            
            script.onerror = function() {
                console.warn('Google Analytics no pudo cargar');
                reject(new Error('Failed to load Google Analytics'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Cargar GA solo en interacciones del usuario o después de un delay
    function initializeAnalytics() {
        let loaded = false;
        
        // Función para cargar GA
        const loadGA = () => {
            if (!loaded) {
                loaded = true;
                loadGoogleAnalytics().catch(() => {});
            }
        };
        
        // Cargar en interacciones del usuario
        const events = ['click', 'scroll', 'keydown', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, loadGA, { once: true, passive: true });
        });
        
        // Cargar después de 3 segundos si no hay interacción
        setTimeout(loadGA, 3000);
        
        // Cargar cuando la página esté completamente cargada
        if (document.readyState === 'complete') {
            setTimeout(loadGA, 1000);
        } else {
            window.addEventListener('load', () => setTimeout(loadGA, 1000));
        }
    }
    
    // Inicializar solo en producción y después de interacción del usuario
    if (window.location.hostname === 'llavero3d.com' || window.location.hostname === 'www.llavero3d.com') {
        // Solo inicializar después de la primera interacción del usuario
        let userInteracted = false;
        
        const initOnInteraction = () => {
            if (!userInteracted) {
                userInteracted = true;
                initializeAnalytics();
            }
        };
        
        // Escuchar interacciones del usuario
        const events = ['click', 'scroll', 'keydown', 'touchstart', 'mousemove'];
        events.forEach(event => {
            document.addEventListener(event, initOnInteraction, { once: true, passive: true });
        });
        
        // Fallback: cargar después de 5 segundos si no hay interacción
        setTimeout(() => {
            if (!userInteracted) {
                initOnInteraction();
            }
        }, 5000);
    }
    
    // Exponer gtag globalmente
    window.gtag = gtag;
    
})();
