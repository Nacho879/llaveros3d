import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const {
            id,
            fecha,
            nombre,
            email,
            telefono,
            ciudad,
            direccion,
            cantidad,
            tamaño,
            estilo,
            forma,
            color,
            notasPedido,
            newsletter,
            imagen,
            precio,
            estado = 'Nuevo'
        } = req.body;

        // Validar campos requeridos
        if (!id || !fecha || !nombre || !email || !cantidad) {
            return res.status(400).json({
                error: 'Campos requeridos faltantes',
                required: ['id', 'fecha', 'nombre', 'email', 'cantidad']
            });
        }

        console.log('🔄 Creando pedido simple:', { id, nombre, email, cantidad });

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
        console.error('❌ Error creando pedido:', error);
        
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}
