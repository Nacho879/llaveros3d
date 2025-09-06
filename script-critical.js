/**
 * Script crítico - Solo funciones esenciales para el renderizado inicial
 * Reduce JavaScript no utilizado y mejora el rendimiento
 */

(function() {
    'use strict';
    
    // Utilidades críticas
    const $ = (id) => document.getElementById(id);
    
    // Función segura para acceder a elementos del DOM
    function safeGetElement(id, fallback = null) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Elemento con ID '${id}' no encontrado`);
            return fallback;
        }
        return element;
    }
    
    // Función segura para establecer textContent
    function safeSetText(id, text, fallback = '') {
        const element = safeGetElement(id);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`⚠️ No se pudo establecer textContent en '${id}': ${text}`);
        }
    }
    
    // Configurar año en footer (crítico)
    safeSetText('currentYear', new Date().getFullYear());
    
    // Menú móvil básico (crítico)
    function setupMobileMenu() {
        const mobileMenuToggle = safeGetElement('mobileMenuToggle');
        const mobileNav = safeGetElement('mobileNav');
        
        if (!mobileMenuToggle || !mobileNav) {
            console.warn('⚠️ Elementos del menú móvil no encontrados');
            return;
        }
        
        // Toggle del menú hamburguesa
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mobileMenuToggle.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
    
    function openMobileMenu() {
        const mobileMenuToggle = safeGetElement('mobileMenuToggle');
        const mobileNav = safeGetElement('mobileNav');
        
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.classList.add('active');
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
            mobileMenuToggle.setAttribute('aria-label', 'Cerrar menú');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
    }
    
    function closeMobileMenu() {
        const mobileMenuToggle = safeGetElement('mobileMenuToggle');
        const mobileNav = safeGetElement('mobileNav');
        
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration.scope);
                })
                .catch(error => {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }

    // Inicialización crítica
    document.addEventListener('DOMContentLoaded', function() {
        setupMobileMenu();
        
        // Cargar funciones no críticas después
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadNonCriticalScripts);
        } else {
            setTimeout(loadNonCriticalScripts, 100);
        }
    });
    
    // Cargar script no crítico
    function loadNonCriticalScripts() {
        const script = document.createElement('script');
        script.src = 'script-non-critical.js';
        script.defer = true;
        document.head.appendChild(script);
    }
    
})();
