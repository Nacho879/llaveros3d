// Configuración CORS para permitir acceso desde llavero3d.com
export default function cors(req, res) {
    // Permitir acceso desde llavero3d.com
    res.setHeader('Access-Control-Allow-Origin', 'https://www.llavero3d.com');
    res.setHeader('Access-Control-Allow-Origin', 'http://www.llavero3d.com');
    res.setHeader('Access-Control-Allow-Origin', 'https://llavero3d.com');
    res.setHeader('Access-Control-Allow-Origin', 'http://llavero3d.com');
    
    // Permitir métodos HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Permitir headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Permitir cookies
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Manejar preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
}
