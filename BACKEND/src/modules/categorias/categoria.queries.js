export const createCategoria = `
  INSERT INTO categoria(nombre)
  VALUES ($1)
  RETURNING *;
`;

export const getCategorias = `
  SELECT * FROM categoria ORDER BY created_at DESC;
`;