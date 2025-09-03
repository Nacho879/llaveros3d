export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('🔍 Debug de variables de entorno...');

    // Obtener todas las variables de entorno
    const envVars = {
        // Variables principales de Postgres
        POSTGRES_URL: process.env.POSTGRES_URL ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_HOST: process.env.POSTGRES_HOST ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_USER: process.env.POSTGRES_USER ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? '✅ Configurada' : '❌ No configurada',
        
        // Variables alternativas
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada',
        PGHOST: process.env.PGHOST ? '✅ Configurada' : '❌ No configurada',
        PGUSER: process.env.PGUSER ? '✅ Configurada' : '❌ No configurada',
        PGPASSWORD: process.env.PGPASSWORD ? '✅ Configurada' : '❌ No configurada',
        PGDATABASE: process.env.PGDATABASE ? '✅ Configurada' : '❌ No configurada',
        
        // Otras variables
        NODE_ENV: process.env.NODE_ENV || 'No configurada',
        VERCEL_ENV: process.env.VERCEL_ENV || 'No configurada'
    };

    // Verificar si las variables principales están disponibles
    const hasMainVars = process.env.POSTGRES_URL && process.env.POSTGRES_HOST && 
                        process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && 
                        process.env.POSTGRES_DATABASE;

    // Verificar si las variables alternativas están disponibles
    const hasAltVars = process.env.DATABASE_URL || (process.env.PGHOST && process.env.PGUSER && 
                      process.env.PGPASSWORD && process.env.PGDATABASE);

    res.status(200).json({
        success: true,
        message: hasMainVars ? 'Variables principales configuradas' : 
                 hasAltVars ? 'Variables alternativas configuradas' : 'No hay variables de Postgres',
        variables: envVars,
        hasMainVariables: hasMainVars,
        hasAlternativeVariables: hasAltVars,
        timestamp: new Date().toISOString(),
        note: 'Esta API muestra qué variables están disponibles en runtime'
    });
}
