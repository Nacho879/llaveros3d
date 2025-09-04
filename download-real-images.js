// Script para descargar imágenes reales de Google Drive
// Mapeo de imágenes de Google Drive a nombres locales

const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL', // Reemplazar con ID real
    'merchandising-2024': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'sector-gastronomico': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'consejos-diseno': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'sector-automocion': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'eventos-corporativos': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'roi-merchandising': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    
    // Imágenes de artículos específicos
    'guia-materiales-3d': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'materiales-pla': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'materiales-petg': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'materiales-abs': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'proceso-impresion': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'llaveros-ejemplos': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'sector-tecnologico': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'disenadores-trabajando': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'impresora-3d-detalle': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'proceso-fabricacion': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'calidad-control': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'materiales-variados': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'tecnologia-avanzada': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'produccion-masiva': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'innovacion-3d': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL',
    'futuro-impresion': 'https://drive.google.com/uc?export=view&id=1ABC123DEF456GHI789JKL'
};

// Función para descargar una imagen
async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        
        // Crear un enlace de descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        console.log(`✅ Imagen descargada: ${filename}`);
    } catch (error) {
        console.error(`❌ Error descargando ${filename}:`, error);
    }
}

// Función para descargar todas las imágenes
async function downloadAllImages() {
    console.log('🚀 Iniciando descarga de imágenes...');
    
    for (const [filename, url] of Object.entries(imageMapping)) {
        await downloadImage(url, `${filename}.jpg`);
        // Esperar un poco entre descargas para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ Descarga completada');
}

// Función para generar HTML con las imágenes
function generateImageHTML() {
    let html = '';
    
    for (const [filename, url] of Object.entries(imageMapping)) {
        html += `
        <!-- ${filename} -->
        <div class="image-item">
            <h3>${filename}</h3>
            <img src="${url}" alt="${filename}" style="max-width: 300px; height: auto;">
            <p><strong>URL:</strong> ${url}</p>
            <p><strong>Archivo local:</strong> /assets/blog/${filename}.jpg</p>
        </div>
        `;
    }
    
    return html;
}

// Crear página HTML para visualizar y descargar imágenes
function createImagePage() {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Descargar Imágenes del Blog</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
                background: #f5f5f5;
            }
            .header {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .controls {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                margin-right: 1rem;
                margin-bottom: 1rem;
            }
            .btn:hover {
                background: #2563eb;
            }
            .btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }
            .image-item {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .image-item h3 {
                color: #1e293b;
                margin-bottom: 1rem;
            }
            .image-item img {
                border-radius: 8px;
                margin-bottom: 1rem;
            }
            .image-item p {
                margin: 0.5rem 0;
                font-size: 0.9rem;
                color: #64748b;
            }
            .status {
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                color: #0c4a6e;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🖼️ Descargar Imágenes del Blog</h1>
            <p>Esta página te permite visualizar y descargar todas las imágenes del blog desde Google Drive.</p>
        </div>
        
        <div class="controls">
            <h2>Controles</h2>
            <button class="btn" onclick="downloadAllImages()">📥 Descargar Todas las Imágenes</button>
            <button class="btn" onclick="copyImageURLs()">📋 Copiar URLs</button>
            <button class="btn" onclick="generateMapping()">🔗 Generar Mapeo</button>
        </div>
        
        <div id="status" class="status" style="display: none;">
            <strong>Estado:</strong> <span id="statusText"></span>
        </div>
        
        <div id="images">
            ${generateImageHTML()}
        </div>
        
        <script>
            ${downloadRealImages.toString()}
            ${downloadImage.toString()}
            ${downloadAllImages.toString()}
            ${generateImageHTML.toString()}
            
            // Función para copiar URLs
            function copyImageURLs() {
                const urls = Object.values(imageMapping).join('\\n');
                navigator.clipboard.writeText(urls).then(() => {
                    showStatus('URLs copiadas al portapapeles', 'success');
                });
            }
            
            // Función para generar mapeo
            function generateMapping() {
                const mapping = Object.entries(imageMapping).map(([key, value]) => 
                    \`'\${key}': '\${value}'\`
                ).join(',\\n    ');
                
                const mappingText = \`const imageMapping = {
    \${mapping}
};\`;
                
                navigator.clipboard.writeText(mappingText).then(() => {
                    showStatus('Mapeo copiado al portapapeles', 'success');
                });
            }
            
            // Función para mostrar estado
            function showStatus(message, type = 'info') {
                const status = document.getElementById('status');
                const statusText = document.getElementById('statusText');
                
                statusText.textContent = message;
                status.style.display = 'block';
                
                if (type === 'success') {
                    status.style.background = '#f0fdf4';
                    status.style.borderColor = '#22c55e';
                    status.style.color = '#166534';
                } else if (type === 'error') {
                    status.style.background = '#fef2f2';
                    status.style.borderColor = '#ef4444';
                    status.style.color = '#991b1b';
                }
                
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }
        </script>
    </body>
    </html>
    `;
    
    return html;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        imageMapping,
        downloadImage,
        downloadAllImages,
        generateImageHTML,
        createImagePage
    };
}

// Si se ejecuta directamente en el navegador
if (typeof window !== 'undefined') {
    console.log('🖼️ Script de descarga de imágenes cargado');
    console.log('📋 Mapeo de imágenes:', imageMapping);
}
