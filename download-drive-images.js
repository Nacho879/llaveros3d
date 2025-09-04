// Script para descargar imágenes de Google Drive
const https = require('https');
const fs = require('fs');
const path = require('path');

// IDs de archivos de Google Drive (necesitamos extraerlos de las URLs)
const driveFileIds = {
    'disenador-usando-una-impresora-3d.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'disenador-usando-una-impresora-3d (1).jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'primer-plano-en-la-impresora-3d.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'primer-plano-en-la-impresora-3d (1).jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'caroline-eymond-laritaz--PgJiJQeQGM-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'eprojets-lab-jj705qpjVJI-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'tom-claes-nNP-1l_jESs-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'kadir-celep-HsefvbLbNWc-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'kadir-celep-NwOeoxUY_p0-unsplash.jpg': '1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y'
};

// Mapeo de nombres para el blog
const blogMapping = {
    'disenador-usando-una-impresora-3d.jpg': 'featured-materiales.jpg',
    'caroline-eymond-laritaz--PgJiJQeQGM-unsplash.jpg': 'merchandising-2024.jpg',
    'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg': 'sector-gastronomico.jpg',
    'eprojets-lab-jj705qpjVJI-unsplash.jpg': 'consejos-diseno.jpg',
    'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg': 'sector-automocion.jpg',
    'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg': 'eventos-corporativos.jpg',
    'tom-claes-nNP-1l_jESs-unsplash.jpg': 'roi-merchandising.jpg',
    'primer-plano-en-la-impresora-3d.jpg': 'guia-materiales-3d.jpg',
    'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg': 'materiales-pla.jpg',
    'disenador-usando-una-impresora-3d (1).jpg': 'materiales-petg.jpg',
    'primer-plano-en-la-impresora-3d (1).jpg': 'materiales-abs.jpg',
    'kadir-celep-HsefvbLbNWc-unsplash.jpg': 'proceso-impresion.jpg',
    'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg': 'llaveros-ejemplos.jpg',
    'kadir-celep-NwOeoxUY_p0-unsplash.jpg': 'sector-tecnologico.jpg'
};

function downloadImage(filename, blogName) {
    return new Promise((resolve, reject) => {
        const fileId = driveFileIds[filename];
        if (!fileId) {
            reject(new Error(`No se encontró el ID para ${filename}`));
            return;
        }

        const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const outputPath = path.join(__dirname, 'assets', 'blog', blogName);

        console.log(`📥 Descargando ${filename} → ${blogName}...`);

        const file = fs.createWriteStream(outputPath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ ${blogName} descargado correctamente`);
                    resolve();
                });
            } else {
                reject(new Error(`Error al descargar ${filename}: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadAllImages() {
    console.log('🚀 Iniciando descarga de imágenes de Google Drive...');
    console.log('==================================================');
    
    const downloadPromises = Object.entries(blogMapping).map(([driveName, blogName]) => 
        downloadImage(driveName, blogName)
    );

    try {
        await Promise.all(downloadPromises);
        console.log('\n🎉 ¡Todas las imágenes han sido descargadas correctamente!');
        console.log('📁 Ubicación: /assets/blog/');
    } catch (error) {
        console.error('❌ Error al descargar imágenes:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    downloadAllImages();
}

module.exports = { downloadAllImages, downloadImage };
