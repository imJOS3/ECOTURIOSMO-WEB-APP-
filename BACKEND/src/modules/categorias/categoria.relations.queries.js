export const deleteAlojamientoCategorias = `
  DELETE FROM alojamiento_categoria
  WHERE id_alojamiento = $1;
`;

export const insertAlojamientoCategoria = `
  INSERT INTO alojamiento_categoria (
    id_alojamiento,
    id_categoria
  )
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING;
`;

export const getAlojamientoCategorias = `
  SELECT c.*
  FROM categoria c
  INNER JOIN alojamiento_categoria ac
    ON ac.id_categoria = c.id
  WHERE ac.id_alojamiento = $1
  ORDER BY c.nombre ASC;
`;
