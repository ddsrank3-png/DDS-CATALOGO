-- =============================================
-- SCHEMA CATÁLOGO DDS PARFUMS
-- Pega esto en el SQL Editor de Supabase (puede ser el mismo proyecto)
-- =============================================

CREATE TABLE IF NOT EXISTS catalogo_productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Decant', -- 'Decant' | 'Perfume'
  precio NUMERIC(10,2) NOT NULL,
  descripcion TEXT,
  notas_aromaticas TEXT,        -- Ej: "Rosa, Jazmín, Madera de cedro"
  ocasion TEXT,                 -- Ej: "Noche, Citas, Eventos"
  duracion TEXT,                -- Ej: "6-8 horas"
  foto_url TEXT,                -- URL de imagen (subida a Supabase Storage o externa)
  disponible BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,      -- Para ordenar manualmente
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos (cuando un cliente aparta)
CREATE TABLE IF NOT EXISTS catalogo_pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID REFERENCES catalogo_productos(id),
  nombre_producto TEXT NOT NULL,
  nombre_cliente TEXT NOT NULL,
  telefono_cliente TEXT,
  notas TEXT,
  estado TEXT DEFAULT 'pendiente', -- 'pendiente' | 'confirmado' | 'entregado'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS público
ALTER TABLE catalogo_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública catálogo" ON catalogo_productos FOR SELECT USING (true);
CREATE POLICY "Escritura catálogo admin" ON catalogo_productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insertar pedidos" ON catalogo_pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Leer pedidos admin" ON catalogo_pedidos FOR ALL USING (true) WITH CHECK (true);

-- Bucket de imágenes en Supabase Storage (ejecuta esto también)
-- En Supabase > Storage > New bucket > nombre: "perfumes" > Public: ON

-- Productos de ejemplo
INSERT INTO catalogo_productos (nombre, categoria, precio, descripcion, notas_aromaticas, ocasion, duracion, orden) VALUES
  ('Baccarat Rouge 540', 'Decant', 35.00, 'Una fragancia icónica de Maison Francis Kurkdjian. Cálida, amaderada y adictiva — la preferida de quienes buscan dejar huella.', 'Azafrán, Jazmín, Ambergris, Cedro', 'Noche, Citas, Eventos especiales', '8-10 horas', 1),
  ('Baccarat Rouge 540 10ml', 'Decant', 60.00, 'Una fragancia icónica de Maison Francis Kurkdjian. Cálida, amaderada y adictiva — la preferida de quienes buscan dejar huella.', 'Azafrán, Jazmín, Ambergris, Cedro', 'Noche, Citas, Eventos especiales', '8-10 horas', 2),
  ('Bleu de Chanel 5ml', 'Decant', 25.00, 'Elegancia masculina sin esfuerzo. Fresco, sofisticado y versátil — funciona igual en la oficina que en una salida de noche.', 'Cítricos, Jengibre, Cedro, Incienso', 'Diario, Trabajo, Casual', '6-8 horas', 3),
  ('Good Girl Carolina Herrera 5ml', 'Decant', 28.00, 'Seductora y contrastante. Una dualidad entre la frescura floral y la oscuridad de la vainilla. Para la mujer que no pasa desapercibida.', 'Jazmín, Tuberosa, Cacao, Vainilla, Tonka', 'Noche, Salidas, Eventos', '7-9 horas', 4);
