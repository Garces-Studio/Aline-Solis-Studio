-- 💎 Script de Inicialización de Base de Datos para Aline Solis Studio v2026 - Versión Extendida (Lealtad VIP)

-- 1. Tabla de Perfiles de Usuario (Supabase Auth)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nombre_completo TEXT,
  whatsapp TEXT,
  puntos_lealtad INTEGER DEFAULT 0,
  visitas_totales INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Servicios (Catálogo Maestro)
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  duracion_minutos INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Citas (Reservas VIP)
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID REFERENCES perfiles(id), -- Opcional si es usuario registrado
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT,
  cliente_whatsapp TEXT,
  servicio_id UUID REFERENCES servicios(id),
  fecha_hora TIMESTAMPTZ NOT NULL,
  estado_pago TEXT DEFAULT 'pendiente', -- pendiente, pagado, cancelado
  ticket_id TEXT UNIQUE DEFAULT ('AL-' || upper(substring(gen_random_uuid()::text from 1 for 6))),
  transaction_id TEXT, -- ID de Stripe/Mercado Pago
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Inventario Press-On
CREATE TABLE IF NOT EXISTS presson_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estilo_nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 10,
  img_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de Beneficios y Canjes (Sistema de Puntos)
CREATE TABLE IF NOT EXISTS beneficios_lealtad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_beneficio TEXT NOT NULL,
  puntos_requeridos INTEGER NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Datos Iniciales
INSERT INTO servicios (nombre, precio, duracion_minutos) VALUES
('Manicura Premium', 399.00, 60),
('Extensión Gel-X', 679.00, 90),
('Lashes (Pestañas)', 850.00, 120),
('Pedicura Spa', 450.00, 45);

INSERT INTO beneficios_lealtad (nombre_beneficio, puntos_requeridos, descripcion) VALUES
('Set de Uñas Gratis', 5, 'Cada 5 visitas, tu siguiente set es por nuestra cuenta.'),
('10% Descuento Press-On', 3, 'Obtén descuento en tu tercer compra de sets para casa.');

-- Habilitar RLS (Row Level Security) básico
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver su propio perfil" ON perfiles FOR SELECT USING (auth.uid() = id);
