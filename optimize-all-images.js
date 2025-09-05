const fs = require('fs');
const path = require('path');
const https = require('https');

// URLs de imágenes externas que necesitamos descargar
const externalImages = [
    {
        url: 'https://sorairedesign.com/wp-content/uploads/2025/02/Llaveros-Personalizados-Soraire-Design-1-768x768.jpg',
        filename: 'soraire-design-1.jpg',
        alt: 'Llaveros personalizados reales - Soraire Design'
    },
    {
        url: 'https://sorairedesign.com/wp-content/uploads/2024/12/Llaveros-Personalizados-Soraire-Design-5-768x770.jpg',
        filename: 'soraire-design-2.jpg',
        alt: 'Llaveros personalizados reales - Soraire Design 2'
    },
    {
        url: 'https://http2.mlstatic.com/D_NQ_NP_761037-MLU89539906232_082025-O.webp',
        filename: 'mercado-libre-1.jpg',
        alt: 'Llaveros personalizados 3D - Mercado Libre'
    },
    {
        url: 'https://prinx.es/cdn/shop/files/llavero-personalizado-en-3d-diseno-por-encargo-4885440.png?v=1751430547',
        filename: 'prinx-llavero.jpg',
        alt: 'Llavero personalizado 3D - Prinx'
    },
    {
        url: 'https://http2.mlstatic.com/D_NQ_NP_695141-MLA84038804815_042025-O.webp',
        filename: 'mercado-libre-2.jpg',
        alt: 'Llaveros 3D adicionales - Mercado Libre'
    },
    {
        url: 'https://pockym.ar/wp-content/uploads/2024/01/9.jpg',
        filename: 'pockym-llaveros.jpg',
        alt: 'Llaveros personalizados - Pockym'
    }
];

// Función para descargar imagen
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(__dirname, 'assets', 'carousel', filename));
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Descargada: ${filename}`);
                    resolve();
                });
            } else if (response.statusCode === 302 || response.statusCode === 301) {
                // Seguir redirección
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
            } else {
                reject(new Error(`Error ${response.statusCode} descargando ${url}`));
            }
        }).on('error', (err) => {
            fs.unlink(path.join(__dirname, 'assets', 'carousel', filename), () => {});
            reject(err);
        });
    });
}

// Función para crear directorio si no existe
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Directorio creado: ${dir}`);
    }
}

// Función para optimizar imágenes existentes del blog
function optimizeBlogImages() {
    const blogImagesDir = path.join(__dirname, 'assets', 'blog');
    const optimizedDir = path.join(__dirname, 'assets', 'blog-optimized');
    
    ensureDir(optimizedDir);
    
    // Lista de imágenes del blog que necesitan optimización
    const blogImages = [
        'featured-materiales.jpg',
        'merchandising-2024.jpg',
        'caroline-eymond-laritz--PgJiJQeQGM-unsplash.jpg',
        'disenador-usando-una-impresora-3d.jpg',
        'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg',
        'eprojets-lab-jj705qpjVJI-unsplash.jpg',
        'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg',
        'consejos-diseno.jpg'
    ];
    
    blogImages.forEach(imageName => {
        const sourcePath = path.join(blogImagesDir, imageName);
        const targetPath = path.join(optimizedDir, imageName);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`📋 Copiada para optimización: ${imageName}`);
        } else {
            console.log(`⚠️ No encontrada: ${imageName}`);
        }
    });
}

// Función principal
async function main() {
    console.log('🚀 Iniciando optimización de imágenes...\n');
    
    // Crear directorios necesarios
    ensureDir(path.join(__dirname, 'assets', 'carousel'));
    ensureDir(path.join(__dirname, 'assets', 'blog-optimized'));
    
    // Optimizar imágenes del blog
    console.log('📋 Optimizando imágenes del blog...');
    optimizeBlogImages();
    
    // Descargar imágenes externas
    console.log('\n🌐 Descargando imágenes externas...');
    for (const image of externalImages) {
        try {
            await downloadImage(image.url, image.filename);
        } catch (error) {
            console.log(`❌ Error descargando ${image.filename}: ${error.message}`);
        }
    }
    
    console.log('\n✅ Optimización de imágenes completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Comprimir imágenes con herramientas online (TinyPNG, Squoosh)');
    console.log('2. Convertir a WebP para mejor compresión');
    console.log('3. Actualizar HTML con nuevas rutas y atributos');
    console.log('4. Agregar width/height y loading="lazy"');
}

main().catch(console.error);
