export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    console.log('🗄️ API Init Simple funcionando...');

    // Simular inicialización exitosa
    res.status(200).json({
        success: true,
        message: 'Base de datos inicializada correctamente (simulado)',
        timestamp: new Date().toISOString(),
        note: 'Esta es una simulación - Postgres no está configurado aún'
    });
}
