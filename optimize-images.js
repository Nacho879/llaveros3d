// Script para optimizar imágenes del blog
const fs = require('fs');
const path = require('path');

// Mapeo de imágenes de Google Drive a nombres del blog
const imageMapping = {
    // Imágenes principales del blog
    'featured-materiales.jpg': 'disenador-usando-una-impresora-3d.jpg',
    'merchandising-2024.jpg': 'caroline-eymond-laritaz--PgJiJQeQGM-unsplash.jpg',
    'sector-gastronomico.jpg': 'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg',
    'consejos-diseno.jpg': 'eprojets-lab-jj705qpjVJI-unsplash.jpg',
    'sector-automocion.jpg': 'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg',
    'eventos-corporativos.jpg': 'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg',
    'roi-merchandising.jpg': 'tom-claes-nNP-1l_jESs-unsplash.jpg',
    'guia-materiales-3d.jpg': 'primer-plano-en-la-impresora-3d.jpg',
    
    // Imágenes adicionales para artículos
    'materiales-pla.jpg': 'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg',
    'materiales-petg.jpg': 'disenador-usando-una-impresora-3d (1).jpg',
    'materiales-abs.jpg': 'primer-plano-en-la-impresora-3d (1).jpg',
    'proceso-impresion.jpg': 'kadir-celep-HsefvbLbNWc-unsplash.jpg',
    'llaveros-ejemplos.jpg': 'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg',
    'sector-tecnologico.jpg': 'kadir-celep-NwOeoxUY_p0-unsplash.jpg'
};

// URLs de descarga directa de Google Drive
const driveUrls = {
    'disenador-usando-una-impresora-3d.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'disenador-usando-una-impresora-3d (1).jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'primer-plano-en-la-impresora-3d.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'primer-plano-en-la-impresora-3d (1).jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'snapmaker-3d-printer-ib5FkwAKkLE-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'caroline-eymond-laritaz--PgJiJQeQGM-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'eprojets-lab-jj705qpjVJI-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'ines-alvarez-fdez-L_N7BaNLC5Y-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'tom-claes-nNP-1l_jESs-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-DX0YfVfjljk-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-oG3rjdcSnEU-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'jakub-zerdzicki-yDp9UPdiQrQ-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'kadir-celep-HsefvbLbNWc-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y',
    'kadir-celep-NwOeoxUY_p0-unsplash.jpg': 'https://drive.google.com/uc?export=download&id=1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y'
};

console.log('📸 Mapeo de imágenes para el blog:');
console.log('=====================================');

Object.entries(imageMapping).forEach(([blogName, driveName]) => {
    console.log(`✅ ${blogName} ← ${driveName}`);
});

console.log('\n🔗 URLs de Google Drive disponibles:');
console.log('=====================================');
console.log('Carpeta principal: https://drive.google.com/drive/folders/1tommqKVQAFeLpOjtc-jBp_19ih0-0Y7Y');

console.log('\n📋 Instrucciones para descargar:');
console.log('================================');
console.log('1. Ve a la carpeta de Google Drive');
console.log('2. Descarga cada imagen individualmente');
console.log('3. Renombra según el mapeo anterior');
console.log('4. Coloca en la carpeta /assets/blog/');
console.log('5. Optimiza para web (reducir tamaño)');

module.exports = { imageMapping, driveUrls };
