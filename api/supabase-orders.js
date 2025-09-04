import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zbujpypbdpsmevslgtiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidWpweXBiZHBzbWV2c2xndGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODM0ODMsImV4cCI6MjA3MjU1OTQ4M30.x8IKNRTimIw7W3L9d8FqgFTEVVqJdGPzCEdG-XYB09I';

const supabase = createClient(supabaseUrl, supabaseKey);

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
        return await createOrder(req, res);
      case 'list':
        return await listOrders(req, res);
      case 'update':
        return await updateOrder(req, res);
      default:
        return res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('Error en API Supabase:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}

async function createOrder(req, res) {
  try {
    const { nombre, email, telefono, logo, forma, tamano, color, cantidad, notas } = req.body;
    
    console.log('📦 Creando pedido en Supabase:', {
      nombre,
      email,
      telefono,
      forma,
      tamano,
      color,
      cantidad,
      notas
    });
    
    const { data, error } = await supabase
      .from('pedidos')
      .insert([
        {
          nombre,
          email,
          telefono,
          logo,
          forma,
          tamano,
          color,
          cantidad,
          notas,
          estado: 'pendiente'
        }
      ])
      .select();
    
    if (error) {
      console.error('❌ Error creando pedido en Supabase:', error);
      throw error;
    }
    
    console.log('✅ Pedido creado en Supabase:', data);
    
    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente en Supabase',
      id: data[0].id,
      data: data[0]
    });
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ 
      error: 'Error creando pedido', 
      message: error.message,
      details: error.details || null
    });
  }
}

async function listOrders(req, res) {
  try {
    console.log('📋 Listando pedidos desde Supabase...');
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('fecha', { ascending: false });
    
    if (error) {
      console.error('❌ Error listando pedidos desde Supabase:', error);
      throw error;
    }
    
    console.log('✅ Pedidos obtenidos desde Supabase:', data?.length || 0);
    
    res.status(200).json({
      success: true,
      pedidos: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error listando pedidos:', error);
    res.status(500).json({ 
      error: 'Error listando pedidos', 
      message: error.message,
      details: error.details || null
    });
  }
}

async function updateOrder(req, res) {
  try {
    const { id, estado } = req.body;
    
    console.log(`🔄 Actualizando pedido ${id} a estado: ${estado}`);
    
    const { data, error } = await supabase
      .from('pedidos')
      .update({ 
        estado,
        fecha_actualizacion: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Error actualizando pedido en Supabase:', error);
      throw error;
    }
    
    console.log('✅ Pedido actualizado en Supabase:', data);
    
    res.status(200).json({
      success: true,
      message: 'Pedido actualizado exitosamente en Supabase',
      data: data[0]
    });
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ 
      error: 'Error actualizando pedido', 
      message: error.message,
      details: error.details || null
    });
  }
}
