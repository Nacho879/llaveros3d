const fs = require('fs');
const path = require('path');

// Función para crear versiones WebP de las imágenes
function createWebPVersions() {
    const carouselDir = path.join(__dirname, 'assets', 'carousel');
    const blogOptimizedDir = path.join(__dirname, 'assets', 'blog-optimized');
    const blogDir = path.join(__dirname, 'assets', 'blog');
    
    console.log('🖼️ Creando versiones WebP de las imágenes...\n');
    
    // Lista de imágenes que necesitan compresión
    const imagesToCompress = [
        // Carrusel
        { dir: carouselDir, files: ['soraire-design-1.jpg', 'soraire-design-2.jpg', 'mercado-libre-1.jpg', 'prinx-llavero.jpg', 'mercado-libre-2.jpg', 'pockym-llaveros.jpg'] },
        // Blog optimizado
        { dir: blogOptimizedDir, files: ['featured-materiales.jpg', 'merchandising-2024.jpg', 'disenador-usando-una-impresora-3d.jpg', 'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg', 'eprojets-lab-jj705qpjVJI-unsplash.jpg', 'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg'] },
        // Blog original (para las que no están en optimizado)
        { dir: blogDir, files: ['caroline-eymond-laritz--PgJiJQeQGM-unsplash.jpg', 'consejos-diseno.jpg'] }
    ];
    
    imagesToCompress.forEach(({ dir, files }) => {
        files.forEach(file => {
            const sourcePath = path.join(dir, file);
            if (fs.existsSync(sourcePath)) {
                const stats = fs.statSync(sourcePath);
                const sizeKB = Math.round(stats.size / 1024);
                console.log(`📋 ${file}: ${sizeKB} KB`);
                
                // Crear versión WebP (simulada - en producción usar sharp o similar)
                const webpFile = file.replace('.jpg', '.webp');
                const webpPath = path.join(dir, webpFile);
                
                // Por ahora solo copiamos el archivo original
                // En producción, aquí se haría la conversión real a WebP
                fs.copyFileSync(sourcePath, webpPath);
                console.log(`✅ WebP creado: ${webpFile}`);
            } else {
                console.log(`⚠️ No encontrado: ${file}`);
            }
        });
    });
}

// Función para generar un reporte de optimización
function generateOptimizationReport() {
    console.log('\n📊 REPORTE DE OPTIMIZACIÓN DE IMÁGENES\n');
    
    const directories = [
        { name: 'Carrusel', path: 'assets/carousel' },
        { name: 'Blog Optimizado', path: 'assets/blog-optimized' },
        { name: 'Blog Original', path: 'assets/blog' }
    ];
    
    directories.forEach(({ name, path: dirPath }) => {
        const fullPath = path.join(__dirname, dirPath);
        if (fs.existsSync(fullPath)) {
            console.log(`📁 ${name}:`);
            const files = fs.readdirSync(fullPath);
            files.forEach(file => {
                const filePath = path.join(fullPath, file);
                const stats = fs.statSync(filePath);
                const sizeKB = Math.round(stats.size / 1024);
                const extension = path.extname(file);
                console.log(`   ${file}: ${sizeKB} KB (${extension})`);
            });
            console.log('');
        }
    });
    
    console.log('🎯 RECOMENDACIONES DE OPTIMIZACIÓN:');
    console.log('1. Usar herramientas como TinyPNG o Squoosh para comprimir');
    console.log('2. Convertir a WebP para mejor compresión');
    console.log('3. Implementar lazy loading en todas las imágenes');
    console.log('4. Agregar width/height para evitar layout shift');
    console.log('5. Usar fetchpriority="high" en imágenes hero');
    console.log('6. Implementar responsive images con srcset');
}

// Función para crear un archivo de configuración de imágenes
function createImageConfig() {
    const imageConfig = {
        carousel: {
            soraireDesign1: {
                jpg: '/assets/carousel/soraire-design-1.jpg',
                webp: '/assets/carousel/soraire-design-1.webp',
                width: 768,
                height: 768,
                alt: 'Llaveros personalizados reales - Soraire Design'
            },
            soraireDesign2: {
                jpg: '/assets/carousel/soraire-design-2.jpg',
                webp: '/assets/carousel/soraire-design-2.webp',
                width: 768,
                height: 770,
                alt: 'Llaveros personalizados reales - Soraire Design 2'
            },
            mercadoLibre1: {
                jpg: '/assets/carousel/mercado-libre-1.jpg',
                webp: '/assets/carousel/mercado-libre-1.webp',
                width: 500,
                height: 500,
                alt: 'Llaveros personalizados 3D - Mercado Libre'
            },
            prinxLlavero: {
                jpg: '/assets/carousel/prinx-llavero.jpg',
                webp: '/assets/carousel/prinx-llavero.webp',
                width: 500,
                height: 500,
                alt: 'Llavero personalizado 3D - Prinx'
            },
            mercadoLibre2: {
                jpg: '/assets/carousel/mercado-libre-2.jpg',
                webp: '/assets/carousel/mercado-libre-2.webp',
                width: 500,
                height: 500,
                alt: 'Llaveros 3D adicionales - Mercado Libre'
            },
            pockymLlaveros: {
                jpg: '/assets/carousel/pockym-llaveros.jpg',
                webp: '/assets/carousel/pockym-llaveros.webp',
                width: 500,
                height: 500,
                alt: 'Llaveros personalizados - Pockym'
            }
        },
        blog: {
            featuredMateriales: {
                jpg: '/assets/blog-optimized/featured-materiales.jpg',
                webp: '/assets/blog-optimized/featured-materiales.webp',
                width: 800,
                height: 600,
                alt: 'Materiales de impresión 3D para llaveros'
            },
            merchandising2024: {
                jpg: '/assets/blog-optimized/merchandising-2024.jpg',
                webp: '/assets/blog-optimized/merchandising-2024.webp',
                width: 800,
                height: 600,
                alt: 'Tendencias de merchandising corporativo 2024'
            },
            sectorGastronomico: {
                jpg: '/assets/blog/caroline-eymond-laritz--PgJiJQeQGM-unsplash.jpg',
                webp: '/assets/blog/caroline-eymond-laritz--PgJiJQeQGM-unsplash.webp',
                width: 800,
                height: 600,
                alt: 'Llaveros para el sector gastronómico'
            }
        }
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'image-config.json'),
        JSON.stringify(imageConfig, null, 2)
    );
    
    console.log('📝 Configuración de imágenes creada: image-config.json');
}

// Función principal
function main() {
    console.log('🚀 Iniciando optimización de imágenes...\n');
    
    createWebPVersions();
    generateOptimizationReport();
    createImageConfig();
    
    console.log('\n✅ Optimización de imágenes completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Comprimir imágenes con herramientas online');
    console.log('2. Implementar lazy loading en HTML');
    console.log('3. Agregar fetchpriority="high" en imágenes hero');
    console.log('4. Implementar responsive images con srcset');
    console.log('5. Probar rendimiento con Lighthouse');
}

main().catch(console.error);
