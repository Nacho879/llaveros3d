const { removeSession } = require('./config');

export default async function handler(req, res) {
    // Solo permitir método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        // Obtener sessionId de las cookies
        const cookies = req.headers.cookie;
        let sessionId = null;

        if (cookies) {
            const sessionCookie = cookies
                .split(';')
                .find(cookie => cookie.trim().startsWith('sessionId='));
            
            if (sessionCookie) {
                sessionId = sessionCookie.split('=')[1];
            }
        }

        // Si hay sesión activa, eliminarla
        if (sessionId) {
            removeSession(sessionId);
        }

        // Eliminar cookie de sesión
        res.setHeader('Set-Cookie', 'sessionId=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict');

        // Respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
}
