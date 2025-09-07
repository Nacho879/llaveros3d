/**
 * Script no crítico - Funciones que se cargan después del renderizado inicial
 * Incluye animaciones, carrusel, formularios y otras funcionalidades
 */

(function() {
    'use strict';
    
    // Utilidades
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
    
    // Función segura para obtener value
    function safeGetValue(id, fallback = '') {
        const element = safeGetElement(id);
        return element ? element.value : fallback;
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => messageEl.classList.add('show'), 100);
        
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => document.body.removeChild(messageEl), 300);
        }, 3000);
    }
    
    // Función para agregar animaciones de entrada
    function addEntranceAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fade-in-up';
                    element.classList.add(`animate-${animationType}`);
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observar elementos con data-animation
        document.querySelectorAll('[data-animation]').forEach(el => {
            observer.observe(el);
        });

        // Observar secciones principales
        document.querySelectorAll('section').forEach((section, index) => {
            section.setAttribute('data-animation', 'fade-in-up');
            section.style.opacity = '0';
            observer.observe(section);
        });
    }
    
    // Variables globales para el carrusel
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Variables globales para el carrusel informativo
    let currentInfoSlideIndex = 0;
    const infoSlides = document.querySelectorAll('.info-slide');
    const infoDots = document.querySelectorAll('.info-dots .dot');
    
    // Funciones del carrusel
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
    }
    
    function changeSlide(direction) {
        currentSlideIndex += direction;
        
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        
        showSlide(currentSlideIndex);
    }
    
    function currentSlide(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }
    
    // Auto-play del carrusel optimizado
    function setupCarouselAutoPlay() {
        const carousel = document.querySelector('.sample-carousel');
        if (!carousel) return;
        
        let autoPlayInterval;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    autoPlayInterval = setInterval(() => changeSlide(1), 4000);
                } else {
                    clearInterval(autoPlayInterval);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(carousel);
        
        // Pausar auto-play al hacer hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => changeSlide(1), 4000);
        });
    }
    
    // Variables globales para drag & drop
    let originalImage = null;
    let imageData = null;
    
    // Drag & Drop
    function setupDragAndDrop() {
        const dropZone = safeGetElement('dropZone');
        const fileInput = safeGetElement('fileInput');
        
        if (!dropZone || !fileInput) {
            console.warn('⚠️ Elementos de drag & drop no encontrados');
            return;
        }
        
        // Prevenir comportamiento por defecto
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Efectos visuales
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Manejar archivos
        dropZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFileSelect);
        
        // Click en drop zone
        dropZone.addEventListener('click', () => fileInput.click());
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        const dropZone = safeGetElement('dropZone');
        if (dropZone) {
            dropZone.classList.add('drag');
        }
    }
    
    function unhighlight(e) {
        const dropZone = safeGetElement('dropZone');
        if (dropZone) {
            dropZone.classList.remove('drag');
        }
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
        
        const fileInput = safeGetElement('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
    }
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('El archivo es demasiado grande. Por favor selecciona una imagen de menos de 5MB.');
                    return;
                }
                loadImage(file);
            } else {
                alert('Por favor selecciona un archivo de logo válido (JPG, PNG, SVG).');
            }
        }
    }
    
    function loadImage(file) {
        showMessage('Cargando logo...', 'info');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                imageData = e.target.result;
                showImagePreview();
                showMessage('Logo cargado correctamente', 'success');
            };
            img.onerror = function() {
                showMessage('Error al cargar el logo', 'error');
            };
            img.src = e.target.result;
        };
        reader.onerror = function() {
            showMessage('Error al leer el archivo del logo', 'error');
        };
        reader.readAsDataURL(file);
    }
    
    function showImagePreview() {
        const dropContent = safeGetElement('dropContent');
        const imagePreview = safeGetElement('imagePreview');
        
        if (dropContent) dropContent.style.display = 'none';
        if (imagePreview) imagePreview.style.display = 'flex';
        
        drawImageCanvas();
    }
    
    function removeImage() {
        originalImage = null;
        imageData = null;
        
        const dropContent = safeGetElement('dropContent');
        const imagePreview = safeGetElement('imagePreview');
        const fileInput = safeGetElement('fileInput');
        
        if (dropContent) dropContent.style.display = 'block';
        if (imagePreview) imagePreview.style.display = 'none';
        if (fileInput) fileInput.value = '';
        
        showMessage('Logo eliminado', 'info');
    }
    
    function drawImageCanvas() {
        const canvas = safeGetElement('imgCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        
        if (originalImage) {
            const estilo = safeGetValue('estilo', '');
            
            if (estilo === 'silhouette') {
                drawSilhouette(ctx, width, height);
            } else {
                drawPhoto(ctx, width, height);
            }
        }
    }
    
    function drawPhoto(ctx, width, height) {
        const img = originalImage;
        const scale = Math.min(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        ctx.globalAlpha = 0.98;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        ctx.globalAlpha = 1.0;
    }
    
    function drawSilhouette(ctx, width, height) {
        const img = originalImage;
        const scale = Math.min(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        
        tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114);
            const value = luminance > 128 ? 255 : 0;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(tempCanvas, x, y);
    }
    
    // Event Listeners
    function setupEventListeners() {
        const elements = ['estilo', 'forma', 'tamaño', 'color', 'cantidad'];
        elements.forEach(id => {
            const element = safeGetElement(id);
            if (element) {
                element.addEventListener('change', updatePreviews);
                element.addEventListener('input', updatePreviews);
            }
        });
    }
    
    function updatePreviews() {
        if (originalImage) {
            drawImageCanvas();
        }
        updateOrderSummary();
        updateWhatsAppLink();
    }
    
    // Resumen del pedido
    function updateOrderSummary() {
        const cantidad = parseInt(safeGetValue('cantidad', '0'));
        const tamaño = safeGetValue('tamaño', '');
        const estilo = safeGetValue('estilo', '');
        const color = safeGetValue('color', '');
        const forma = safeGetValue('forma', '');
        
        const precioBase = 1.20;
        const iva = 0.21;
        const precioConIva = precioBase * (1 + iva);
        const precioTotal = precioConIva * cantidad;
        
        safeSetText('summaryCantidad', `${cantidad} unidad${cantidad > 1 ? 'es' : ''}`);
        safeSetText('summaryTamaño', `${tamaño}mm`);
        safeSetText('summaryEstilo', estilo === 'photo' ? 'Foto completa' : 'Silueta');
        safeSetText('summaryColor', getColorName(color));
        safeSetText('summaryForma', getFormaName(forma));
        safeSetText('summaryPrecio', `€${precioTotal.toFixed(2)} (sin envío)`);
    }
    
    function getColorName(color) {
        const colors = {
            '#ffffff': 'Blanco',
            '#000000': 'Negro',
            '#ff0000': 'Rojo',
            '#0000ff': 'Azul',
            '#00ff00': 'Verde'
        };
        return colors[color] || color;
    }
    
    function getFormaName(forma) {
        const formas = {
            'round': 'Redondo',
            'rect': 'Rectangular',
            'pill': 'Píldora',
            'silhouette': 'Silueta'
        };
        return formas[forma] || forma;
    }
    
    // WhatsApp
    function updateWhatsAppLink() {
        const nombre = safeGetValue('nombre', 'Cliente');
        const cantidad = safeGetValue('cantidad', '');
        const tamaño = safeGetValue('tamaño', '');
        const estilo = safeGetValue('estilo', '');
        const color = safeGetValue('color', '');
        const forma = safeGetValue('forma', '');
        
        const text = encodeURIComponent(
            `Hola! Quiero hacer un pedido de llavero personalizado:\n\n` +
            `• Cantidad: ${cantidad} unidad${cantidad > 1 ? 'es' : ''}\n` +
            `• Tamaño: ${tamaño}mm\n` +
            `• Estilo: ${estilo === 'photo' ? 'Foto completa' : 'Silueta'}\n` +
            `• Forma: ${getFormaName(forma)}\n` +
            `• Color: ${getColorName(color)}\n\n` +
            `Nombre: ${nombre}\n\n` +
            `¿Podrían ayudarme con este pedido?`
        );
        
        const whatsappLink = `https://wa.me/34XXXXXXXXX?text=${text}`;
        const whatsappElement = safeGetElement('whatsappLink');
        if (whatsappElement) {
            whatsappElement.href = whatsappLink;
        }
    }
    
    // Formulario
    function setupForm() {
        const form = safeGetElement('pedidoForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
            
            ['nombre', 'email', 'ciudad', 'direccion', 'telefono'].forEach(id => {
                const element = safeGetElement(id);
                if (element) {
                    element.addEventListener('input', updateWhatsAppLink);
                }
            });
        }
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        // Simular envío
        setTimeout(() => {
            submitBtn.textContent = '¡Pedido enviado!';
            submitBtn.classList.add('success');
            showMessage('Pedido enviado correctamente', 'success');
            
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');
                form.classList.remove('loading');
            }, 3000);
        }, 2000);
    }
    
    // Scroll suave
    function scrollToForm() {
        const form = $('orderForm');
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Inicialización de funciones no críticas
    function initializeNonCritical() {
        addEntranceAnimations();
        setupDragAndDrop();
        setupEventListeners();
        setupForm();
        setupCarouselAutoPlay();
        updateOrderSummary();
        initializeInfoCarousel();
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNonCritical);
    } else {
        initializeNonCritical();
    }
    
    // Funciones del carrusel informativo
    function showInfoSlide(index) {
        infoSlides.forEach(slide => slide.classList.remove('active'));
        infoDots.forEach(dot => dot.classList.remove('active'));
        
        if (infoSlides[index]) {
            infoSlides[index].classList.add('active');
            infoDots[index].classList.add('active');
        }
    }
    
    function currentInfoSlide(index) {
        currentInfoSlideIndex = index - 1;
        showInfoSlide(currentInfoSlideIndex);
    }
    
    // Auto-play del carrusel informativo
    function setupInfoCarouselAutoPlay() {
        const infoCarousel = document.querySelector('.info-carousel');
        if (!infoCarousel) return;
        
        let autoPlayInterval;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Iniciar auto-play cuando el carrusel es visible
                    autoPlayInterval = setInterval(() => {
                        currentInfoSlideIndex = (currentInfoSlideIndex + 1) % infoSlides.length;
                        showInfoSlide(currentInfoSlideIndex);
                    }, 8000); // Cambiar cada 8 segundos
                } else {
                    // Pausar auto-play cuando no es visible
                    if (autoPlayInterval) {
                        clearInterval(autoPlayInterval);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(infoCarousel);
    }
    
    // Inicializar carrusel informativo
    function initializeInfoCarousel() {
        if (infoSlides.length > 0) {
            showInfoSlide(0);
            setupInfoCarouselAutoPlay();
        }
    }
    
    // Exponer funciones globales necesarias
    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;
    window.currentInfoSlide = currentInfoSlide;
    window.removeImage = removeImage;
    window.scrollToForm = scrollToForm;
    
})();
