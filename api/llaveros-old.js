import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { action } = req.query;
        console.log(`🚀 API Llaveros - Acción: ${action}`);

        switch (action) {
            case 'init':
                await initDatabase(req, res);
                break;
            case 'create':
                await createPedido(req, res);
                break;
            case 'list':
                await listPedidos(req, res);
                break;
            case 'update':
                await updatePedido(req, res);
                break;
            default:
                res.status(400).json({ 
                    error: 'Acción no válida', 
                    validActions: ['init', 'create', 'list', 'update'] 
                });
        }

    } catch (error) {
        console.error('❌ Error en API Llaveros:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}

// Inicializar base de datos
async function initDatabase(req, res) {
    try {
        console.log('🗄️ Inicializando base de datos...');
        
        // Crear tabla pedidos
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
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;

        // Crear tabla clientes
        await sql`
            CREATE TABLE IF NOT EXISTS clientes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                telefono VARCHAR(50),
                ciudad VARCHAR(100),
                direccion TEXT,
                total_pedidos INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;

        console.log('✅ Base de datos inicializada');
        
        res.status(200).json({
            success: true,
            message: 'Base de datos inicializada correctamente',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        throw error;
    }
}

// Crear pedido
async function createPedido(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const {
            id, fecha, nombre, email, telefono, ciudad, direccion,
            cantidad, tamaño, estilo, forma, color, notasPedido,
            newsletter, imagen, precio
        } = req.body;

        console.log('🔄 Creando pedido:', { id, nombre, email, cantidad });

        // Insertar pedido
        await sql`
            INSERT INTO pedidos (
                id, fecha, nombre, email, telefono, ciudad, direccion,
                cantidad, tamaño, estilo, forma, color, notas_pedido,
                newsletter, imagen, precio
            ) VALUES (
                ${id}, ${fecha}, ${nombre}, ${email}, ${telefono}, ${ciudad}, ${direccion},
                ${cantidad}, ${tamaño}, ${estilo}, ${forma}, ${color}, ${notasPedido},
                ${newsletter}, ${imagen}, ${precio}
            )
        `;

        // Insertar/actualizar cliente
        await sql`
            INSERT INTO clientes (email, nombre, telefono, ciudad, direccion, total_pedidos)
            VALUES (${email}, ${nombre}, ${telefono}, ${ciudad}, ${direccion}, 1)
            ON CONFLICT (email) 
            DO UPDATE SET 
                nombre = EXCLUDED.nombre,
                telefono = EXCLUDED.telefono,
                ciudad = EXCLUDED.ciudad,
                direccion = EXCLUDED.direccion,
                total_pedidos = clientes.total_pedidos + 1
        `;

        console.log('✅ Pedido creado correctamente');
        
        res.status(200).json({
            success: true,
            message: 'Pedido creado correctamente',
            pedidoId: id
        });

    } catch (error) {
        throw error;
    }
}

// Listar pedidos
async function listPedidos(req, res) {
    try {
        console.log('📋 Listando pedidos...');
        
        const result = await sql`SELECT * FROM pedidos ORDER BY created_at DESC`;
        
        res.status(200).json({
            success: true,
            pedidos: result.rows,
            total: result.rows.length
        });

    } catch (error) {
        throw error;
    }
}

// Actualizar pedido
async function updatePedido(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { id, estado } = req.body;
        
        console.log('🔄 Actualizando pedido:', { id, estado });
        
        await sql`
            UPDATE pedidos 
            SET estado = ${estado}
            WHERE id = ${id}
        `;
        
        res.status(200).json({
            success: true,
            message: 'Pedido actualizado correctamente'
        });

    } catch (error) {
        throw error;
    }
}
