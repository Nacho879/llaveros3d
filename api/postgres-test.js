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
        const { action } = req.query;

        console.log(`🧪 API consolidada de Postgres - Acción: ${action}`);

        switch (action) {
            case 'test':
                await handleTestConnection(req, res);
                break;
            case 'create':
                await handleCreatePedido(req, res);
                break;
            case 'list':
                await handleListPedidos(req, res);
                break;
            default:
                res.status(400).json({ error: 'Acción no válida', validActions: ['test', 'create', 'list'] });
        }

    } catch (error) {
        console.error('❌ Error en API consolidada:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}

// Función para probar conexión
async function handleTestConnection(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        console.log('🔄 Probando conexión a Postgres...');
        
        const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
        
        if (result.rows && result.rows.length > 0) {
            console.log('✅ Conexión exitosa a Postgres');
            
            res.status(200).json({
                success: true,
                message: 'Conexión a Postgres exitosa',
                timestamp: result.rows[0].current_time,
                postgres_version: result.rows[0].postgres_version,
                connection_status: 'OK'
            });
        } else {
            throw new Error('No se pudo obtener datos de Postgres');
        }
    } catch (error) {
        throw error;
    }
}

// Función para crear pedido
async function handleCreatePedido(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const {
            id, fecha, nombre, email, telefono, ciudad, direccion,
            cantidad, tamaño, estilo, forma, color, notasPedido,
            newsletter, imagen, precio, estado = 'Nuevo'
        } = req.body;

        // Validar campos requeridos
        if (!id || !fecha || !nombre || !email || !cantidad) {
            return res.status(400).json({
                error: 'Campos requeridos faltantes',
                required: ['id', 'fecha', 'nombre', 'email', 'cantidad']
            });
        }

        console.log('🔄 Creando pedido:', { id, nombre, email, cantidad });

        // Insertar pedido
        const result = await sql`
            INSERT INTO pedidos (
                id, fecha, nombre, email, telefono, ciudad, direccion,
                cantidad, tamaño, estilo, forma, color, notas_pedido,
                newsletter, imagen, precio, estado
            ) VALUES (
                ${id}, ${fecha}, ${nombre}, ${email}, ${telefono}, ${ciudad}, ${direccion},
                ${cantidad}, ${tamaño}, ${estilo}, ${forma}, ${color}, ${notasPedido},
                ${newsletter || false}, ${imagen}, ${precio}, ${estado}
            )
            RETURNING id, nombre, email, cantidad, precio, estado
        `;

        if (result.rows.length === 0) {
            throw new Error('No se pudo insertar el pedido');
        }

        const pedidoCreado = result.rows[0];

        // Actualizar o crear cliente
        await sql`
            INSERT INTO clientes (email, nombre, telefono, ciudad, direccion, total_pedidos, total_gastado)
            VALUES (${email}, ${nombre}, ${telefono}, ${ciudad}, ${direccion}, 1, ${precio || 0})
            ON CONFLICT (email) 
            DO UPDATE SET 
                total_pedidos = clientes.total_pedidos + 1,
                total_gastado = clientes.total_gastado + ${precio || 0},
                updated_at = NOW()
        `;

        console.log('✅ Pedido creado exitosamente:', pedidoCreado.id);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            pedido: pedidoCreado
        });

    } catch (error) {
        throw error;
    }
}

// Función para listar pedidos
async function handleListPedidos(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        console.log('🔄 Obteniendo lista de pedidos...');

        // Obtener todos los pedidos ordenados por fecha
        const result = await sql`
            SELECT 
                id, fecha, nombre, email, telefono, ciudad, direccion,
                cantidad, tamaño, estilo, forma, color, notas_pedido,
                newsletter, imagen, precio, estado, created_at, updated_at
            FROM pedidos 
            ORDER BY fecha DESC
        `;

        const pedidos = result.rows.map(pedido => ({
            id: pedido.id,
            fecha: pedido.fecha,
            nombre: pedido.nombre,
            email: pedido.email,
            telefono: pedido.telefono,
            ciudad: pedido.ciudad,
            direccion: pedido.direccion,
            cantidad: pedido.cantidad,
            tamaño: pedido.tamaño,
            estilo: pedido.estilo,
            forma: pedido.forma,
            color: pedido.color,
            notasPedido: pedido.notas_pedido,
            newsletter: pedido.newsletter,
            imagen: pedido.imagen,
            precio: parseFloat(pedido.precio || 0),
            estado: pedido.estado,
            created_at: pedido.created_at,
            updated_at: pedido.updated_at
        }));

        console.log(`✅ ${pedidos.length} pedidos obtenidos exitosamente`);

        res.status(200).json({
            success: true,
            count: pedidos.length,
            pedidos: pedidos
        });

    } catch (error) {
        throw error;
    }
}
