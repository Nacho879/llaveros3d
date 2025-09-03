-- Esquema de base de datos para Llaveros 3D
-- Ejecutar en Vercel Postgres

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id VARCHAR(50) PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ciudad VARCHAR(100),
    direccion TEXT,
    cantidad INTEGER NOT NULL,
    tamaño VARCHAR(50),
    estilo VARCHAR(50),
    forma VARCHAR(50),
    color VARCHAR(50),
    notas_pedido TEXT,
    newsletter BOOLEAN DEFAULT false,
    imagen TEXT,
    precio DECIMAL(10,2),
    estado VARCHAR(50) DEFAULT 'Nuevo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    email VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ciudad VARCHAR(100),
    direccion TEXT,
    total_pedidos INTEGER DEFAULT 0,
    total_gastado DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
