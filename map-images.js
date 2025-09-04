// Script para mapear las imágenes disponibles a las secciones del blog
const fs = require('fs');
const path = require('path');

// Mapeo inteligente de imágenes disponibles
const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales': 'featured-materiales.jpg', // Ya configurada
    'merchandising-2024': 'merchandising-2024.jpg', // Ya disponible
    'sector-gastronomico': 'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg',
    'consejos-diseno': 'disenador-usando-una-impresora-3d.jpg',
    'sector-automocion': 'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg',
    'eventos-corporativos': 'eprojets-lab-jj705qpjVJI-unsplash.jpg',
    'roi-merchandising': 'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg',
    
    // Imágenes de artículos específicos
    'guia-materiales-3d': 'featured-materiales.jpg',
    'materiales-pla': 'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg',
    'materiales-petg': 'kadir-celep-HsefvbLbNWc-unsplash.jpg',
    'materiales-abs': 'kadir-celep-NwOeoxUY_p0-unsplash.jpg',
    'proceso-impresion': 'primer-plano-en-la-impresora-3d.jpg',
    'llaveros-ejemplos': 'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg',
    'sector-tecnologico': 'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg',
    'disenadores-trabajando': 'disenadores-usando-una-impresora-3d.jpg',
    'impresora-3d-detalle': 'primer-plano-en-la-impresora-3d (1).jpg',
    'proceso-fabricacion': 'disenador-usando-una-impresora-3d (2).jpg',
    'calidad-control': 'disenador-usando-una-impresora-3d (3).jpg',
    'materiales-variados': 'disenador-usando-una-impresora-3d (4).jpg',
    'tecnologia-avanzada': 'disenador-usando-una-impresora-3d (5).jpg',
    'produccion-masiva': 'disenador-usando-una-impresora-3d (6).jpg',
    'innovacion-3d': 'disenador-usando-una-impresora-3d (7).jpg',
    'futuro-impresion': 'disenador-usando-una-impresora-3d (8).jpg'
};

// Función para verificar qué imágenes están disponibles
function checkAvailableImages() {
    console.log('🔍 Verificando imágenes disponibles...');
    console.log('=====================================');
    
    const assetsDir = path.join(__dirname, 'assets', 'blog');
    let availableCount = 0;
    let totalCount = Object.keys(imageMapping).length;
    
    Object.entries(imageMapping).forEach(([key, filename]) => {
        const filePath = path.join(assetsDir, filename);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`✅ ${key}: ${filename} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
            availableCount++;
        } else {
            console.log(`❌ ${key}: ${filename} (no encontrado)`);
        }
    });
    
    console.log('\\n=====================================');
    console.log(`📊 Resumen: ${availableCount}/${totalCount} imágenes disponibles`);
    
    return availableCount;
}

// Función para generar el HTML actualizado
function generateUpdatedHTML() {
    console.log('\\n🔄 Generando HTML actualizado...');
    
    // Actualizar blog/index.html
    updateBlogIndex();
    
    // Actualizar artículos
    updateArticles();
    
    console.log('✅ HTML actualizado correctamente');
}

// Función para actualizar el blog principal
function updateBlogIndex() {
    const blogIndexPath = path.join(__dirname, 'blog', 'index.html');
    let content = fs.readFileSync(blogIndexPath, 'utf8');
    
    // Actualizar imágenes del blog principal
    Object.entries(imageMapping).forEach(([key, filename]) => {
        const oldPattern = new RegExp(`src="/assets/blog/${key}\\.svg"`, 'g');
        const newSrc = `src="/assets/blog/${filename}"`;
        content = content.replace(oldPattern, newSrc);
    });
    
    fs.writeFileSync(blogIndexPath, content);
    console.log('📝 blog/index.html actualizado');
}

// Función para actualizar los artículos
function updateArticles() {
    const articles = [
        'guia-materiales-impresion-3d.html',
        'merchandising-corporativo-2024.html',
        'llaveros-sector-gastronomico.html'
    ];
    
    articles.forEach(articleFile => {
        const articlePath = path.join(__dirname, 'blog', articleFile);
        if (fs.existsSync(articlePath)) {
            let content = fs.readFileSync(articlePath, 'utf8');
            
            // Actualizar imágenes en el artículo
            Object.entries(imageMapping).forEach(([key, filename]) => {
                const oldPattern = new RegExp(`src="/assets/blog/${key}\\.svg"`, 'g');
                const newSrc = `src="/assets/blog/${filename}"`;
                content = content.replace(oldPattern, newSrc);
            });
            
            fs.writeFileSync(articlePath, content);
            console.log(`📝 blog/${articleFile} actualizado`);
        }
    });
}

// Función para generar un reporte
function generateReport() {
    console.log('\\n📋 REPORTE DE MAPEO DE IMÁGENES');
    console.log('================================');
    
    Object.entries(imageMapping).forEach(([key, filename]) => {
        console.log(`${key} → ${filename}`);
    });
    
    console.log('\\n💡 Próximos pasos:');
    console.log('1. Verificar que todas las imágenes se muestran correctamente');
    console.log('2. Desplegar los cambios a producción');
    console.log('3. Probar el blog en diferentes dispositivos');
}

// Función principal
function main() {
    console.log('🚀 Mapeando imágenes del blog...');
    console.log('================================');
    
    // Verificar imágenes disponibles
    const availableCount = checkAvailableImages();
    
    if (availableCount > 0) {
        // Generar HTML actualizado
        generateUpdatedHTML();
        
        // Generar reporte
        generateReport();
        
        console.log('\\n✅ ¡Mapeo completado exitosamente!');
    } else {
        console.log('\\n❌ No se encontraron imágenes para mapear');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = {
    imageMapping,
    checkAvailableImages,
    generateUpdatedHTML,
    generateReport
};
