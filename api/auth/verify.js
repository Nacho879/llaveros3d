const { verifySession, getUserById } = require('./config');

export default async function handler(req, res) {
    // Solo permitir método GET
    if (req.method !== 'GET') {
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

        // Si no hay sessionId, usuario no autenticado
        if (!sessionId) {
            return res.status(401).json({ 
                authenticated: false,
                error: 'No hay sesión activa' 
            });
        }

        // Verificar sesión
        const session = verifySession(sessionId);
        
        if (!session) {
            return res.status(401).json({ 
                authenticated: false,
                error: 'Sesión expirada o inválida' 
            });
        }

        // Obtener información del usuario
        const user = getUserById(session.userId);
        
        if (!session) {
            return res.status(401).json({ 
                authenticated: false,
                error: 'Usuario no encontrado' 
            });
        }

        // Respuesta exitosa con información del usuario
        return res.status(200).json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            session: {
                expiresAt: session.expiresAt,
                createdAt: session.createdAt
            }
        });

    } catch (error) {
        console.error('Error al verificar sesión:', error);
        return res.status(500).json({ 
            authenticated: false,
            error: 'Error interno del servidor' 
        });
    }
}
