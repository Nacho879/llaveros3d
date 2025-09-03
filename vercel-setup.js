#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Vercel Postgres automáticamente...\n');

// Variables de entorno de Postgres
const envVars = {
    'POSTGRES_URL': 'postgresql://neondb_owner:npg_JDn2G6orUidf@ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
    'POSTGRES_HOST': 'ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech',
    'POSTGRES_USER': 'neondb_owner',
    'POSTGRES_PASSWORD': 'npg_JDn2G6orUidf',
    'POSTGRES_DATABASE': 'neondb'
};

async function setupVercel() {
    try {
        // Verificar que Vercel CLI esté instalado
        console.log('🔍 Verificando Vercel CLI...');
        try {
            execSync('vercel --version', { stdio: 'pipe' });
            console.log('✅ Vercel CLI está instalado\n');
        } catch (error) {
            console.log('❌ Vercel CLI no está instalado');
            console.log('Instálalo con: npm i -g vercel\n');
            return;
        }

        // Verificar que estés logueado en Vercel
        console.log('🔍 Verificando login de Vercel...');
        try {
            execSync('vercel whoami', { stdio: 'pipe' });
            console.log('✅ Logueado en Vercel\n');
        } catch (error) {
            console.log('❌ No estás logueado en Vercel');
            console.log('Ejecuta: vercel login\n');
            return;
        }

        // Crear archivo .env.local para desarrollo local
        console.log('📝 Creando archivo .env.local...');
        const envContent = Object.entries(envVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        fs.writeFileSync('.env.local', envContent);
        console.log('✅ Archivo .env.local creado\n');

        // Configurar variables de entorno en Vercel
        console.log('🔧 Configurando variables de entorno en Vercel...');
        
        for (const [key, value] of Object.entries(envVars)) {
            console.log(`📝 Configurando ${key}...`);
            try {
                execSync(`vercel env add ${key} production`, { 
                    stdio: 'pipe',
                    input: value + '\n'
                });
                console.log(`✅ ${key} configurado`);
            } catch (error) {
                console.log(`⚠️  ${key} ya existe o hubo un error`);
            }
        }

        console.log('\n🎉 ¡Configuración completada!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Ve a https://vercel.com/dashboard');
        console.log('2. Selecciona tu proyecto llaveros3d');
        console.log('3. Ve a Settings → Environment Variables');
        console.log('4. Verifica que las 5 variables estén ahí');
        console.log('5. Haz Redeploy del proyecto');
        
        console.log('\n🔗 O ejecuta: vercel --prod');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
        console.log('\n📋 Configuración manual:');
        console.log('1. Ve a https://vercel.com/dashboard');
        console.log('2. Selecciona llaveros3d');
        console.log('3. Settings → Environment Variables');
        console.log('4. Añade las 5 variables de Postgres');
    }
}

// Ejecutar el script
setupVercel();
