export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }
    
    res.status(200).json({ 
        success: true, 
        message: 'PONG! API funcionando',
        time: new Date().toISOString()
    });
}
