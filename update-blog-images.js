// Script para actualizar el blog con las nuevas imágenes
const fs = require('fs');
const path = require('path');

// Mapeo de imágenes del blog
const blogImages = {
    'featured-materiales.jpg': 'Imagen destacada para el artículo de materiales',
    'merchandising-2024.jpg': 'Imagen para tendencias de merchandising',
    'sector-gastronomico.jpg': 'Imagen para llaveros del sector gastronómico',
    'consejos-diseno.jpg': 'Imagen para consejos de diseño',
    'sector-automocion.jpg': 'Imagen para llaveros del sector automoción',
    'eventos-corporativos.jpg': 'Imagen para eventos corporativos',
    'roi-merchandising.jpg': 'Imagen para medir ROI del merchandising',
    'guia-materiales-3d.jpg': 'Imagen principal del artículo de materiales',
    'materiales-pla.jpg': 'Imagen para material PLA',
    'materiales-petg.jpg': 'Imagen para material PETG',
    'materiales-abs.jpg': 'Imagen para material ABS',
    'proceso-impresion.jpg': 'Imagen para proceso de impresión',
    'llaveros-ejemplos.jpg': 'Imagen con ejemplos de llaveros',
    'sector-tecnologico.jpg': 'Imagen para sector tecnológico'
};

// Verificar si las imágenes existen
function checkImages() {
    const blogDir = path.join(__dirname, 'assets', 'blog');
    
    console.log('🔍 Verificando imágenes del blog...');
    console.log('=====================================');
    
    let existingImages = 0;
    let missingImages = 0;
    
    Object.entries(blogImages).forEach(([filename, description]) => {
        const filePath = path.join(blogDir, filename);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            console.log(`✅ ${filename} (${sizeKB} KB) - ${description}`);
            existingImages++;
        } else {
            console.log(`❌ ${filename} - ${description}`);
            missingImages++;
        }
    });
    
    console.log('\n📊 Resumen:');
    console.log(`✅ Imágenes existentes: ${existingImages}`);
    console.log(`❌ Imágenes faltantes: ${missingImages}`);
    
    if (missingImages > 0) {
        console.log('\n📋 Para completar las imágenes faltantes:');
        console.log('1. Abre create-placeholders.html en tu navegador');
        console.log('2. Descarga las imágenes placeholder');
        console.log('3. O descarga las imágenes reales de Google Drive');
        console.log('4. Colócalas en la carpeta /assets/blog/');
    }
    
    return { existingImages, missingImages };
}

// Actualizar el blog con las nuevas imágenes
function updateBlog() {
    const blogDir = path.join(__dirname, 'assets', 'blog');
    
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
        console.log('📁 Carpeta /assets/blog/ creada');
    }
    
    const { existingImages, missingImages } = checkImages();
    
    if (existingImages > 0) {
        console.log('\n🚀 El blog está listo para usar las imágenes existentes');
    }
    
    if (missingImages > 0) {
        console.log('\n⚠️  Algunas imágenes están faltando, pero el blog funcionará con placeholders');
    }
    
    return { existingImages, missingImages };
}

// Función principal
function main() {
    console.log('🖼️  Actualizador de Imágenes del Blog');
    console.log('=====================================');
    
    const result = updateBlog();
    
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Descarga las imágenes de Google Drive');
    console.log('2. Optimízalas usando optimize-blog-images.html');
    console.log('3. Colócalas en /assets/blog/');
    console.log('4. Despliega el blog actualizado');
    
    return result;
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { checkImages, updateBlog, main };
