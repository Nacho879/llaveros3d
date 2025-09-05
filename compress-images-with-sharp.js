const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Función para comprimir una imagen con Sharp
async function compressImage(inputPath, outputPath, quality = 80, maxWidth = null) {
    try {
        let pipeline = sharp(inputPath);
        
        // Redimensionar si es necesario
        if (maxWidth) {
            pipeline = pipeline.resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }
        
        // Comprimir JPG
        await pipeline
            .jpeg({ quality, progressive: true })
            .toFile(outputPath);
            
        const originalSize = fs.statSync(inputPath).size;
        const compressedSize = fs.statSync(outputPath).size;
        const savings = Math.round((1 - compressedSize / originalSize) * 100);
        
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   📊 ${Math.round(originalSize/1024)} KB → ${Math.round(compressedSize/1024)} KB (${savings}% ahorro)`);
        
        return { originalSize, compressedSize, savings };
        
    } catch (error) {
        console.error(`❌ Error comprimiendo ${inputPath}:`, error.message);
        return null;
    }
}

// Función para crear WebP
async function createWebP(inputPath, outputPath, quality = 80) {
    try {
        await sharp(inputPath)
            .webp({ quality })
            .toFile(outputPath);
            
        const originalSize = fs.statSync(inputPath).size;
        const webpSize = fs.statSync(outputPath).size;
        const savings = Math.round((1 - webpSize / originalSize) * 100);
        
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   📊 ${Math.round(originalSize/1024)} KB → ${Math.round(webpSize/1024)} KB (${savings}% ahorro)`);
        
        return { originalSize, webpSize, savings };
        
    } catch (error) {
        console.error(`❌ Error creando WebP ${inputPath}:`, error.message);
        return null;
    }
}

// Función para crear versiones responsive
async function createResponsiveVersions(inputPath, baseName, outputDir) {
    const sizes = [
        { suffix: 'small', width: 400 },
        { suffix: 'medium', width: 800 },
        { suffix: 'large', width: 1200 }
    ];
    
    const results = [];
    
    for (const size of sizes) {
        const outputPath = path.join(outputDir, `${baseName}-${size.suffix}.jpg`);
        const result = await compressImage(inputPath, outputPath, 85, size.width);
        if (result) results.push(result);
    }
    
    return results;
}

// Función principal
async function main() {
    console.log('🚀 Compresor de Imágenes con Sharp para Llavero3D.com\n');
    
    const imagesToCompress = [
        {
            input: 'assets/blog/featured-materiales.jpg',
            output: 'assets/blog-optimized/featured-materiales-compressed.jpg',
            quality: 80,
            maxWidth: 1200
        },
        {
            input: 'assets/blog/disenador-usando-una-impresora-3d.jpg',
            output: 'assets/blog-optimized/disenador-usando-una-impresora-3d-compressed.jpg',
            quality: 80,
            maxWidth: 1200
        },
        {
            input: 'assets/carousel/prinx-llavero.jpg',
            output: 'assets/carousel/prinx-llavero-compressed.jpg',
            quality: 85,
            maxWidth: 800
        }
    ];
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    console.log('🗜️ Comprimiendo imágenes pesadas...\n');
    
    for (const image of imagesToCompress) {
        if (fs.existsSync(image.input)) {
            const result = await compressImage(image.input, image.output, image.quality, image.maxWidth);
            if (result) {
                totalOriginalSize += result.originalSize;
                totalCompressedSize += result.compressedSize;
            }
        } else {
            console.log(`⚠️ Archivo no encontrado: ${image.input}`);
        }
    }
    
    console.log('\n🖼️ Creando versiones WebP...\n');
    
    // Crear WebP de las imágenes comprimidas
    const webpImages = [
        'assets/blog-optimized/featured-materiales-compressed.jpg',
        'assets/blog-optimized/disenador-usando-una-impresora-3d-compressed.jpg',
        'assets/carousel/prinx-llavero-compressed.jpg'
    ];
    
    for (const imagePath of webpImages) {
        if (fs.existsSync(imagePath)) {
            const webpPath = imagePath.replace('.jpg', '.webp');
            await createWebP(imagePath, webpPath, 85);
        }
    }
    
    console.log('\n📱 Creando versiones responsive...\n');
    
    // Crear versiones responsive
    const responsiveImages = [
        {
            input: 'assets/blog-optimized/featured-materiales-compressed.jpg',
            baseName: 'featured-materiales',
            outputDir: 'assets/blog-optimized'
        },
        {
            input: 'assets/blog-optimized/disenador-usando-una-impresora-3d-compressed.jpg',
            baseName: 'disenador-usando-una-impresora-3d',
            outputDir: 'assets/blog-optimized'
        }
    ];
    
    for (const image of responsiveImages) {
        if (fs.existsSync(image.input)) {
            await createResponsiveVersions(image.input, image.baseName, image.outputDir);
        }
    }
    
    // Resumen
    const totalSavings = Math.round((1 - totalCompressedSize / totalOriginalSize) * 100);
    
    console.log('\n📊 RESUMEN DE COMPRESIÓN:');
    console.log(`📁 Tamaño original: ${Math.round(totalOriginalSize/1024/1024)} MB`);
    console.log(`📁 Tamaño comprimido: ${Math.round(totalCompressedSize/1024/1024)} MB`);
    console.log(`💾 Ahorro total: ${totalSavings}%`);
    
    console.log('\n✅ Compresión completada!');
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Actualizar referencias en HTML para usar imágenes comprimidas');
    console.log('2. Probar rendimiento con Lighthouse');
    console.log('3. Verificar que las imágenes se vean bien');
}

main().catch(console.error);
