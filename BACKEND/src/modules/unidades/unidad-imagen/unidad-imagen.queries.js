// =========================
// CREAR
// =========================

export const createUnidadImagen = `
INSERT INTO unidad_imagen (
  id_unidad,
  url,
  public_id
)
VALUES ($1, $2, $3)
RETURNING *;
`;


// =========================
// OBTENER POR UNIDAD
// =========================

export const getImagenesByUnidad = `
SELECT *
FROM unidad_imagen
WHERE id_unidad = $1
ORDER BY created_at ASC;
`;


// =========================
// OBTENER UNA
// =========================

export const getImagenById = `
SELECT *
FROM unidad_imagen
WHERE id = $1;
`;


// =========================
// ELIMINAR
// =========================

export const deleteUnidadImagen = `
DELETE FROM unidad_imagen
WHERE id = $1;
`;