const fs = require('fs');
const path = require('path');

// Función para crear iconos PNG desde SVG
function createPNGIcon(size, filename) {
    // Por ahora creamos un SVG que simula un PNG
    // En producción, usarías una librería como sharp para convertir SVG a PNG
    const svgContent = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size/8}" fill="#3b82f6"/>
    <rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}" rx="${size*0.05}" fill="#ffffff"/>
    <text x="${size/2}" y="${size*0.4}" font-family="Arial, sans-serif" font-size="${size*0.2}" font-weight="bold" fill="#3b82f6" text-anchor="middle">3D</text>
    <text x="${size/2}" y="${size*0.6}" font-family="Arial, sans-serif" font-size="${size*0.15}" font-weight="bold" fill="#3b82f6" text-anchor="middle">LLAVERO</text>
    <circle cx="${size*0.2}" cy="${size*0.2}" r="${size*0.08}" fill="#3b82f6"/>
    <circle cx="${size*0.8}" cy="${size*0.2}" r="${size*0.08}" fill="#3b82f6"/>
    <circle cx="${size*0.2}" cy="${size*0.8}" r="${size*0.08}" fill="#3b82f6"/>
    <circle cx="${size*0.8}" cy="${size*0.8}" r="${size*0.08}" fill="#3b82f6"/>
</svg>`;
    
    // Para simular PNG, guardamos como SVG pero con extensión .png
    // En producción, convertirías a PNG real
    fs.writeFileSync(path.join(__dirname, filename), svgContent);
    console.log(`✅ Icono creado: ${filename} (${size}x${size})`);
}

// Función para crear favicon.ico (simulado como SVG)
function createFavicon() {
    const faviconContent = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#3b82f6"/>
    <rect x="3" y="3" width="26" height="26" rx="2" fill="#ffffff"/>
    <text x="16" y="12" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#3b82f6" text-anchor="middle">3D</text>
    <text x="16" y="20" font-family="Arial, sans-serif" font-size="4" font-weight="bold" fill="#3b82f6" text-anchor="middle">LLAVERO</text>
    <circle cx="6" cy="6" r="2" fill="#3b82f6"/>
    <circle cx="26" cy="6" r="2" fill="#3b82f6"/>
    <circle cx="6" cy="26" r="2" fill="#3b82f6"/>
    <circle cx="26" cy="26" r="2" fill="#3b82f6"/>
</svg>`;
    
    fs.writeFileSync(path.join(__dirname, 'favicon.ico'), faviconContent);
    console.log('✅ Favicon creado: favicon.ico');
}

// Función para crear iconos de diferentes tamaños
function createAllIcons() {
    console.log('🚀 Creando todos los iconos necesarios...\n');
    
    // Favicon
    createFavicon();
    
    // Iconos PNG estándar
    createPNGIcon(16, 'favicon-16x16.png');
    createPNGIcon(32, 'favicon-32x32.png');
    
    // Apple Touch Icon
    createPNGIcon(180, 'apple-touch-icon.png');
    
    // Android Chrome Icons
    createPNGIcon(192, 'android-chrome-192x192.png');
    createPNGIcon(512, 'android-chrome-512x512.png');
    
    // Iconos adicionales para mejor compatibilidad
    createPNGIcon(144, 'android-chrome-144x144.png');
    createPNGIcon(152, 'apple-touch-icon-152x152.png');
    createPNGIcon(167, 'apple-touch-icon-167x167.png');
    
    console.log('\n✅ Todos los iconos han sido creados!');
    console.log('\n📝 Nota: Estos son archivos SVG simulando PNG.');
    console.log('En producción, convierte a PNG real usando herramientas como:');
    console.log('- Sharp (Node.js)');
    console.log('- ImageMagick');
    console.log('- Online converters');
}

// Función para verificar que todos los iconos estén presentes
function verifyIcons() {
    const requiredIcons = [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png'
    ];
    
    console.log('\n🔍 Verificando iconos requeridos...');
    
    requiredIcons.forEach(icon => {
        if (fs.existsSync(path.join(__dirname, icon))) {
            const stats = fs.statSync(path.join(__dirname, icon));
            console.log(`✅ ${icon} (${Math.round(stats.size/1024)} KB)`);
        } else {
            console.log(`❌ ${icon} - FALTANTE`);
        }
    });
}

// Función para actualizar el manifest si es necesario
function updateManifest() {
    const manifestPath = path.join(__dirname, 'site.webmanifest');
    
    if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Verificar que todos los iconos del manifest existan
        const missingIcons = manifest.icons.filter(icon => 
            !fs.existsSync(path.join(__dirname, icon.src.replace('/', '')))
        );
        
        if (missingIcons.length === 0) {
            console.log('✅ Manifest actualizado - todos los iconos están presentes');
        } else {
            console.log('⚠️ Manifest necesita actualización - algunos iconos faltan');
            missingIcons.forEach(icon => {
                console.log(`   - ${icon.src}`);
            });
        }
    }
}

// Función principal
function main() {
    console.log('🎨 Generador de Iconos para Llavero3D.com\n');
    
    createAllIcons();
    verifyIcons();
    updateManifest();
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Convertir SVGs a PNG reales usando herramientas online');
    console.log('2. Optimizar tamaños de archivo');
    console.log('3. Probar en diferentes dispositivos');
    console.log('4. Verificar que no haya errores 404');
    console.log('5. Actualizar manifest si es necesario');
}

main().catch(console.error);
