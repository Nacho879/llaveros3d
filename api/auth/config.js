// Configuración para Vercel Postgres (opcional) y autenticación local
const USERS = [
    {
        id: 1,
        email: 'Admin@llaveros3d.com',
        password: 'Nacho1992!', // En producción, esto debería estar hasheado
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

// Simular base de datos en memoria (en producción usar Vercel Postgres)
let sessions = new Map();
let pedidos = [];
let clientes = [];

// Función para verificar credenciales
function verifyCredentials(email, password) {
    const user = USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    return user;
}

// Función para crear sesión
function createSession(userId) {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    
    sessions.set(sessionId, {
        userId,
        expiresAt,
        createdAt: new Date()
    });
    
    return sessionId;
}

// Función para verificar sesión
function verifySession(sessionId) {
    const session = sessions.get(sessionId);
    
    if (!session) {
        return null;
    }
    
    if (new Date() > session.expiresAt) {
        sessions.delete(sessionId);
        return null;
    }
    
    return session;
}

// Función para eliminar sesión
function removeSession(sessionId) {
    sessions.delete(sessionId);
}

// Función para generar ID de sesión
function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Función para obtener usuario por ID
function getUserById(userId) {
    return USERS.find(u => u.id === userId);
}

// Función para limpiar sesiones expiradas
function cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of sessions.entries()) {
        if (now > session.expiresAt) {
            sessions.delete(sessionId);
        }
    }
}

// Limpiar sesiones expiradas cada hora
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
    USERS,
    verifyCredentials,
    createSession,
    verifySession,
    removeSession,
    getUserById,
    sessions,
    pedidos,
    clientes
};
