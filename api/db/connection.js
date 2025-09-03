import { sql } from '@vercel/postgres';

// Función para verificar la conexión
export async function testConnection() {
    try {
        const result = await sql`SELECT NOW() as current_time`;
        console.log('✅ Conexión a Postgres exitosa:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a Postgres:', error);
        return false;
    }
}

// Función para ejecutar el esquema inicial
export async function initializeDatabase() {
    try {
        console.log('🔄 Inicializando base de datos...');
        
        // Crear tabla de pedidos
        await sql`
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
            )
        `;
        
        // Crear tabla de clientes
        await sql`
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
            )
        `;
        
        // Crear índices
        await sql`CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre)`;
        
        console.log('✅ Base de datos inicializada correctamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error);
        return false;
    }
}

export { sql };
