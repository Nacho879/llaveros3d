// Script para configurar las imágenes reales del blog
// Este script te ayudará a descargar y configurar las imágenes de Google Drive

const fs = require('fs');
const path = require('path');

// Mapeo de imágenes de Google Drive (necesitas actualizar los IDs)
const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales': 'PLACEHOLDER_ID_1',
    'merchandising-2024': 'PLACEHOLDER_ID_2', 
    'sector-gastronomico': 'PLACEHOLDER_ID_3',
    'consejos-diseno': 'PLACEHOLDER_ID_4',
    'sector-automocion': 'PLACEHOLDER_ID_5',
    'eventos-corporativos': 'PLACEHOLDER_ID_6',
    'roi-merchandising': 'PLACEHOLDER_ID_7',
    
    // Imágenes de artículos específicos
    'guia-materiales-3d': 'PLACEHOLDER_ID_8',
    'materiales-pla': 'PLACEHOLDER_ID_9',
    'materiales-petg': 'PLACEHOLDER_ID_10',
    'materiales-abs': 'PLACEHOLDER_ID_11',
    'proceso-impresion': 'PLACEHOLDER_ID_12',
    'llaveros-ejemplos': 'PLACEHOLDER_ID_13',
    'sector-tecnologico': 'PLACEHOLDER_ID_14',
    'disenadores-trabajando': 'PLACEHOLDER_ID_15',
    'impresora-3d-detalle': 'PLACEHOLDER_ID_16',
    'proceso-fabricacion': 'PLACEHOLDER_ID_17',
    'calidad-control': 'PLACEHOLDER_ID_18',
    'materiales-variados': 'PLACEHOLDER_ID_19',
    'tecnologia-avanzada': 'PLACEHOLDER_ID_20',
    'produccion-masiva': 'PLACEHOLDER_ID_21',
    'innovacion-3d': 'PLACEHOLDER_ID_22',
    'futuro-impresion': 'PLACEHOLDER_ID_23'
};

// Función para generar URLs de Google Drive
function generateDriveURLs() {
    console.log('🔗 URLs de Google Drive generadas:');
    console.log('=====================================');
    
    Object.entries(imageMapping).forEach(([filename, id]) => {
        if (id.startsWith('PLACEHOLDER_ID')) {
            console.log(`❌ ${filename}: ID no configurado`);
        } else {
            const url = `https://drive.google.com/uc?export=view&id=${id}`;
            console.log(`✅ ${filename}: ${url}`);
        }
    });
}

// Función para generar HTML con las imágenes
function generateImageHTML() {
    let html = '';
    
    Object.entries(imageMapping).forEach(([filename, id]) => {
        const url = id.startsWith('PLACEHOLDER_ID') 
            ? `https://drive.google.com/uc?export=view&id=${id}`
            : `https://drive.google.com/uc?export=view&id=${id}`;
            
        html += `
        <!-- ${filename} -->
        <div class="image-item">
            <h3>${filename}</h3>
            <img src="${url}" alt="${filename}" style="max-width: 300px; height: auto;">
            <p><strong>URL:</strong> ${url}</p>
            <p><strong>Archivo local:</strong> /assets/blog/${filename}.jpg</p>
        </div>
        `;
    });
    
    return html;
}

