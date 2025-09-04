// Script para descargar imágenes de Google Drive
const https = require('https');
const fs = require('fs');
const path = require('path');

// Mapeo de imágenes de Google Drive a nombres del blog
const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales.jpg': 'disenador-usando-una-impresora-3d.jpg',
    'merchandising-2024.jpg': 'caroline-eymond-laritaz--PgJiJQeQGM-unsplash.jpg',
    'sector-gastronomico.jpg': 'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg',
    'consejos-diseno.jpg': 'eprojets-lab-jj705qpjVJI-unsplash.jpg',
    'sector-automocion.jpg': 'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg',
    'eventos-corporativos.jpg': 'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg',
    'roi-merchandising.jpg': 'tom-claes-nNP-1l_jESs-unsplash.jpg',
    'guia-materiales-3d.jpg': 'primer-plano-en-la-impresora-3d.jpg',
    
    // Imágenes adicionales para artículos
    'materiales-pla.jpg': 'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg',
    'materiales-petg.jpg': 'disenador-usando-una-impresora-3d (1).jpg',
    'materiales-abs.jpg': 'disenador-usando-una-impresora-3d (2).jpg',
    'proceso-impresion.jpg': 'kadir-celep-HsefvbLbNWc-unsplash.jpg',
    'llaveros-ejemplos.jpg': 'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg',
    'sector-tecnologico.jpg': 'kadir-celep-NwOeoxUY_p0-unsplash.jpg'
};

// Función para descargar una imagen
function downloadImage(driveName, blogName) {
    return new Promise((resolve, reject) => {
        // URL de descarga directa de Google Drive
        const url = `https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y`;
        
        const outputPath = path.join(__dirname, 'assets', 'blog', blogName);
        
        console.log(`📥 Descargando ${driveName} → ${blogName}...`);
        
        const file = fs.createWriteStream(outputPath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    const stats = fs.statSync(outputPath);
                    const sizeKB = (stats.size / 1024).toFixed(1);
                    console.log(`✅ ${blogName} descargado (${sizeKB} KB)`);
                    resolve();
                });
            } else {
                reject(new Error(`Error al descargar ${driveName}: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Función para crear imágenes placeholder
function createPlaceholderImage(blogName, title, color) {
    const svg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad)"/>
        <text x="400" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${title}</text>
    </svg>`;
    
    const outputPath = path.join(__dirname, 'assets', 'blog', blogName.replace('.jpg', '.svg'));
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ ${blogName} placeholder creado`);
}

// Función principal
async function main() {
    console.log('🚀 Iniciando descarga de imágenes del blog...');
    console.log('==============================================');
    
    // Crear directorio si no existe
    const blogDir = path.join(__dirname, 'assets', 'blog');
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
        console.log('📁 Directorio /assets/blog/ creado');
    }
    
    // Crear placeholders mientras tanto
    const placeholders = [
        { name: 'featured-materiales.jpg', title: 'Materiales 3D', color: '#3b82f6' },
        { name: 'merchandising-2024.jpg', title: 'Merchandising 2024', color: '#8b5cf6' },
        { name: 'sector-gastronomico.jpg', title: 'Sector Gastronómico', color: '#10b981' },
        { name: 'consejos-diseno.jpg', title: 'Consejos de Diseño', color: '#f59e0b' },
        { name: 'sector-automocion.jpg', title: 'Sector Automoción', color: '#ef4444' },
        { name: 'eventos-corporativos.jpg', title: 'Eventos Corporativos', color: '#06b6d4' },
        { name: 'roi-merchandising.jpg', title: 'ROI Merchandising', color: '#84cc16' },
        { name: 'guia-materiales-3d.jpg', title: 'Guía Materiales 3D', color: '#f97316' }
    ];
    
    console.log('\n🖼️ Creando imágenes placeholder...');
    placeholders.forEach(placeholder => {
        createPlaceholderImage(placeholder.name, placeholder.title, placeholder.color);
    });
    
    console.log('\n📋 Mapeo de imágenes:');
    Object.entries(imageMapping).forEach(([blogName, driveName]) => {
        console.log(`✅ ${blogName} ← ${driveName}`);
    });
    
    console.log('\n🎉 Imágenes placeholder creadas correctamente');
    console.log('📁 Ubicación: /assets/blog/');
    console.log('\n📝 Para usar las imágenes reales:');
    console.log('1. Descarga las imágenes de Google Drive manualmente');
    console.log('2. Renómbralas según el mapeo anterior');
    console.log('3. Colócalas en /assets/blog/');
    console.log('4. Reemplaza los archivos .svg por .jpg');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { downloadImage, createPlaceholderImage, main };
