import pool from '../../config/database.js';
import * as q from './pago.queries.js';

export const create = async (data) => {
  const { id_reserva, monto, metodo, referencia_externa } = data;

  const { rows } = await pool.query(q.createPago, [
    id_reserva,
    monto,
    metodo,
    'exitoso',
    referencia_externa || null
  ]);

  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getPagos);
  return rows;
};

export const getByReserva = async (id_reserva) => {
  const { rows } = await pool.query(q.getPagoByReserva, [id_reserva]);
  return rows[0];
};