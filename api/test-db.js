import { testConnection, initializeDatabase } from '../db/connection.js';

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
        console.log('🧪 Iniciando pruebas de base de datos...');

        // Probar conexión
        const connectionOk = await testConnection();
        
        if (!connectionOk) {
            return res.status(500).json({
                success: false,
                error: 'No se pudo conectar a la base de datos',
                tests: {
                    connection: false,
                    initialization: false
                }
            });
        }

        // Inicializar base de datos si es POST
        let initializationOk = true;
        if (req.method === 'POST') {
            initializationOk = await initializeDatabase();
        }

        const testResults = {
            connection: connectionOk,
            initialization: initializationOk,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        };

        console.log('✅ Pruebas completadas:', testResults);

        res.status(200).json({
            success: true,
            message: 'Pruebas de base de datos completadas',
            tests: testResults
        });

    } catch (error) {
        console.error('❌ Error en pruebas de base de datos:', error);
        
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message,
            tests: {
                connection: false,
                initialization: false
            }
        });
    }
}
