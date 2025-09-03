export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('🔍 Verificando variables de entorno...');

    // Verificar variables de Postgres
    const postgresUrl = process.env.POSTGRES_URL;
    const postgresHost = process.env.POSTGRES_HOST;
    const postgresUser = process.env.POSTGRES_USER;
    const postgresPassword = process.env.POSTGRES_PASSWORD;
    const postgresDatabase = process.env.POSTGRES_DATABASE;

    const envStatus = {
        POSTGRES_URL: postgresUrl ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_HOST: postgresHost ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_USER: postgresUser ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_PASSWORD: postgresPassword ? '✅ Configurada' : '❌ No configurada',
        POSTGRES_DATABASE: postgresDatabase ? '✅ Configurada' : '❌ No configurada'
    };

    const hasAllVars = postgresUrl && postgresHost && postgresUser && postgresPassword && postgresDatabase;

    res.status(200).json({
        success: true,
        message: hasAllVars ? 'Todas las variables están configuradas' : 'Faltan variables de Postgres',
        variables: envStatus,
        hasAllVariables: hasAllVars,
        timestamp: new Date().toISOString()
    });
}
