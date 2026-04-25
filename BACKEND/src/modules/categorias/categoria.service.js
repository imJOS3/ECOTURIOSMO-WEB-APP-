import pool from '../../config/database.js';
import * as q from './categoria.queries.js';

export const create = async (nombre) => {
  const { rows } = await pool.query(q.createCategoria, [nombre]);
  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getCategorias);
  return rows;
};