// Función para crear la página de configuración
function createSetupPage() {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Configurar Imágenes del Blog - Llavero3D</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
                background: #f8fafc;
                line-height: 1.6;
            }
            .header {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .instructions {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                color: #92400e;
                padding: 1.5rem;
                border-radius: 8px;
                margin-bottom: 2rem;
            }
            .instructions h3 {
                margin-bottom: 1rem;
                color: #92400e;
            }
            .instructions ol {
                margin-left: 1.5rem;
            }
            .instructions li {
                margin-bottom: 0.5rem;
            }
            .drive-link {
                background: #3b82f6;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                margin: 1rem 0;
                font-weight: 600;
            }
            .drive-link:hover {
                background: #2563eb;
            }
            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }
            .image-item {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .image-item h3 {
                color: #1e293b;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            .image-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 2px solid #e2e8f0;
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
                display: none;
            }
            .status.success {
                background: #f0fdf4;
                border-color: #22c55e;
                color: #166534;
            }
            .status.error {
                background: #fef2f2;
                border-color: #ef4444;
                color: #991b1b;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🖼️ Configurar Imágenes del Blog</h1>
            <p>Herramienta para configurar las imágenes reales del blog desde Google Drive</p>
        </div>
        
        <div class="instructions">
            <h3>📋 Instrucciones paso a paso:</h3>
            <ol>
                <li><strong>Accede a la carpeta de Google Drive:</strong> <a href="https://drive.google.com/drive/folders/1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y" target="_blank" class="drive-link">Abrir carpeta de Google Drive</a></li>
                <li><strong>Haz clic derecho en cada imagen</strong> y selecciona "Obtener enlace"</li>
                <li><strong>Copia el ID de la imagen</strong> de la URL (después de /d/ y antes de /view)</li>
                <li><strong>Actualiza el mapeo</strong> en el código con los IDs reales</li>
                <li><strong>Descarga las imágenes</strong> usando los botones de abajo</li>
            </ol>
        </div>
        
        <div id="status" class="status">
            <strong>Estado:</strong> <span id="statusText"></span>
        </div>
        
        <div id="images" class="image-grid">
            ${generateImageHTML()}
        </div>
        
        <script>
            // Mapeo de imágenes (actualiza con los IDs reales)
            const imageMapping = ${JSON.stringify(imageMapping, null, 4)};
            
            // Función para mostrar estado
            function showStatus(message, type = 'info') {
                const status = document.getElementById('status');
                const statusText = document.getElementById('statusText');
                
                statusText.textContent = message;
                status.className = \`status \${type}\`;
                status.style.display = 'block';
                
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
            }
            
            // Función para copiar URLs
            function copyImageURLs() {
                const urls = Object.entries(imageMapping).map(([filename, id]) => {
                    if (id.startsWith('PLACEHOLDER_ID')) {
                        return \`\${filename}: ID no configurado\`;
                    } else {
                        return \`\${filename}: https://drive.google.com/uc?export=view&id=\${id}\`;
                    }
                }).join('\\n');
                
                navigator.clipboard.writeText(urls).then(() => {
                    showStatus('📋 URLs copiadas al portapapeles', 'success');
                });
            }
            
            // Función para generar mapeo actualizado
            function generateUpdatedMapping() {
                const mapping = Object.entries(imageMapping).map(([key, value]) => 
                    \`'\${key}': '\${value}'\`
                ).join(',\\n    ');
                
                const mappingText = \`const imageMapping = {
    \${mapping}
};\`;
                
                navigator.clipboard.writeText(mappingText).then(() => {
                    showStatus('🔗 Mapeo copiado al portapapeles', 'success');
                });
            }
            
            // Mostrar instrucciones al cargar
            document.addEventListener('DOMContentLoaded', function() {
                showStatus('📋 Sigue las instrucciones para configurar las imágenes', 'info');
            });
        </script>
    </body>
    </html>
    `;
    
    return html;
}

// Función principal
function main() {
    console.log('🚀 Configurando imágenes del blog...');
    console.log('=====================================');
    
    // Generar URLs
    generateDriveURLs();
    
    // Crear página de configuración
    const setupPage = createSetupPage();
    fs.writeFileSync('setup-images.html', setupPage);
    
    console.log('\\n✅ Página de configuración creada: setup-images.html');
    console.log('\\n📋 Próximos pasos:');
    console.log('1. Abre setup-images.html en tu navegador');
    console.log('2. Accede a la carpeta de Google Drive');
    console.log('3. Copia los IDs de las imágenes');
    console.log('4. Actualiza el mapeo en el código');
    console.log('5. Descarga las imágenes');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = {
    imageMapping,
    generateDriveURLs,
    generateImageHTML,
    createSetupPage
};
