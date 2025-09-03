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
        console.log('🔄 Obteniendo lista de clientes...');

        // Obtener todos los clientes ordenados por total de pedidos (más activos primero)
        const result = await sql`
            SELECT 
                email, nombre, telefono, ciudad, direccion,
                total_pedidos, total_gastado, created_at, updated_at
            FROM clientes 
            ORDER BY total_pedidos DESC, total_gastado DESC
        `;

        const clientes = result.rows.map(cliente => ({
            email: cliente.email,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            ciudad: cliente.ciudad,
            direccion: cliente.direccion,
            totalPedidos: parseInt(cliente.total_pedidos || 0),
            totalGastado: parseFloat(cliente.total_gastado || 0),
            created_at: cliente.created_at,
            updated_at: cliente.updated_at
        }));

        console.log(`✅ ${clientes.length} clientes obtenidos exitosamente`);

        res.status(200).json({
            success: true,
            count: clientes.length,
            clientes: clientes
        });

    } catch (error) {
        console.error('❌ Error obteniendo clientes:', error);
        
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}
