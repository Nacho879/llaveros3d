const { verifyCredentials, createSession } = require('./config');

export default async function handler(req, res) {
    // Solo permitir método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { email, password, remember } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email y contraseña son requeridos' 
            });
        }

        // Verificar credenciales
        const user = verifyCredentials(email, password);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas' 
            });
        }

        // Crear sesión
        const sessionId = createSession(user.id);
        
        // Configurar cookie de sesión
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 7 días o 1 día
        };

        // Establecer cookie de sesión
        res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; Max-Age=${cookieOptions.maxAge}; HttpOnly; SameSite=Strict${cookieOptions.secure ? '; Secure' : ''}`);

        // Respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
}
