import cors from './cors.js';

export default async function handler(req, res) {
    // Aplicar CORS
    cors(req, res);
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Verificar cookie de sesión
        const sessionCookie = req.headers.cookie?.split(';').find(c => c.trim().startsWith('llaveros3d_session='));
        
        if (sessionCookie) {
            return res.status(200).json({
                authenticated: true,
                user: { email: 'admin@llaveros3d.com', name: 'Administrador' }
            });
        } else {
            return res.status(401).json({
                authenticated: false,
                message: 'No hay sesión activa'
            });
        }
    } catch (error) {
        console.error('Error en verificación:', error);
        return res.status(500).json({
            authenticated: false,
            message: 'Error interno del servidor'
        });
    }
}
