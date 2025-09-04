export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action } = req.query;

    switch (action) {
      case 'create':
        return await createOrderFallback(req, res);
      case 'list':
        return await listOrdersFallback(req, res);
      case 'update':
        return await updateOrderFallback(req, res);
      default:
        return res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('Error en API fallback:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}

async function createOrderFallback(req, res) {
  try {
    const { nombre, email, telefono, logo, forma, tamano, color, cantidad, notas } = req.body;
    
    // Simular creación de pedido
    const pedidoId = Math.floor(Math.random() * 1000000);
    
    console.log('📦 Pedido simulado creado:', {
      id: pedidoId,
      nombre,
      email,
      telefono,
      forma,
      tamano,
      color,
      cantidad,
      notas
    });
    
    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente (modo simulación)',
      id: pedidoId,
      note: 'Este es un pedido simulado. La base de datos no está disponible.'
    });
  } catch (error) {
    console.error('Error creando pedido simulado:', error);
    res.status(500).json({ error: 'Error creando pedido', message: error.message });
  }
}

async function listOrdersFallback(req, res) {
  try {
    // Simular lista de pedidos
    const pedidosSimulados = [
      {
        id: 1,
        nombre: 'Cliente de Prueba',
        email: 'test@example.com',
        telefono: '+34600000000',
        forma: 'round',
        tamano: '30mm',
        color: '#000000',
        cantidad: 30,
        notas: 'Pedido de prueba',
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      }
    ];
    
    res.status(200).json({
      success: true,
      pedidos: pedidosSimulados,
      note: 'Estos son pedidos simulados. La base de datos no está disponible.'
    });
  } catch (error) {
    console.error('Error listando pedidos simulados:', error);
    res.status(500).json({ error: 'Error listando pedidos', message: error.message });
  }
}

async function updateOrderFallback(req, res) {
  try {
    const { id, estado } = req.body;
    
    console.log(`🔄 Pedido simulado ${id} actualizado a estado: ${estado}`);
    
    res.status(200).json({
      success: true,
      message: 'Pedido actualizado exitosamente (modo simulación)',
      note: 'Este es un pedido simulado. La base de datos no está disponible.'
    });
  } catch (error) {
    console.error('Error actualizando pedido simulado:', error);
    res.status(500).json({ error: 'Error actualizando pedido', message: error.message });
  }
}
