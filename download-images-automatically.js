// Script para descargar imágenes automáticamente desde Google Drive
// Necesitas actualizar los IDs con los reales de tu carpeta

const fs = require('fs');
const path = require('path');
const https = require('https');

// Mapeo de imágenes con IDs reales (actualiza estos IDs)
const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales': '19H3lvPGnK-ej1OHnO8rhYYugjlAFLoBN',
    'merchandising-2024': 'PLACEHOLDER_ID_2', 
    'sector-gastronomico': 'PLACEHOLDER_ID_3',
    'consejos-diseno': 'PLACEHOLDER_ID_4',
    'sector-automocion': 'PLACEHOLDER_ID_5',
    'eventos-corporativos': 'PLACEHOLDER_ID_6',
    'roi-merchandising': 'PLACEHOLDER_ID_7',
    
    // Imágenes de artículos específicos
    'guia-materiales-3d': 'PLACEHOLDER_ID_8',
    'materiales-pla': 'PLACEHOLDER_ID_9',
    'materiales-petg': 'PLACEHOLDER_ID_10',
    'materiales-abs': 'PLACEHOLDER_ID_11',
    'proceso-impresion': 'PLACEHOLDER_ID_12',
    'llaveros-ejemplos': 'PLACEHOLDER_ID_13',
    'sector-tecnologico': 'PLACEHOLDER_ID_14',
    'disenadores-trabajando': 'PLACEHOLDER_ID_15',
    'impresora-3d-detalle': 'PLACEHOLDER_ID_16',
    'proceso-fabricacion': 'PLACEHOLDER_ID_17',
    'calidad-control': 'PLACEHOLDER_ID_18',
    'materiales-variados': 'PLACEHOLDER_ID_19',
    'tecnologia-avanzada': 'PLACEHOLDER_ID_20',
    'produccion-masiva': 'PLACEHOLDER_ID_21',
    'innovacion-3d': 'PLACEHOLDER_ID_22',
    'futuro-impresion': 'PLACEHOLDER_ID_23'
};

// Función para descargar una imagen
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Descargada: ${filename}`);
                    resolve();
                });
            } else {
                console.log(`❌ Error descargando ${filename}: ${response.statusCode}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', (err) => {
            console.log(`❌ Error de red descargando ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

// Función para crear directorio si no existe
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Directorio creado: ${dirPath}`);
    }
}

// Función principal para descargar todas las imágenes
async function downloadAllImages() {
    console.log('🚀 Iniciando descarga de imágenes...');
    console.log('=====================================');
    
    // Crear directorio de assets/blog si no existe
    const assetsDir = path.join(__dirname, 'assets', 'blog');
    ensureDirectoryExists(assetsDir);
    
    let successCount = 0;
    let totalCount = Object.keys(imageMapping).length;
    
    for (const [filename, id] of Object.entries(imageMapping)) {
        if (id.startsWith('PLACEHOLDER_ID')) {
            console.log(`⚠️ Saltando ${filename}: ID no configurado`);
            continue;
        }
        
        const url = `https://drive.google.com/uc?export=download&id=${id}`;
        const filePath = path.join(assetsDir, `${filename}.jpg`);
        
        try {
            await downloadImage(url, filePath);
            successCount++;
            
            // Esperar un poco entre descargas para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log(`❌ Error descargando ${filename}: ${error.message}`);
        }
    }
    
    console.log('\\n=====================================');
    console.log(`✅ Descarga completada: ${successCount}/${totalCount} imágenes descargadas`);
    
    if (successCount > 0) {
        console.log('\\n📋 Próximos pasos:');
        console.log('1. Verifica que las imágenes se descargaron correctamente');
        console.log('2. Despliega los cambios a producción');
        console.log('3. Las imágenes ahora se mostrarán en el blog');
    }
}

// Función para generar un mapeo actualizado
function generateUpdatedMapping() {
    console.log('\\n🔗 Mapeo actualizado:');
    console.log('====================');
    
    const mapping = Object.entries(imageMapping).map(([key, value]) => 
        `'${key}': '${value}'`
    ).join(',\\n    ');
    
    const mappingText = `const imageMapping = {
    ${mapping}
};`;
    
    console.log(mappingText);
    
    // Guardar en archivo
    fs.writeFileSync('image-mapping.js', mappingText);
    console.log('\\n💾 Mapeo guardado en: image-mapping.js');
}

// Función para verificar qué imágenes están disponibles
function checkAvailableImages() {
    console.log('\\n🔍 Verificando imágenes disponibles...');
    console.log('=====================================');
    
    const assetsDir = path.join(__dirname, 'assets', 'blog');
    
    Object.keys(imageMapping).forEach(filename => {
        const filePath = path.join(assetsDir, `${filename}.jpg`);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`✅ ${filename}.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
        } else {
            console.log(`❌ ${filename}.jpg (no encontrado)`);
        }
    });
}

// Función para mostrar ayuda
function showHelp() {
    console.log('\\n📋 Ayuda - Configuración de Imágenes del Blog');
    console.log('==============================================');
    console.log('\\n1. ACTUALIZAR IDs:');
    console.log('   - Abre la carpeta de Google Drive');
    console.log('   - Haz clic derecho en cada imagen');
    console.log('   - Selecciona "Obtener enlace"');
    console.log('   - Copia el ID (después de /d/ y antes de /view)');
    console.log('   - Actualiza el mapeo en este script');
    console.log('\\n2. DESCARGAR IMÁGENES:');
    console.log('   - Ejecuta: node download-images-automatically.js');
    console.log('\\n3. VERIFICAR:');
    console.log('   - Ejecuta: node download-images-automatically.js --check');
    console.log('\\n4. GENERAR MAPEO:');
    console.log('   - Ejecuta: node download-images-automatically.js --mapping');
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    if (args.includes('--check')) {
        checkAvailableImages();
        return;
    }
    
    if (args.includes('--mapping')) {
        generateUpdatedMapping();
        return;
    }
    
    // Verificar si hay IDs configurados
    const configuredIds = Object.values(imageMapping).filter(id => !id.startsWith('PLACEHOLDER_ID'));
    
    if (configuredIds.length === 0) {
        console.log('⚠️ No hay IDs configurados. Sigue estos pasos:');
        console.log('\\n1. Abre la carpeta de Google Drive:');
        console.log('   https://drive.google.com/drive/folders/1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y');
        console.log('\\n2. Copia los IDs de las imágenes');
        console.log('\\n3. Actualiza el mapeo en este script');
        console.log('\\n4. Ejecuta el script nuevamente');
        return;
    }
    
    // Descargar imágenes
    await downloadAllImages();
    
    // Verificar resultados
    checkAvailableImages();
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    imageMapping,
    downloadImage,
    downloadAllImages,
    checkAvailableImages,
    generateUpdatedMapping
};
