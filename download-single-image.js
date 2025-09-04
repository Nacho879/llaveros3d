// Script para descargar una imagen específica de Google Drive
const https = require('https');
const fs = require('fs');
const path = require('path');

// ID de la imagen que quieres descargar
const imageId = '1njeKdlUXqeRjwz370YY9eqF1xEtqnC6b';
const filename = 'merchandising-2024.jpg';

// Función para descargar con manejo de redirecciones
function downloadImageWithRedirects(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        const request = https.get(url, (response) => {
            // Si hay redirección, seguirla
            if (response.statusCode === 302 || response.statusCode === 303) {
                const redirectUrl = response.headers.location;
                console.log(`🔄 Redirección detectada: ${redirectUrl}`);
                
                // Cerrar el archivo actual
                file.close();
                
                // Intentar con la URL de redirección
                downloadImageWithRedirects(redirectUrl, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Imagen descargada: ${filename}`);
                    resolve();
                });
            } else {
                console.log(`❌ Error: ${response.statusCode}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        });
        
        request.on('error', (err) => {
            console.log(`❌ Error de red: ${err.message}`);
            reject(err);
        });
    });
}

// Función principal
async function main() {
    console.log('🚀 Descargando imagen de Google Drive...');
    console.log(`📎 ID: ${imageId}`);
    console.log(`📁 Archivo: ${filename}`);
    
    // Crear directorio si no existe
    const assetsDir = path.join(__dirname, 'assets', 'blog');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
        console.log(`📁 Directorio creado: ${assetsDir}`);
    }
    
    const filePath = path.join(assetsDir, filename);
    
    // Intentar diferentes URLs de Google Drive
    const urls = [
        `https://drive.google.com/uc?export=download&id=${imageId}`,
        `https://drive.google.com/uc?export=view&id=${imageId}`,
        `https://docs.google.com/uc?export=download&id=${imageId}`
    ];
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`\\n🔄 Intentando URL ${i + 1}: ${url}`);
        
        try {
            await downloadImageWithRedirects(url, filePath);
            console.log(`\\n✅ ¡Éxito! Imagen descargada en: ${filePath}`);
            
            // Verificar el tamaño del archivo
            const stats = fs.statSync(filePath);
            console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(1)} KB`);
            
            return;
        } catch (error) {
            console.log(`❌ Error con URL ${i + 1}: ${error.message}`);
            
            // Eliminar archivo si existe
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
    
    console.log('\\n❌ No se pudo descargar la imagen con ninguna URL');
    console.log('\\n💡 Sugerencias:');
    console.log('1. Verifica que el archivo esté compartido públicamente');
    console.log('2. Intenta con un enlace directo de descarga');
    console.log('3. Descarga manualmente y colócalo en assets/blog/');
}

// Ejecutar
main().catch(console.error);
