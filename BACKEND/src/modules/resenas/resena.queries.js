export const createResena = `
  INSERT INTO resena(id_turista,id_alojamiento,calificacion,comentario)
  VALUES ($1,$2,$3,$4)
  RETURNING *;
`;

export const getResenas = `
  SELECT * FROM resena ORDER BY fecha DESC;
`;

export const getByAlojamiento = `
  SELECT * FROM resena WHERE id_alojamiento = $1;
`;