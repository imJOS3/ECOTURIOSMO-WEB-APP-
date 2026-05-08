export const createUnidad = `
INSERT INTO unidad (
  id_alojamiento,
  nombre,
  tipo,
  descripcion,
  capacidad,
  cupos_disponibles,
  es_compartido,
  precio_noche
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
`;

export const getUnidadesByAlojamiento = `
SELECT * FROM unidad
WHERE id_alojamiento = $1;
`;