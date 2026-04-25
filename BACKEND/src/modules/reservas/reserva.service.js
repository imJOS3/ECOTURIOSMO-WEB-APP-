import pool from '../../config/database.js';
import * as q from './reserva.queries.js';

export const create = async (data, user) => {
  const { id_alojamiento, fecha_inicio, fecha_fin, total } = data;

  const { rows } = await pool.query(q.createReserva, [
    user.id,
    id_alojamiento,
    fecha_inicio,
    fecha_fin,
    total
  ]);

  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getReservas);
  return rows;
};

export const getById = async (id) => {
  const { rows } = await pool.query(q.getReservaById, [id]);
  return rows[0];
};

export const getMine = async (user) => {
  const { rows } = await pool.query(q.getReservasByUser, [user.id]);
  return rows;
};

export const update = async (id, estado) => {
  const { rows } = await pool.query(q.updateReserva, [estado, id]);
  return rows[0];
};

export const remove = async (id) => {
  await pool.query(q.deleteReserva, [id]);
  return { message: 'Reserva eliminada' };
};