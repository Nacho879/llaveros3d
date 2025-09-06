import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Crear tabla pedidos
    await sql`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        logo TEXT,
        forma VARCHAR(100),
        tamano VARCHAR(100),
        color VARCHAR(100),
        cantidad INTEGER,
        notas TEXT,
        fecha TIMESTAMP DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'pendiente'
      )
    `;
    
    console.log('✅ Tabla pedidos creada/verificada');
    
    res.status(200).json({
      success: true,
      message: 'Base de datos inicializada correctamente',
      timestamp: new Date().toISOString()
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
npm 
