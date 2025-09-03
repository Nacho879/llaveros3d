import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🧪 Probando conexión simple a Postgres...');
        
        // Solo probar conexión básica
        const result = await sql`SELECT 1 as test, NOW() as timestamp`;
        
        console.log('✅ Conexión exitosa a Postgres');
        
        res.status(200).json({
            success: true,
            message: 'Conexión a Postgres exitosa',
            test: result.rows[0].test,
            timestamp: result.rows[0].timestamp,
            connection_status: 'OK'
        });

    } catch (error) {
        console.error('❌ Error conectando a Postgres:', error);
        
        res.status(500).json({
            error: 'Error conectando a Postgres',
            message: error.message,
            details: error.stack,
            suggestion: 'Verifica que Neon esté activo y las credenciales sean correctas'
        });
    }
}
