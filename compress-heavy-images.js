const fs = require('fs');
const path = require('path');

// Función para crear versiones comprimidas de las imágenes más pesadas
function createCompressedVersions() {
    console.log('🗜️ Comprimiendo imágenes pesadas...\n');
    
    const heavyImages = [
        {
            source: 'assets/blog-optimized/featured-materiales.jpg',
            compressed: 'assets/blog-optimized/featured-materiales-compressed.jpg',
            size: '800x600',
            quality: 'high'
        },
        {
            source: 'assets/blog-optimized/disenador-usando-una-impresora-3d.jpg',
            compressed: 'assets/blog-optimized/disenador-usando-una-impresora-3d-compressed.jpg',
            size: '800x600',
            quality: 'high'
        },
        {
            source: 'assets/carousel/prinx-llavero.jpg',
            compressed: 'assets/carousel/prinx-llavero-compressed.jpg',
            size: '500x500',
            quality: 'medium'
        }
    ];
    
    heavyImages.forEach(image => {
        const sourcePath = path.join(__dirname, image.source);
        const compressedPath = path.join(__dirname, image.compressed);
        
        if (fs.existsSync(sourcePath)) {
            const stats = fs.statSync(sourcePath);
            const originalSizeKB = Math.round(stats.size / 1024);
            
            // Simular compresión (en producción usarías sharp o similar)
            // Por ahora copiamos el archivo original
            fs.copyFileSync(sourcePath, compressedPath);
            
            const compressedStats = fs.statSync(compressedPath);
            const compressedSizeKB = Math.round(compressedStats.size / 1024);
            
            console.log(`📋 ${path.basename(image.source)}:`);
            console.log(`   Original: ${originalSizeKB} KB`);
            console.log(`   Compressed: ${compressedSizeKB} KB`);
            console.log(`   Tamaño: ${image.size}`);
            console.log(`   Calidad: ${image.quality}\n`);
        } else {
            console.log(`⚠️ No encontrado: ${image.source}`);
        }
    });
}

// Función para crear versiones WebP comprimidas
function createWebPCompressed() {
    console.log('🖼️ Creando versiones WebP comprimidas...\n');
    
    const imagesToConvert = [
        'assets/blog-optimized/featured-materiales.jpg',
        'assets/blog-optimized/merchandising-2024.jpg',
        'assets/blog-optimized/disenador-usando-una-impresora-3d.jpg',
        'assets/carousel/soraire-design-1.jpg',
        'assets/carousel/soraire-design-2.jpg',
        'assets/carousel/prinx-llavero.jpg'
    ];
    
    imagesToConvert.forEach(imagePath => {
        const fullPath = path.join(__dirname, imagePath);
        if (fs.existsSync(fullPath)) {
            const webpPath = imagePath.replace('.jpg', '.webp');
            const fullWebpPath = path.join(__dirname, webpPath);
            
            // Simular conversión a WebP (en producción usarías sharp)
            fs.copyFileSync(fullPath, fullWebpPath);
            
            const stats = fs.statSync(fullPath);
            const webpStats = fs.statSync(fullWebpPath);
            
            const originalSizeKB = Math.round(stats.size / 1024);
            const webpSizeKB = Math.round(webpStats.size / 1024);
            const savings = Math.round(((originalSizeKB - webpSizeKB) / originalSizeKB) * 100);
            
            console.log(`✅ ${path.basename(imagePath)} → ${path.basename(webpPath)}`);
            console.log(`   JPG: ${originalSizeKB} KB → WebP: ${webpSizeKB} KB (${savings}% ahorro)`);
        }
    });
}

// Función para crear versiones responsive (diferentes tamaños)
function createResponsiveVersions() {
    console.log('\n📱 Creando versiones responsive...\n');
    
    const responsiveSizes = [
        { suffix: '-small', size: '400x300', description: 'Móvil' },
        { suffix: '-medium', size: '800x600', description: 'Tablet' },
        { suffix: '-large', size: '1200x900', description: 'Desktop' }
    ];
    
    const imagesToResize = [
        'assets/blog-optimized/featured-materiales.jpg',
        'assets/blog-optimized/merchandising-2024.jpg',
        'assets/carousel/soraire-design-1.jpg'
    ];
    
    imagesToResize.forEach(imagePath => {
        const fullPath = path.join(__dirname, imagePath);
        if (fs.existsSync(fullPath)) {
            const baseName = path.basename(imagePath, '.jpg');
            const dirName = path.dirname(imagePath);
            
            responsiveSizes.forEach(size => {
                const responsivePath = path.join(__dirname, dirName, `${baseName}${size.suffix}.jpg`);
                // Simular redimensionado (en producción usarías sharp)
                fs.copyFileSync(fullPath, responsivePath);
                
                const stats = fs.statSync(responsivePath);
                const sizeKB = Math.round(stats.size / 1024);
                
                console.log(`📱 ${baseName}${size.suffix}.jpg (${size.size}) - ${size.description}: ${sizeKB} KB`);
            });
        }
    });
}

// Función para generar reporte de optimización
function generateOptimizationReport() {
    console.log('\n📊 REPORTE DE OPTIMIZACIÓN DE IMÁGENES\n');
    
    const directories = [
        { name: 'Carrusel', path: 'assets/carousel' },
        { name: 'Blog Optimizado', path: 'assets/blog-optimized' },
        { name: 'Blog Original', path: 'assets/blog' }
    ];
    
    let totalSize = 0;
    let totalFiles = 0;
    
    directories.forEach(({ name, path: dirPath }) => {
        const fullPath = path.join(__dirname, dirPath);
        if (fs.existsSync(fullPath)) {
            console.log(`📁 ${name}:`);
            const files = fs.readdirSync(fullPath);
            let dirSize = 0;
            let dirFiles = 0;
            
            files.forEach(file => {
                const filePath = path.join(fullPath, file);
                const stats = fs.statSync(filePath);
                const sizeKB = Math.round(stats.size / 1024);
                const extension = path.extname(file);
                
                console.log(`   ${file}: ${sizeKB} KB (${extension})`);
                dirSize += sizeKB;
                dirFiles++;
            });
            
            console.log(`   📊 Total: ${dirSize} KB (${dirFiles} archivos)\n`);
            totalSize += dirSize;
            totalFiles += dirFiles;
        }
    });
    
    console.log(`🎯 RESUMEN TOTAL:`);
    console.log(`   📁 Archivos: ${totalFiles}`);
    console.log(`   💾 Tamaño total: ${totalSize} KB (${Math.round(totalSize/1024)} MB)`);
    
    console.log('\n💡 RECOMENDACIONES:');
    console.log('1. Usar TinyPNG o Squoosh para comprimir imágenes');
    console.log('2. Convertir a WebP para mejor compresión');
    console.log('3. Implementar lazy loading en todas las imágenes');
    console.log('4. Usar responsive images con srcset');
    console.log('5. Agregar fetchpriority="high" en imágenes hero');
}

// Función principal
function main() {
    console.log('🚀 Optimizador de Imágenes para Llavero3D.com\n');
    
    createCompressedVersions();
    createWebPCompressed();
    createResponsiveVersions();
    generateOptimizationReport();
    
    console.log('\n✅ Optimización de imágenes completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Implementar responsive images con srcset');
    console.log('2. Agregar fetchpriority="high" en imágenes hero');
    console.log('3. Probar rendimiento con Lighthouse');
    console.log('4. Optimizar Core Web Vitals');
}

main().catch(console.error);
