export const ESPACIOS_IMAGEN = [
  'general',
  'habitacion',
  'bano',
  'cocina',
  'sala',
  'comedor',
  'exterior',
  'otro',
];

export const DEFAULT_ESPACIO = 'general';

// =========================
// CREAR
// =========================

export const createAlojamientoImagen = `
INSERT INTO alojamiento_imagen (
  id_alojamiento,
  url,
  public_id,
  espacio
)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;

// =========================
// OBTENER POR ALOJAMIENTO
// =========================

export const getImagenesByAlojamiento = `
SELECT *
FROM alojamiento_imagen
WHERE id_alojamiento = $1
ORDER BY
  CASE WHEN portada THEN 0 ELSE 1 END,
  CASE espacio
    WHEN 'general' THEN 0
    WHEN 'exterior' THEN 1
    WHEN 'sala' THEN 2
    WHEN 'comedor' THEN 3
    WHEN 'cocina' THEN 4
    WHEN 'habitacion' THEN 5
    WHEN 'bano' THEN 6
    ELSE 7
  END,
  created_at ASC;
`;

// =========================
// OBTENER UNA
// =========================

export const getImagenById = `
SELECT *
FROM alojamiento_imagen
WHERE id = $1;
`;

// =========================
// ELIMINAR
// =========================

export const deleteAlojamientoImagen = `
DELETE FROM alojamiento_imagen
WHERE id = $1;
`;

// =========================
// ACTUALIZAR ARCHIVO
// =========================

export const updateAlojamientoImagen = `
UPDATE alojamiento_imagen
SET url = $1, public_id = $2
WHERE id = $3
RETURNING *;
`;

// =========================
// ACTUALIZAR ESPACIO
// =========================

export const updateAlojamientoImagenEspacio = `
UPDATE alojamiento_imagen
SET espacio = $1
WHERE id = $2
RETURNING *;
`;
