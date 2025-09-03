import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo permitir PUT y PATCH
    if (req.method !== 'PUT' && req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { id, estado, ...otherFields } = req.body;

        // Validar campos requeridos
        if (!id) {
            return res.status(400).json({
                error: 'ID del pedido es requerido'
            });
        }

        console.log(`🔄 Actualizando pedido ${id} con estado: ${estado}`);

        // Construir query dinámico para actualizar campos
        let updateQuery = 'UPDATE pedidos SET ';
        const updateValues = [];
        const updateFields = [];

        if (estado) {
            updateFields.push('estado = $' + (updateValues.length + 1));
            updateValues.push(estado);
        }

        // Añadir otros campos si se proporcionan
        Object.entries(otherFields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const dbKey = key === 'notasPedido' ? 'notas_pedido' : key;
                updateFields.push(`${dbKey} = $${updateValues.length + 1}`);
                updateValues.push(value);
            }
        });

        // Añadir updated_at
        updateFields.push('updated_at = NOW()');

        updateQuery += updateFields.join(', ') + ' WHERE id = $' + (updateValues.length + 1);
        updateValues.push(id);

        // Ejecutar actualización
        const result = await sql.query(updateQuery, updateValues);

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: 'Pedido no encontrado',
                id: id
            });
        }

        console.log(`✅ Pedido ${id} actualizado exitosamente`);

        // Obtener pedido actualizado
        const updatedPedido = await sql`
            SELECT id, nombre, email, cantidad, precio, estado, updated_at
            FROM pedidos 
            WHERE id = ${id}
        `;

        res.status(200).json({
            success: true,
            message: 'Pedido actualizado exitosamente',
            pedido: updatedPedido.rows[0]
        });

    } catch (error) {
        console.error('❌ Error actualizando pedido:', error);
        
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}
