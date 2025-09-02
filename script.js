// Utilidades
const $ = (id) => document.getElementById(id);

// Configuración
const PHONE = '34XXXXXXXXX'; // Reemplazar con número real
const FORMSPREE_URL = 'https://formspree.io/f/XXXXXXX'; // Reemplazar con URL real

// Variables globales
let originalImage = null;
let imageData = null;

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(messageEl);
    
    // Mostrar con animación
    setTimeout(() => messageEl.classList.add('show'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => document.body.removeChild(messageEl), 300);
    }, 3000);
}



// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar año en footer
    $('currentYear').textContent = new Date().getFullYear();
    
    // Configurar drag & drop
    setupDragAndDrop();
    
    // Configurar eventos de cambio
    setupEventListeners();
    
    // Configurar formulario
    setupForm();
    
    // Actualizar resumen inicial
    updateOrderSummary();
}

// Drag & Drop
function setupDragAndDrop() {
    const dropZone = $('dropZone');
    const fileInput = $('fileInput');
    
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
    $('dropZone').classList.add('drag');
}

function unhighlight(e) {
    $('dropZone').classList.remove('drag');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            // Validar tamaño del archivo (máximo 5MB)
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

function validateOrder() {
    const cantidad = parseInt($('cantidad').value);
    if (cantidad < 30) {
        showMessage('El pedido mínimo es de 30 unidades', 'error');
        return false;
    }
    return true;
}

function loadImage(file) {
    // Mostrar mensaje de carga
    showMessage('Cargando logo...', 'info');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            imageData = e.target.result;
            showImagePreview();
            // Mostrar mensaje de éxito
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

// Event Listeners
function setupEventListeners() {
    const elements = ['estilo', 'forma', 'tamaño', 'color', 'cantidad'];
    elements.forEach(id => {
        const element = $(id);
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

// Canvas functions
function showImagePreview() {
    $('dropContent').style.display = 'none';
    $('imagePreview').style.display = 'flex';
    drawImageCanvas();
}

function removeImage() {
    originalImage = null;
    imageData = null;
    $('dropContent').style.display = 'block';
    $('imagePreview').style.display = 'none';
    $('fileInput').value = '';
    showMessage('Logo eliminado', 'info');
}

function drawImageCanvas() {
    const canvas = $('imgCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fondo claro
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    if (originalImage) {
        const estilo = $('estilo').value;
        
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
    
    // Crear canvas temporal para procesar la imagen
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = scaledWidth;
    tempCanvas.height = scaledHeight;
    
    // Dibujar imagen en canvas temporal
    tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    
    // Obtener datos de imagen
    const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);
    const data = imageData.data;
    
    // Convertir a silueta (umbral)
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calcular luminancia
        const luminance = (r * 0.299 + g * 0.587 + b * 0.114);
        
        // Umbral a blanco/negro
        const value = luminance > 128 ? 255 : 0;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 255;   // A
    }
    
    // Poner datos procesados de vuelta
    tempCtx.putImageData(imageData, 0, 0);
    
    // Dibujar en canvas principal
    ctx.drawImage(tempCanvas, x, y);
}







// Carrusel de muestras
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Mostrar la slide actual
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    // Circular navigation
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

// Auto-play del carrusel
function autoPlay() {
    changeSlide(1);
}

// Iniciar auto-play cada 4 segundos
let autoPlayInterval = setInterval(autoPlay, 4000);

// Pausar auto-play al hacer hover
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.sample-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(autoPlay, 4000);
        });
    }
});

// Resumen del pedido
function updateOrderSummary() {
    const cantidad = parseInt($('cantidad').value);
    const tamaño = $('tamaño').value;
    const estilo = $('estilo').value;
    const color = $('color').value;
    const forma = $('forma').value;
    
    // Calcular precio base (1,20€ + IVA)
    const precioBase = 1.20;
    const iva = 0.21; // 21% IVA
    const precioConIva = precioBase * (1 + iva);
    const precioTotal = precioConIva * cantidad;
    
    $('summaryCantidad').textContent = `${cantidad} unidad${cantidad > 1 ? 'es' : ''}`;
    $('summaryTamaño').textContent = `${tamaño}mm`;
    $('summaryEstilo').textContent = estilo === 'photo' ? 'Foto completa' : 'Silueta';
    $('summaryColor').textContent = getColorName(color);
    $('summaryForma').textContent = getFormaName(forma);
    $('summaryPrecio').textContent = `€${precioTotal.toFixed(2)} (sin envío)`;
}

