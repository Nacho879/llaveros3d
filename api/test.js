export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo permitir GET para este test
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    console.log('🧪 API de test simple funcionando...');

    res.status(200).json({
        success: true,
        message: 'API de test funcionando correctamente',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
    });
}
