import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('🔄 Inicializando base de datos...');

        // Crear tabla pedidos si no existe
        await sql`
            CREATE TABLE IF NOT EXISTS pedidos (
                id VARCHAR(255) PRIMARY KEY,
                fecha TIMESTAMP NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telefono VARCHAR(50),
                ciudad VARCHAR(100),
                direccion TEXT,
                cantidad INTEGER NOT NULL,
                tamaño VARCHAR(50),
                estilo VARCHAR(100),
                forma VARCHAR(100),
                color VARCHAR(50),
                notas_pedido TEXT,
                newsletter BOOLEAN DEFAULT false,
                imagen TEXT,
                precio DECIMAL(10,2),
                estado VARCHAR(50) DEFAULT 'Nuevo',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // Crear tabla clientes si no existe
        await sql`
            CREATE TABLE IF NOT EXISTS clientes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                telefono VARCHAR(50),
                ciudad VARCHAR(100),
                direccion TEXT,
                total_pedidos INTEGER DEFAULT 0,
                total_gastado DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // Crear índices
        await sql`CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email)`;

        console.log('✅ Base de datos inicializada correctamente');

        res.status(200).json({
            success: true,
            message: 'Base de datos inicializada correctamente',
            timestamp: new Date().toISOString(),
            tables: ['pedidos', 'clientes'],
            indexes: ['idx_pedidos_email', 'idx_pedidos_estado', 'idx_clientes_email']
        });

    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        
        res.status(500).json({
            error: 'Error inicializando base de datos',
            message: error.message,
            details: error.stack
        });
    }
}
