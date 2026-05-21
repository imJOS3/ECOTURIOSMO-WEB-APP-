// unidad.queries.js

// =========================
// CREAR
// =========================

export const createUnidad = `
INSERT INTO unidad (
  id_alojamiento,
  nombre,
  tipo,
  descripcion,
  capacidad,
  cupos_disponibles,
  es_compartido,
  precio_noche,
  estado
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;
`;


// =========================
// SOLO APROBADAS
// =========================

export const getUnidadesAprobadas = `
SELECT *
FROM unidad
WHERE id_alojamiento = CAST($1 AS INTEGER)
AND estado = 'aprobado'
ORDER BY created_at DESC;
`;


// =========================
// TODAS
// =========================

export const getUnidadesAll = `
SELECT *
FROM unidad
WHERE id_alojamiento = CAST($1 AS INTEGER)
ORDER BY created_at DESC;
`;


// =========================
// ANFITRION
// VE TODO LO SUYO
// Y APROBADAS DE OTROS
// =========================

export const getUnidadesForAnfitrion = `
SELECT u.*
FROM unidad u
INNER JOIN alojamiento a
ON a.id = u.id_alojamiento
WHERE
u.id_alojamiento = CAST($1 AS INTEGER)
AND
(
  u.estado = 'aprobado'
)
OR
(
  u.id_alojamiento = CAST($1 AS INTEGER)
  AND
  a.id_anfitrion = CAST($2 AS INTEGER)
)
ORDER BY u.created_at DESC;
`;


// =========================
// OBTENER ALOJAMIENTO
// =========================

export const getAlojamientoOwner = `
SELECT *
FROM alojamiento
WHERE id = $1;
`;


// =========================
// OBTENER UNIDAD
// =========================

export const getUnidadById = `
SELECT *
FROM unidad
WHERE id = $1;
`;


// =========================
// OBTENER POR OWNER
// =========================

export const getUnidadesByOwner = `
SELECT u.*
FROM unidad u
INNER JOIN alojamiento a
ON a.id = u.id_alojamiento
WHERE a.id_anfitrion = $1
ORDER BY u.created_at DESC;
`;


// =========================
// ACTUALIZAR
// =========================

export const updateUnidad = `
UPDATE unidad
SET
  nombre = $1,
  tipo = $2,
  descripcion = $3,
  capacidad = $4,
  cupos_disponibles = $5,
  es_compartido = $6,
  precio_noche = $7,
  estado = $8
WHERE id = $9
RETURNING *;
`;


// =========================
// ELIMINAR
// =========================

export const deleteUnidad = `
DELETE FROM unidad
WHERE id = $1;
`;