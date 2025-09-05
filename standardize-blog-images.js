const fs = require('fs');
const path = require('path');

// Función para estandarizar imágenes en un archivo HTML
function standardizeImagesInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Estandarizar imágenes relacionadas a 300x200
        const relatedImageRegex = /width="400"\s+height="300"/g;
        if (content.match(relatedImageRegex)) {
            content = content.replace(relatedImageRegex, 'width="300" height="200"');
            modified = true;
            console.log(`✅ Estandarizado imágenes relacionadas en: ${path.basename(filePath)}`);
        }

        // Asegurar que todas las imágenes tengan loading="lazy"
        const lazyRegex = /<img([^>]*?)(?:\s+loading="[^"]*")?([^>]*?)>/g;
        content = content.replace(lazyRegex, (match, before, after) => {
            if (!match.includes('loading=')) {
                return `<img${before} loading="lazy"${after}>`;
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`📝 Archivo actualizado: ${path.basename(filePath)}`);
        }

    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
}

// Función principal
function standardizeAllBlogImages() {
    const blogDir = path.join(__dirname, 'blog');
    
    console.log('🎨 Estandarizando imágenes del blog...\n');

    // Obtener todos los archivos HTML del blog
    const files = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(blogDir, file));

    console.log(`📁 Encontrados ${files.length} archivos HTML en el blog\n`);

    // Procesar cada archivo
    files.forEach(file => {
        standardizeImagesInFile(file);
    });

    console.log('\n✅ ¡Estandarización de imágenes completada!');
    console.log('\n📏 Tamaños estandarizados:');
    console.log('   • Imágenes principales: 400x300 píxeles');
    console.log('   • Imágenes relacionadas: 300x200 píxeles');
    console.log('   • Todas las imágenes tienen loading="lazy"');
}

// Ejecutar el script
standardizeAllBlogImages();
