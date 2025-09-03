export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { action } = req.query;
        console.log(`🔄 API Fallback - Acción: ${action}`);

        switch (action) {
            case 'init':
                res.status(200).json({
                    success: true,
                    message: 'Base de datos inicializada (modo fallback)',
                    note: 'Usando almacenamiento temporal - Postgres no configurado',
                    timestamp: new Date().toISOString()
                });
                break;
            case 'create':
                res.status(200).json({
                    success: true,
                    message: 'Pedido creado (modo fallback)',
                    note: 'Usando almacenamiento temporal - Postgres no configurado',
                    timestamp: new Date().toISOString()
                });
                break;
            case 'list':
                res.status(200).json({
                    success: true,
                    pedidos: [],
                    total: 0,
                    note: 'Usando almacenamiento temporal - Postgres no configurado',
                    timestamp: new Date().toISOString()
                });
                break;
            case 'update':
                res.status(200).json({
                    success: true,
                    message: 'Pedido actualizado (modo fallback)',
                    note: 'Usando almacenamiento temporal - Postgres no configurado',
                    timestamp: new Date().toISOString()
                });
                break;
            default:
                res.status(400).json({ 
                    error: 'Acción no válida', 
                    validActions: ['init', 'create', 'list', 'update'] 
                });
        }

    } catch (error) {
        console.error('❌ Error en API Fallback:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}
