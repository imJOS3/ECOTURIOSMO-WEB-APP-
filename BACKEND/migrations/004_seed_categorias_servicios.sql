-- =============================================================================
-- Seed: categorías (experiencias) + servicios (comodidades)
-- Pegar en Neon → SQL Editor → Run
-- Seguro de re-ejecutar (ON CONFLICT / NOT EXISTS)
-- =============================================================================

BEGIN;

-- ── Categorías / experiencias ───────────────────────────────────────────────
INSERT INTO public.categoria (nombre, tipo, icono)
SELECT v.nombre, 'alojamiento', v.icono
FROM (VALUES
  ('Naturaleza', 'leaf'),
  ('Ecoturismo', 'leaf'),
  ('Bosque', 'leaf'),
  ('Montaña', 'mountain'),
  ('Mirador', 'mountain'),
  ('Vista panorámica', 'mountain'),
  ('Vista al bosque', 'mountain'),
  ('Vista a la montaña', 'mountain'),
  ('Glamping', 'glamping'),
  ('Camping', 'glamping'),
  ('Romántico', 'heart'),
  ('Ideal para parejas', 'heart'),
  ('Desconexión digital', 'phone_off'),
  ('Pet Friendly', 'pets'),
  ('Familiar', 'users'),
  ('Conocer personas', 'users'),
  ('Aventura', 'adventure'),
  ('Habitación privada', 'home'),
  ('Habitación compartida', 'users')
) AS v(nombre, icono)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categoria c
  WHERE lower(c.nombre) = lower(v.nombre)
);

-- ── Servicios / comodidades ─────────────────────────────────────────────────
INSERT INTO public.servicio (nombre, icono) VALUES
  ('Wifi', 'wifi'),
  ('Estacionamiento gratis', 'parking'),
  ('Vista a las montañas', 'mountain'),
  ('Vista al océano', 'waves'),
  ('Acceso a la playa', 'beach'),
  ('Zona de trabajo', 'desk'),
  ('Se permiten mascotas', 'pets'),
  ('Televisor', 'tv'),
  ('Cámaras de seguridad exteriores', 'camera'),
  ('Cocina', 'kitchen'),
  ('Jacuzzi', 'jacuzzi'),
  ('Baño privado', 'bath'),
  ('Aire acondicionado', 'ac'),
  ('Balcón', 'balcony'),
  ('Detector de humo', 'shield'),
  ('Botiquín', 'first_aid'),
  ('Calefacción', 'heater'),
  ('Lavadora', 'washer')
ON CONFLICT (nombre) DO UPDATE
SET icono = EXCLUDED.icono;

COMMIT;

-- Verificación (opcional):
-- SELECT id, nombre, icono FROM categoria ORDER BY nombre;
-- SELECT id, nombre, icono FROM servicio ORDER BY nombre;
