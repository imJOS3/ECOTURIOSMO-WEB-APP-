export const createCategoria = `
  INSERT INTO categoria (
    nombre,
    tipo
  )
  VALUES ($1, $2)
  RETURNING *;
`;

export const getCategorias = `
  SELECT *
  FROM categoria
  ORDER BY created_at DESC;
`;

export const getCategoriaById = `
  SELECT *
  FROM categoria
  WHERE id = $1;
`;

export const updateCategoria = `
  UPDATE categoria
  SET
    nombre = $1,
    tipo = $2
  WHERE id = $3
  RETURNING *;
`;

export const deleteCategoria = `
  DELETE FROM categoria
  WHERE id = $1;
`;