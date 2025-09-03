import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        console.log('🔄 Obteniendo lista de pedidos (API simple)...');

        // Obtener todos los pedidos ordenados por fecha (más recientes primero)
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

        console.log(`✅ ${pedidos.length} pedidos obtenidos exitosamente (API simple)`);

        res.status(200).json({
            success: true,
            count: pedidos.length,
            pedidos: pedidos
        });

    } catch (error) {
        console.error('❌ Error obteniendo pedidos (API simple):', error);
        
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}
