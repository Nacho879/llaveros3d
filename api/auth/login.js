import cors from './cors.js';

export default async function handler(req, res) {
    // Aplicar CORS
    cors(req, res);
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { email, password } = req.body;
        
        // Verificar credenciales
        if (email === 'admin@llaveros3d.com' && password === 'Nacho1992!') {
            // Crear sesión simple
            const sessionId = 'session_' + Date.now();
            
            // Establecer cookie de sesión
            res.setHeader('Set-Cookie', `llaveros3d_session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
            
            return res.status(200).json({
                success: true,
                message: 'Login exitoso',
                user: { email, name: 'Administrador' }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}
