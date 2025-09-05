const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Función para crear un icono PNG real con Sharp
async function createRealIcon(size, filename) {
    try {
        // Crear un SVG con el logo de Llavero3D
        const svg = `
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
                    </linearGradient>
                </defs>
                
                <!-- Fondo con gradiente -->
                <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="url(#bg)"/>
                
                <!-- Fondo blanco interno -->
                <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.05}" fill="#ffffff"/>
                
                <!-- Texto 3D -->
                <text x="${size / 2}" y="${size * 0.4}" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" text-anchor="middle" fill="#3b82f6">3D</text>
                
                <!-- Texto LLAVERO (solo en iconos grandes) -->
                ${size >= 32 ? `<text x="${size / 2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.12}" font-weight="bold" text-anchor="middle" fill="#3b82f6">LLAVERO</text>` : ''}
                
                <!-- Esquinas decorativas (solo en iconos grandes) -->
                ${size >= 32 ? `
                    <circle cx="${size * 0.08}" cy="${size * 0.08}" r="${size * 0.08}" fill="#3b82f6"/>
                    <circle cx="${size * 0.92}" cy="${size * 0.08}" r="${size * 0.08}" fill="#3b82f6"/>
                    <circle cx="${size * 0.08}" cy="${size * 0.92}" r="${size * 0.08}" fill="#3b82f6"/>
                    <circle cx="${size * 0.92}" cy="${size * 0.92}" r="${size * 0.08}" fill="#3b82f6"/>
                ` : ''}
            </svg>
        `;
        
        // Convertir SVG a PNG usando Sharp
        await sharp(Buffer.from(svg))
            .png()
            .resize(size, size)
            .toFile(filename);
            
        console.log(`✅ Icono PNG real creado: ${filename} (${size}x${size})`);
        
        // Verificar el archivo creado
        const stats = fs.statSync(filename);
        console.log(`   📊 Tamaño: ${Math.round(stats.size/1024)} KB`);
        
    } catch (error) {
        console.error(`❌ Error creando ${filename}:`, error.message);
    }
}

// Función para crear todos los iconos
async function createAllRealIcons() {
    console.log('🎨 Creando iconos PNG reales con Sharp...\n');
    
    const icons = [
        { size: 16, name: 'favicon-16x16.png' },
        { size: 32, name: 'favicon-32x32.png' },
        { size: 180, name: 'apple-touch-icon.png' },
        { size: 192, name: 'android-chrome-192x192.png' },
        { size: 512, name: 'android-chrome-512x512.png' }
    ];
    
    for (const icon of icons) {
        await createRealIcon(icon.size, icon.name);
    }
    
    console.log('\n✅ Todos los iconos PNG reales han sido creados!');
}

// Función para verificar que los archivos sean PNG válidos
function verifyPNGFiles() {
    console.log('\n🔍 Verificando archivos PNG...');
    
    const pngFiles = [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png'
    ];
    
    pngFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const buffer = fs.readFileSync(filePath);
            
            // Verificar que sea un PNG válido
            if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
                console.log(`✅ ${file} - PNG válido (${Math.round(stats.size/1024)} KB)`);
            } else {
                console.log(`⚠️ ${file} - No es un PNG válido`);
            }
        } else {
            console.log(`❌ ${file} - No encontrado`);
        }
    });
}

// Función para crear favicon.ico
async function createFaviconIco() {
    try {
        console.log('\n🎯 Creando favicon.ico...');
        
        // Crear favicon.ico a partir del PNG de 32x32
        await sharp('favicon-32x32.png')
            .resize(32, 32)
            .toFile('favicon.ico');
            
        console.log('✅ favicon.ico creado correctamente');
        
    } catch (error) {
        console.error('❌ Error creando favicon.ico:', error.message);
    }
}

// Función principal
async function main() {
    console.log('🚀 Generador de Iconos PNG Reales con Sharp para Llavero3D.com\n');
    
    await createAllRealIcons();
    await createFaviconIco();
    verifyPNGFiles();
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Probar los iconos en el navegador');
    console.log('2. Verificar que no haya errores en el manifest');
    console.log('3. Probar en dispositivos iOS y Android');
    console.log('4. Desplegar los cambios');
}

main().catch(console.error);
