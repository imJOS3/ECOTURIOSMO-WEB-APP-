export const createReserva = `
INSERT INTO reserva (
  id_turista,
  id_unidad,
  fecha_inicio,
  fecha_fin,
  total
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
`;
export const getReservas = `
  SELECT * FROM reserva ORDER BY created_at DESC;
`;

export const getReservaById = `
  SELECT * FROM reserva WHERE id = $1;
`;

export const getReservasByUser = `
  SELECT * FROM reserva WHERE id_turista = $1;
`;

export const updateReserva = `
  UPDATE reserva
  SET estado = $1
  WHERE id = $2
  RETURNING *;
`;

export const deleteReserva = `
  DELETE FROM reserva WHERE id = $1;
`;

export const checkAvailability = `
  SELECT *
  FROM reserva
  WHERE id_alojamiento = $1
  AND (
    fecha_inicio < $3
    AND fecha_fin > $2
  );
`;
export const getUnidadById = `
SELECT
  u.*,
  a.estado_publicacion AS alojamiento_estado_publicacion
FROM unidad u
INNER JOIN alojamiento a ON a.id = u.id_alojamiento
WHERE u.id = $1;
`;

export const checkReservaOverlap = `
SELECT *
FROM reserva
WHERE id_unidad = $1
AND estado != 'cancelada'
AND (
  fecha_inicio <= $3
  AND fecha_fin >= $2
);
`;

export const countReservasActivas = `
SELECT COUNT(*) AS total
FROM reserva
WHERE id_unidad = $1
AND estado != 'cancelada'
AND (
  fecha_inicio <= $3
  AND fecha_fin >= $2
);
`;