import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://zbujpypbdpsmevslgtiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidWpweXBiZHBzbWV2c2xndGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODM0ODMsImV4cCI6MjA3MjU1OTQ4M30.x8IKNRTimIw7W3L9d8FqgFTEVVqJdGPzCEdG-XYB09I';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Verificando conexión a Supabase...');
    
    // Probar conexión haciendo una consulta simple
    const { data, error } = await supabase
      .from('pedidos')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error conectando a Supabase:', error);
      
      // Si la tabla no existe, dar instrucciones
      if (error.message.includes('relation "pedidos" does not exist')) {
        return res.status(400).json({
          error: 'Tabla pedidos no existe',
          message: 'La tabla pedidos no existe en Supabase. Por favor créala manualmente desde el dashboard.',
          instructions: {
            step1: 'Ve a https://supabase.com/dashboard',
            step2: 'Selecciona tu proyecto',
            step3: 'Ve a "Table Editor"',
            step4: 'Haz clic en "New Table"',
            step5: 'Crea la tabla "pedidos" con las columnas necesarias'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      throw error;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    
    res.status(200).json({
      success: true,
      message: 'Conexión a Supabase verificada correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error verificando conexión a Supabase:', error);
    res.status(500).json({
      error: 'Error verificando conexión',
      message: error.message,
      details: error.details || null
    });
  }
}
