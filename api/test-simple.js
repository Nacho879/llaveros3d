import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🧪 API de test simple iniciada...');

        // Solo permitir GET para este test
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Método no permitido' });
        }

        // Probar conexión simple a Postgres
        console.log('🔄 Probando conexión a Postgres...');
        
        const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
        
        if (result.rows && result.rows.length > 0) {
            console.log('✅ Conexión exitosa a Postgres');
            
            res.status(200).json({
                success: true,
                message: 'Conexión a Postgres exitosa',
                timestamp: result.rows[0].current_time,
                postgres_version: result.rows[0].postgres_version,
                connection_status: 'OK'
            });
        } else {
            throw new Error('No se pudo obtener datos de Postgres');
        }

    } catch (error) {
        console.error('❌ Error en API de test simple:', error);
        
        res.status(500).json({
            success: false,
            error: 'Error de conexión a Postgres',
            message: error.message,
            connection_status: 'FAILED'
        });
    }
}
