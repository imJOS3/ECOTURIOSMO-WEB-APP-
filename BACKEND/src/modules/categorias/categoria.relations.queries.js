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

export const deleteUnidadCategorias = `
  DELETE FROM unidad_categoria
  WHERE id_unidad = $1;
`;

export const insertUnidadCategoria = `
  INSERT INTO unidad_categoria (
    id_unidad,
    id_categoria
  )
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING;
`;

export const getUnidadCategorias = `
  SELECT c.*
  FROM categoria c
  INNER JOIN unidad_categoria uc
    ON uc.id_categoria = c.id
  WHERE uc.id_unidad = $1
  ORDER BY c.nombre ASC;
`;