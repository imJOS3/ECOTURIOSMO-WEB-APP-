import pool from '../../config/database.js';
import * as q from './categoria.queries.js';

export const create = async (data) => {

  const {
    nombre,
    tipo,
    icono = 'check'
  } = data;

  const { rows } = await pool.query(
    q.createCategoria,
    [nombre, tipo, icono]
  );

  return rows[0];
};

export const getAll = async () => {

  const { rows } = await pool.query(
    q.getCategorias
  );

  return rows;
};

export const getById = async (id) => {

  const { rows } = await pool.query(
    q.getCategoriaById,
    [id]
  );

  return rows[0];
};

export const update = async (id, data) => {

  const {
    nombre,
    tipo,
    icono = 'check'
  } = data;

  const { rows } = await pool.query(
    q.updateCategoria,
    [nombre, tipo, icono, id]
  );

  return rows[0];
};

export const remove = async (id) => {

  await pool.query(
    q.deleteCategoria,
    [id]
  );

  return {
    message: 'Categoría eliminada'
  };
};