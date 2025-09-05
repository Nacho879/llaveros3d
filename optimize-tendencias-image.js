const sharp = require('sharp');
const path = require('path');

async function optimizeTendenciasImage() {
    const inputPath = path.join(__dirname, 'assets', 'blog', 'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg');
    const outputDir = path.join(__dirname, 'assets', 'blog-optimized');
    
    try {
        // Crear versión comprimida
        await sharp(inputPath)
            .jpeg({ quality: 80 })
            .toFile(path.join(outputDir, 'jakub-zerdzicki-DX0YfVfjljk-unsplash-compressed.jpg'));
        
        // Crear versiones responsive
        const sizes = [
            { width: 400, height: 300, suffix: 'small' },
            { width: 800, height: 600, suffix: 'medium' },
            { width: 1200, height: 900, suffix: 'large' }
        ];
        
        for (const size of sizes) {
            await sharp(inputPath)
                .resize(size.width, size.height)
                .jpeg({ quality: 80 })
                .toFile(path.join(outputDir, `jakub-zerdzicki-DX0YfVfjljk-unsplash-${size.suffix}.jpg`));
            
            console.log(`✅ Creada versión ${size.suffix}: ${size.width}x${size.height}`);
        }
        
        console.log('✅ Imagen de tendencias optimizada correctamente');
        
    } catch (error) {
        console.error('❌ Error optimizando imagen:', error.message);
    }
}

optimizeTendenciasImage();
