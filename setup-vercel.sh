#!/bin/bash

echo "🚀 Configurando Vercel Postgres automáticamente..."
echo ""

# Variables de entorno de Postgres
POSTGRES_URL="postgresql://neondb_owner:npg_JDn2G6orUidf@ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
POSTGRES_HOST="ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech"
POSTGRES_USER="neondb_owner"
POSTGRES_PASSWORD="npg_JDn2G6orUidf"
POSTGRES_DATABASE="neondb"

echo "🔍 Verificando Vercel CLI..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI está instalado"
else
    echo "❌ Vercel CLI no está instalado"
    echo "Instálalo con: npm i -g vercel"
    exit 1
fi

echo ""
echo "🔍 Verificando login de Vercel..."
if vercel whoami &> /dev/null; then
    echo "✅ Logueado en Vercel"
else
    echo "❌ No estás logueado en Vercel"
    echo "Ejecuta: vercel login"
    exit 1
fi

echo ""
echo "📝 Creando archivo .env.local..."
cat > .env.local << EOF
POSTGRES_URL=$POSTGRES_URL
POSTGRES_HOST=$POSTGRES_HOST
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DATABASE=$POSTGRES_DATABASE
EOF
echo "✅ Archivo .env.local creado"

echo ""
echo "🔧 Configurando variables de entorno en Vercel..."

echo "📝 Configurando POSTGRES_URL..."
echo "$POSTGRES_URL" | vercel env add POSTGRES_URL production

echo "📝 Configurando POSTGRES_HOST..."
echo "$POSTGRES_HOST" | vercel env add POSTGRES_HOST production

echo "📝 Configurando POSTGRES_USER..."
echo "$POSTGRES_USER" | vercel env add POSTGRES_USER production

echo "📝 Configurando POSTGRES_PASSWORD..."
echo "$POSTGRES_PASSWORD" | vercel env add POSTGRES_PASSWORD production

echo "📝 Configurando POSTGRES_DATABASE..."
echo "$POSTGRES_DATABASE" | vercel env add POSTGRES_DATABASE production

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a https://vercel.com/dashboard"
echo "2. Selecciona tu proyecto llaveros3d"
echo "3. Ve a Settings → Environment Variables"
echo "4. Verifica que las 5 variables estén ahí"
echo "5. Haz Redeploy del proyecto"
echo ""
echo "🔗 O ejecuta: vercel --prod"