// WhatsApp
function updateWhatsAppLink() {
    const nombre = $('nombre').value || 'Cliente';
    const cantidad = $('cantidad').value;
    const tamaño = $('tamaño').value;
    const estilo = $('estilo').value;
    const color = $('color').value;
    const forma = $('forma').value;
    
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
    
    const whatsappLink = `https://wa.me/${PHONE}?text=${text}`;
    $('whatsappLink').href = whatsappLink;
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

// Formulario
function setupForm() {
    const form = $('pedidoForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Actualizar WhatsApp cuando cambien los campos del formulario
    ['nombre', 'email', 'ciudad', 'direccion', 'telefono'].forEach(id => {
        const element = $(id);
        if (element) {
            element.addEventListener('input', updateWhatsAppLink);
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar pedido mínimo
    if (!validateOrder()) {
        return;
    }
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Mostrar estado de carga
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    // Crear objeto del pedido
    const pedidoData = {
        id: generatePedidoId(),
        fecha: new Date().toISOString(),
        nombre: $('nombre').value,
        email: $('email').value,
        telefono: $('telefono').value,
        ciudad: $('ciudad').value,
        direccion: $('direccion').value,
        cantidad: parseInt($('cantidad').value),
        tamaño: $('tamaño').value,
        estilo: $('estilo').value,
        forma: $('forma').value,
        color: $('color').value,
        notasPedido: $('notasPedido').value,
        newsletter: $('newsletter').checked,
        imagen: getImageData(),
        precio: calculatePrice(),
        estado: 'Nuevo'
    };
    
    // Simular envío (reemplazar con Formspree real)
    fakeNetwork(2000).then(() => {
        // Guardar en localStorage
        savePedidoToLocalStorage(pedidoData);
        
        // Éxito
        submitBtn.textContent = '¡Pedido enviado!';
        submitBtn.classList.add('success');
        
        // Mostrar mensaje de éxito
        showSuccessMessage(pedidoData);
        
        // Limpiar formulario
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
            form.classList.remove('loading');
        }, 3000);
        
    }).catch(() => {
        // Error
        submitBtn.textContent = 'Error al enviar';
        submitBtn.classList.add('error');
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('error');
            form.classList.remove('loading');
        }, 3000);
    });
    
    // Código comentado para Formspree real:
    /*
    const formData = new FormData();
    formData.append('nombre', $('nombre').value);
    formData.append('email', $('email').value);
    formData.append('telefono', $('telefono').value);
    formData.append('ciudad', $('ciudad').value);
    formData.append('direccion', $('direccion').value);
    formData.append('cantidad', $('cantidad').value);
    formData.append('tamaño', $('tamaño').value);
    formData.append('estilo', $('estilo').value);
    formData.append('forma', $('forma').value);
    formData.append('color', $('color').value);
    formData.append('notasPedido', $('notasPedido').value);
    formData.append('newsletter', $('newsletter').checked);
    
    if (originalImage) {
        formData.append('imagen', imageData);
    }
    

    
    fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Éxito
        } else {
            throw new Error('Error en el envío');
        }
    })
    .catch(error => {
        // Error
    });
    */
}

function fakeNetwork(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% éxito
                resolve();
            } else {
                reject();
            }
        }, ms);
    });
}

// Scroll suave
function scrollToForm() {
    const form = $('orderForm');
    form.scrollIntoView({ behavior: 'smooth' });
}

// Polyfill para roundRect (para navegadores antiguos)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Funciones auxiliares para el backoffice
function generatePedidoId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `P${timestamp}${random}`;
}

function calculatePrice() {
    const cantidad = parseInt($('cantidad').value);
    const precioBase = 1.20; // Precio base por unidad
    const iva = 0.21; // 21% IVA
    
    const precioSinIva = cantidad * precioBase;
    const precioConIva = precioSinIva * (1 + iva);
    
    return parseFloat(precioConIva.toFixed(2));
}

function getImageData() {
    if (!originalImage) return null;
    
    // Crear canvas temporal para convertir imagen a base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    ctx.drawImage(originalImage, 0, 0);
    return canvas.toDataURL('image/png');
}

function savePedidoToLocalStorage(pedidoData) {
    // Obtener pedidos existentes
    let pedidos = JSON.parse(localStorage.getItem('llaveros3d_pedidos') || '[]');
    
    // Añadir nuevo pedido
    pedidos.push(pedidoData);
    
    // Guardar en localStorage
    localStorage.setItem('llaveros3d_pedidos', JSON.stringify(pedidos));
    
    console.log('Pedido guardado en localStorage:', pedidoData);
}

function showSuccessMessage(pedidoData) {
    // Crear mensaje de éxito
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <div class="success-content">
            <h3>¡Pedido enviado con éxito!</h3>
            <p><strong>ID del pedido:</strong> ${pedidoData.id}</p>
            <p><strong>Total:</strong> ${pedidoData.precio.toFixed(2)}€</p>
            <p>Te hemos enviado un email de confirmación.</p>
            <div class="success-actions">
                <button onclick="window.open('admin/', '_blank')" class="btn btn-secondary">
                    Ver en Backoffice
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Añadir estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Añadir al body
    document.body.appendChild(messageDiv);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 10000);
}

