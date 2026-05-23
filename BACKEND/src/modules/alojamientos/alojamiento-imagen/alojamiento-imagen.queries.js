// =========================
// CREAR
// =========================

export const createAlojamientoImagen = `
INSERT INTO alojamiento_imagen (
  id_alojamiento,
  url,
  public_id
)
VALUES ($1, $2, $3)
RETURNING *;
`;


// =========================
// OBTENER POR ALOJAMIENTO
// =========================

export const getImagenesByAlojamiento = `
SELECT *
FROM alojamiento_imagen
WHERE id_alojamiento = $1
ORDER BY created_at ASC;
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