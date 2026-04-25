export const createReserva = `
  INSERT INTO reserva (
    id_turista, id_alojamiento, fecha_inicio, fecha_fin, total
  )
  VALUES ($1,$2,$3,$4,$5)
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