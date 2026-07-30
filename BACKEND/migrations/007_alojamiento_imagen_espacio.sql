-- Categoría de espacio de cada foto del alojamiento
ALTER TABLE public.alojamiento_imagen
  ADD COLUMN IF NOT EXISTS espacio character varying(32) NOT NULL DEFAULT 'general';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'alojamiento_imagen_espacio_check'
  ) THEN
    ALTER TABLE public.alojamiento_imagen
      ADD CONSTRAINT alojamiento_imagen_espacio_check
      CHECK (espacio IN (
        'general',
        'habitacion',
        'bano',
        'cocina',
        'sala',
        'comedor',
        'exterior',
        'otro'
      ));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_alojamiento_imagen_espacio
  ON public.alojamiento_imagen (id_alojamiento, espacio);
