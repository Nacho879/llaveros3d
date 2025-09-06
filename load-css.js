/**
 * Cargador de CSS no bloqueante
 * Carga el CSS de forma asíncrona después del renderizado inicial
 */

(function() {
    'use strict';
    
    // Función para cargar CSS de forma no bloqueante
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    
    // Cargar CSS después del renderizado inicial
    function initializeCSS() {
        // Cargar cuando el navegador esté libre
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                loadCSS('styles.min.css').catch(() => {
                    console.warn('No se pudo cargar el CSS externo');
                });
            }, { timeout: 2000 });
        } else {
            setTimeout(() => {
                loadCSS('styles.min.css').catch(() => {
                    console.warn('No se pudo cargar el CSS externo');
                });
            }, 100);
        }
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCSS);
    } else {
        initializeCSS();
    }
    
})();
