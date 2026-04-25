export const createPago = `
  INSERT INTO pago(id_reserva, monto, metodo, estado, referencia_externa)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;
`;

export const getPagos = `SELECT * FROM pago ORDER BY fecha_pago DESC;`;

export const getPagoByReserva = `
  SELECT * FROM pago WHERE id_reserva = $1;
`;