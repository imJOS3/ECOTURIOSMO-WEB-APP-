export const createUnidad = `
INSERT INTO unidad (
  id_alojamiento,
  nombre,
  tipo,
  descripcion,
  capacidad,
  precio_noche
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

export const getUnidadesByAlojamiento = `
SELECT * FROM unidad
WHERE id_alojamiento = $1;
`;