import cors from './cors.js';

export default async function handler(req, res) {
    // Aplicar CORS
    cors(req, res);
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Limpiar cookie de sesión
        res.setHeader('Set-Cookie', 'llaveros3d_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
        
        return res.status(200).json({
            success: true,
            message: 'Logout exitoso'
        });
    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}
