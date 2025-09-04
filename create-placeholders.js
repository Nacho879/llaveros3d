// Script para crear imágenes placeholder para el blog
const fs = require('fs');
const path = require('path');

// Mapeo de imágenes con sus títulos
const imageData = [
    { name: 'featured-materiales.jpg', title: 'Materiales 3D', color: '#3b82f6' },
    { name: 'merchandising-2024.jpg', title: 'Merchandising 2024', color: '#8b5cf6' },
    { name: 'sector-gastronomico.jpg', title: 'Sector Gastronómico', color: '#10b981' },
    { name: 'consejos-diseno.jpg', title: 'Consejos de Diseño', color: '#f59e0b' },
    { name: 'sector-automocion.jpg', title: 'Sector Automoción', color: '#ef4444' },
    { name: 'eventos-corporativos.jpg', title: 'Eventos Corporativos', color: '#06b6d4' },
    { name: 'roi-merchandising.jpg', title: 'ROI Merchandising', color: '#84cc16' },
    { name: 'guia-materiales-3d.jpg', title: 'Guía Materiales 3D', color: '#f97316' },
    { name: 'materiales-pla.jpg', title: 'Material PLA', color: '#6366f1' },
    { name: 'materiales-petg.jpg', title: 'Material PETG', color: '#ec4899' },
    { name: 'materiales-abs.jpg', title: 'Material ABS', color: '#14b8a6' },
    { name: 'proceso-impresion.jpg', title: 'Proceso Impresión', color: '#a855f7' },
    { name: 'llaveros-ejemplos.jpg', title: 'Llaveros Ejemplos', color: '#eab308' },
    { name: 'sector-tecnologico.jpg', title: 'Sector Tecnológico', color: '#22c55e' }
];

// Crear HTML para generar las imágenes
function createPlaceholderHTML() {
    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Placeholders para Blog</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .image-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .image-placeholder {
            width: 100%;
            height: 200px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .image-placeholder:hover {
            transform: scale(1.05);
        }
        .image-info {
            margin-bottom: 10px;
        }
        .download-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .download-btn:hover {
            background: #2563eb;
        }
        .download-all {
            background: #10b981;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px auto;
            display: block;
        }
        .download-all:hover {
            background: #059669;
        }
    </style>
</head>
<body>
    <h1>🖼️ Generador de Imágenes Placeholder para Blog</h1>
    <p>Haz clic en "Descargar" para obtener cada imagen optimizada para el blog.</p>
    
    <div class="container">
`;

    imageData.forEach((img, index) => {
        html += `
        <div class="image-card">
            <div class="image-placeholder" id="img-${index}" style="background: linear-gradient(135deg, ${img.color}, ${img.color}dd);">
                <span>${img.title}</span>
            </div>
            <div class="image-info">
                <h3>${img.name}</h3>
                <p>Imagen placeholder para el blog</p>
            </div>
            <button class="download-btn" onclick="downloadImage('img-${index}', '${img.name}')">
                📥 Descargar
            </button>
        </div>
        `;
    });

    html += `
    </div>
    
    <button class="download-all" onclick="downloadAllImages()">
        📥 Descargar Todas las Imágenes
    </button>

    <script>
        function downloadImage(elementId, filename) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const element = document.getElementById(elementId);
            
            canvas.width = 800;
            canvas.height = 400;
            
            // Crear gradiente
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            const colors = element.style.background.match(/linear-gradient\\(135deg, ([^,]+), ([^)]+)\\)/);
            if (colors) {
                gradient.addColorStop(0, colors[1]);
                gradient.addColorStop(1, colors[2]);
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Añadir texto
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(element.textContent, canvas.width/2, canvas.height/2);
            
            // Descargar
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }
        
        function downloadAllImages() {
            const images = ${JSON.stringify(imageData)};
            images.forEach((img, index) => {
                setTimeout(() => {
                    downloadImage('img-' + index, img.name);
                }, index * 500);
            });
        }
    </script>
</body>
</html>
`;

    return html;
}

// Crear el archivo HTML
const htmlContent = createPlaceholderHTML();
fs.writeFileSync('create-placeholders.html', htmlContent);

console.log('✅ Archivo create-placeholders.html creado');
console.log('📁 Abre el archivo en tu navegador para generar las imágenes');
console.log('🎯 Las imágenes se descargarán automáticamente con los nombres correctos');
