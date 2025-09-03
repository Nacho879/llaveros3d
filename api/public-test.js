export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('🌐 API pública funcionando...');

    res.status(200).json({
        success: true,
        message: '¡API pública funcionando sin autenticación!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        note: 'Esta API debería ser accesible públicamente'
    });
}
