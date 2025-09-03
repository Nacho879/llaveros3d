import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🧪 Test ultra-simple de Postgres...');
        
        // Solo probar que la importación funcione
        const result = await sql`SELECT 1 as test`;
        
        console.log('✅ Importación de @vercel/postgres exitosa');
        
        res.status(200).json({
            success: true,
            message: 'Importación de @vercel/postgres exitosa',
            test: result.rows[0].test,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error en test ultra-simple:', error);
        
        res.status(500).json({
            error: 'Error en test ultra-simple',
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        });
    }
}
