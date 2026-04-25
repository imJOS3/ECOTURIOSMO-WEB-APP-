import pool from '../../config/database.js';
import * as q from './resena.queries.js';

export const create = async (data, user) => {
  const { id_alojamiento, calificacion, comentario } = data;

  const { rows } = await pool.query(q.createResena, [
    user.id,
    id_alojamiento,
    calificacion,
    comentario
  ]);

  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getResenas);
  return rows;
};

export const getByAlojamiento = async (id) => {
  const { rows } = await pool.query(q.getByAlojamiento, [id]);
  return rows;
};