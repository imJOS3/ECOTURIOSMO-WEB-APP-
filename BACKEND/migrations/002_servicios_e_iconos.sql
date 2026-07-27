-- =============================================================================
-- Migración: iconos en categoría + catálogo de servicios del alojamiento
--
-- Cómo ejecutar:
--   psql -U postgres -d ecoturismo -f 002_servicios_e_iconos.sql
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) Icono en categoría (experiencias)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.categoria
  ADD COLUMN IF NOT EXISTS icono VARCHAR(50);

UPDATE public.categoria SET icono = 'leaf' WHERE lower(nombre) IN ('naturaleza', 'ecoturismo', 'bosque');
UPDATE public.categoria SET icono = 'mountain' WHERE lower(nombre) IN ('mirador', 'montaña', 'montana', 'vista a la montaña', 'vista a la montana', 'vista panorámica', 'vista panoramica', 'vista al bosque');
UPDATE public.categoria SET icono = 'heart' WHERE lower(nombre) IN ('romántico', 'romantico', 'ideal para parejas');
UPDATE public.categoria SET icono = 'glamping' WHERE lower(nombre) IN ('glamping', 'camping');
UPDATE public.categoria SET icono = 'phone_off' WHERE lower(nombre) = 'desconexión digital' OR lower(nombre) = 'desconexion digital';
UPDATE public.categoria SET icono = 'pets' WHERE lower(nombre) = 'pet friendly';
UPDATE public.categoria SET icono = 'users' WHERE lower(nombre) IN ('conocer personas', 'familiar', 'habitación compartida', 'habitacion compartida');
UPDATE public.categoria SET icono = 'adventure' WHERE lower(nombre) = 'aventura';
UPDATE public.categoria SET icono = 'home' WHERE lower(nombre) = 'habitación privada' OR lower(nombre) = 'habitacion privada';
UPDATE public.categoria SET icono = 'balcony' WHERE lower(nombre) = 'balcón' OR lower(nombre) = 'balcon';
UPDATE public.categoria SET icono = 'jacuzzi' WHERE lower(nombre) = 'jacuzzi';
UPDATE public.categoria SET icono = 'wifi' WHERE lower(nombre) = 'wifi';
UPDATE public.categoria SET icono = 'kitchen' WHERE lower(nombre) = 'cocina';
UPDATE public.categoria SET icono = 'bath' WHERE lower(nombre) = 'baño privado' OR lower(nombre) = 'bano privado';
UPDATE public.categoria SET icono = 'ac' WHERE lower(nombre) = 'aire acondicionado';

UPDATE public.categoria SET icono = 'check' WHERE icono IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) Catálogo de servicios + relación M2M
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.servicio (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  icono VARCHAR(50) NOT NULL DEFAULT 'check',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alojamiento_servicio (
  id_alojamiento INTEGER NOT NULL REFERENCES public.alojamiento(id) ON DELETE CASCADE,
  id_servicio INTEGER NOT NULL REFERENCES public.servicio(id) ON DELETE CASCADE,
  PRIMARY KEY (id_alojamiento, id_servicio)
);

CREATE INDEX IF NOT EXISTS idx_alojamiento_servicio_servicio
  ON public.alojamiento_servicio (id_servicio);

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
