export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🧪 API de prueba simple funcionando');
        
        res.status(200).json({
            success: true,
            message: 'API de prueba funcionando correctamente',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
        
    } catch (error) {
        console.error('❌ Error en API de prueba:', error);
        res.status(500).json({
            error: 'Error en API de prueba',
            message: error.message
        });
    }
}
