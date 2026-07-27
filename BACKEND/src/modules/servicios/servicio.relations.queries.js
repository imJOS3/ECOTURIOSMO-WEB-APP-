export const deleteAlojamientoServicios = `
  DELETE FROM alojamiento_servicio
  WHERE id_alojamiento = $1;
`;

export const insertAlojamientoServicio = `
  INSERT INTO alojamiento_servicio (
    id_alojamiento,
    id_servicio
  )
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING;
`;

export const getAlojamientoServicios = `
  SELECT s.*
  FROM servicio s
  INNER JOIN alojamiento_servicio asv
    ON asv.id_servicio = s.id
  WHERE asv.id_alojamiento = $1
  ORDER BY s.nombre ASC;
`;
