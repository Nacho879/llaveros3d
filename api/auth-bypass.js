export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Verificar token de bypass (solo para testing)
    const authHeader = req.headers.authorization;
    const bypassToken = 'test-bypass-12345'; // Token simple para testing
    
    if (!authHeader || authHeader !== `Bearer ${bypassToken}`) {
        return res.status(401).json({
            error: 'Token de bypass requerido',
            message: 'Para testing, incluye: Authorization: Bearer test-bypass-12345'
        });
    }

    console.log('🔓 Bypass de autenticación exitoso');

    res.status(200).json({
        success: true,
        message: 'Bypass de autenticación exitoso',
        timestamp: new Date().toISOString(),
        note: 'Este endpoint es solo para testing'
    });
}
