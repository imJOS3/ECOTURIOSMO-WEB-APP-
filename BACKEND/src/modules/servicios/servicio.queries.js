export const createServicio = `
  INSERT INTO servicio (nombre, icono)
  VALUES ($1, $2)
  RETURNING *;
`;

export const getServicios = `
  SELECT *
  FROM servicio
  ORDER BY nombre ASC;
`;

export const getServicioById = `
  SELECT *
  FROM servicio
  WHERE id = $1;
`;

export const updateServicio = `
  UPDATE servicio
  SET
    nombre = $1,
    icono = $2
  WHERE id = $3
  RETURNING *;
`;

export const deleteServicio = `
  DELETE FROM servicio
  WHERE id = $1;
`;
