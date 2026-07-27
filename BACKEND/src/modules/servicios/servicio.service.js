import pool from '../../config/database.js';
import * as q from './servicio.queries.js';

export const create = async (data) => {
  const { nombre, icono = 'check' } = data;
  const { rows } = await pool.query(q.createServicio, [nombre, icono]);
  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getServicios);
  return rows;
};

export const getById = async (id) => {
  const { rows } = await pool.query(q.getServicioById, [id]);
  return rows[0];
};

export const update = async (id, data) => {
  const { nombre, icono = 'check' } = data;
  const { rows } = await pool.query(q.updateServicio, [nombre, icono, id]);
  return rows[0];
};

export const remove = async (id) => {
  await pool.query(q.deleteServicio, [id]);
  return { message: 'Servicio eliminado' };
};
