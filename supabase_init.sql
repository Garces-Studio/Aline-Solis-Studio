-- 💎 Script de Inicialización de Base de Datos para Aline Solis Studio v2026 (Actualizado)

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

-- 2. Tabla de Servicios (Sincronizado con la página web)
CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  duracion_texto TEXT,
  categoria TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Productos de la Tienda
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  descripcion TEXT,
  emoji TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de Citas (Reservas VIP)
CREATE TABLE IF NOT EXISTS citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID REFERENCES perfiles(id),
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT,
  cliente_whatsapp TEXT,
  servicio_nombre TEXT NOT NULL,
  fecha_hora TIMESTAMPTZ,
  estado_pago TEXT DEFAULT 'pendiente',
  ticket_id TEXT UNIQUE DEFAULT ('AL-' || upper(substring(gen_random_uuid()::text from 1 for 6))),
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Insertar Servicios Actualizados
TRUNCATE TABLE servicios CASCADE;
INSERT INTO servicios (nombre, precio, duracion_texto, categoria, popular) VALUES
('Manicura Clásica', 150.00, '45 min', 'Manos', false),
('Manicura en Gel', 250.00, '60 min', 'Manos', true),
('Nail Art Premium', 350.00, '90 min', 'Manos', false),
('Pedicura Spa', 280.00, '75 min', 'Pies', false),
('Pestañas Pelo a Pelo', 600.00, '2 hrs', 'Pestañas', true),
('Volumen Ruso', 800.00, '2.5 hrs', 'Pestañas', false);

-- 6. Insertar Productos Actualizados
TRUNCATE TABLE productos CASCADE;
INSERT INTO productos (nombre, precio, descripcion, emoji, badge) VALUES
('Kit Starter Uñas', 450.00, 'Gel base, top coat y 6 colores de temporada', '🎀', 'Bestseller'),
('Kit Profesional UV', 980.00, 'Set completo con lámpara UV LED + 12 colores', '⚡', 'Nuevo'),
('Set Nail Art Deluxe', 320.00, 'Pinceles profesionales, stamping y decoraciones', '🖌️', NULL),
('Playera USA Premium', 380.00, 'Importada directamente de EE.UU. Tallas S–XL', '🇺🇸', 'Importado'),
('Accesorios Nail Art', 180.00, 'Pedrería, láminas, polvo de unicornio y más', '💎', NULL),
('Esmaltes Premium', 220.00, 'Pack de 8 tonos exclusivos de temporada', '🌈', 'Limitado');

-- Habilitar RLS (Row Level Security)
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver su propio perfil" ON perfiles FOR SELECT USING (auth.uid() = id);
