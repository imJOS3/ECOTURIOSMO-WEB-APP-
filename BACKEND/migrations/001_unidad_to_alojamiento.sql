-- =============================================================================
-- Migración: de (alojamiento + unidad) → solo alojamiento
-- Compatible con el dump de PostgreSQL 17.6 del 2026-07-26
--
-- Cómo ejecutar (elige una):
--   A) pgAdmin → Query Tool → pegar este archivo → Execute (F5)
--   B) psql:  psql -U postgres -d TU_BASE -f 001_unidad_to_alojamiento.sql
--
-- Haz backup antes (tú ya tienes el dump).
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) Campos bookable en alojamiento
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.alojamiento
  ADD COLUMN IF NOT EXISTS precio_noche NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS capacidad INTEGER,
  ADD COLUMN IF NOT EXISTS es_compartido BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cupos_disponibles INTEGER,
  ADD COLUMN IF NOT EXISTS habitaciones INTEGER,
  ADD COLUMN IF NOT EXISTS camas INTEGER,
  ADD COLUMN IF NOT EXISTS banos INTEGER;

-- Preferir unidades aprobadas; si no hay, cualquier unidad.
-- precio = mínimo, capacidad = máxima (resumen razonable del listing).
UPDATE public.alojamiento a
SET
  precio_noche = COALESCE(a.precio_noche, s.precio_noche),
  capacidad = COALESCE(a.capacidad, s.capacidad),
  es_compartido = COALESCE(a.es_compartido, s.es_compartido, FALSE),
  cupos_disponibles = COALESCE(a.cupos_disponibles, s.cupos_disponibles),
  habitaciones = COALESCE(a.habitaciones, 1),
  camas = COALESCE(a.camas, s.capacidad),
  banos = COALESCE(a.banos, 1)
FROM (
  SELECT
    u.id_alojamiento,
    MIN(u.precio_noche) AS precio_noche,
    MAX(u.capacidad) AS capacidad,
    BOOL_OR(COALESCE(u.es_compartido, FALSE)) AS es_compartido,
    MAX(u.cupos_disponibles) AS cupos_disponibles
  FROM public.unidad u
  WHERE EXISTS (
    SELECT 1
    FROM public.unidad u2
    WHERE u2.id_alojamiento = u.id_alojamiento
      AND u2.estado = 'aprobado'
  )
  AND u.estado = 'aprobado'
  GROUP BY u.id_alojamiento

  UNION ALL

  SELECT
    u.id_alojamiento,
    MIN(u.precio_noche) AS precio_noche,
    MAX(u.capacidad) AS capacidad,
    BOOL_OR(COALESCE(u.es_compartido, FALSE)) AS es_compartido,
    MAX(u.cupos_disponibles) AS cupos_disponibles
  FROM public.unidad u
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.unidad u2
    WHERE u2.id_alojamiento = u.id_alojamiento
      AND u2.estado = 'aprobado'
  )
  GROUP BY u.id_alojamiento
) s
WHERE a.id = s.id_alojamiento;

-- Alojamientos sin unidades (ej. id 51): defaults editables
UPDATE public.alojamiento
SET
  precio_noche = COALESCE(precio_noche, 0),
  capacidad = COALESCE(capacidad, 1),
  es_compartido = COALESCE(es_compartido, FALSE),
  habitaciones = COALESCE(habitaciones, 1),
  camas = COALESCE(camas, 1),
  banos = COALESCE(banos, 1)
WHERE precio_noche IS NULL
   OR capacidad IS NULL
   OR es_compartido IS NULL;

ALTER TABLE public.alojamiento
  ALTER COLUMN precio_noche SET NOT NULL,
  ALTER COLUMN capacidad SET NOT NULL,
  ALTER COLUMN es_compartido SET NOT NULL,
  ALTER COLUMN es_compartido SET DEFAULT FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) Pasar imágenes de unidad → alojamiento (sin duplicar por URL)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.alojamiento_imagen (id_alojamiento, url, public_id, portada)
SELECT
  u.id_alojamiento,
  ui.url,
  ui.public_id,
  FALSE
FROM public.unidad_imagen ui
INNER JOIN public.unidad u ON u.id = ui.id_unidad
WHERE NOT EXISTS (
  SELECT 1
  FROM public.alojamiento_imagen ai
  WHERE ai.url = ui.url
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3) Categorías de unidad → comodidades del alojamiento
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.alojamiento_categoria (id_alojamiento, id_categoria)
SELECT DISTINCT
  u.id_alojamiento,
  uc.id_categoria
FROM public.unidad_categoria uc
INNER JOIN public.unidad u ON u.id = uc.id_unidad
ON CONFLICT DO NOTHING;

-- Reutilizar categorías tipo 'unidad' como tipo 'alojamiento'
-- (WiFi, Jacuzzi, etc. pasan a ser comodidades del listing)
UPDATE public.categoria
SET tipo = 'alojamiento'
WHERE tipo = 'unidad';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4) Reservas: id_unidad → id_alojamiento
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.reserva
  ADD COLUMN IF NOT EXISTS id_alojamiento INTEGER;

UPDATE public.reserva r
SET id_alojamiento = u.id_alojamiento
FROM public.unidad u
WHERE r.id_unidad = u.id
  AND r.id_alojamiento IS NULL;

-- Por si quedara alguna huérfana (no debería con tu dump)
DELETE FROM public.reserva
WHERE id_alojamiento IS NULL;

ALTER TABLE public.reserva
  ALTER COLUMN id_alojamiento SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'reserva_id_alojamiento_fkey'
  ) THEN
    ALTER TABLE public.reserva
      ADD CONSTRAINT reserva_id_alojamiento_fkey
      FOREIGN KEY (id_alojamiento)
      REFERENCES public.alojamiento(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- En tu dump no hay FK reserva→unidad, pero por si existe en otro entorno:
ALTER TABLE public.reserva DROP CONSTRAINT IF EXISTS reserva_id_unidad_fkey;
ALTER TABLE public.reserva DROP COLUMN IF EXISTS id_unidad;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5) Eliminar modelo unidad
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.unidad_imagen CASCADE;
DROP TABLE IF EXISTS public.unidad_categoria CASCADE;
DROP TABLE IF EXISTS public.unidad CASCADE;
DROP SEQUENCE IF EXISTS public.unidad_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.unidad_imagen_id_seq CASCADE;

COMMIT;

-- =============================================================================
-- Verificación (ejecutar DESPUÉS del COMMIT, fuera de la transacción):
--
-- SELECT id, titulo, precio_noche, capacidad, es_compartido, estado
-- FROM alojamiento ORDER BY id;
--
-- SELECT id, id_turista, id_alojamiento, fecha_inicio, fecha_fin, total, estado
-- FROM reserva ORDER BY id;
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'alojamiento' ORDER BY ordinal_position;
--
-- -- No debe devolver filas:
-- SELECT to_regclass('public.unidad');
-- =============================================================================
