import pool from '../../config/database.js';
import * as q from './alojamiento.queries.js';

export const create = async (data, user) => {
  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  } = data;

  const { rows } = await pool.query(q.createAlojamiento, [
    user.id,
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  ]);

  return rows[0];
};

export const getAll = async () => {
  const { rows } = await pool.query(q.getAllAlojamientos);
  return rows;
};

export const getById = async (id) => {
  const { rows } = await pool.query(q.getAlojamientoById, [id]);
  return rows[0];
};

export const getMyAlojamientos = async (user) => {
  const { rows } = await pool.query(q.getByAnfitrion, [user.id]);
  return rows;
};

export const update = async (id, data) => {
  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  } = data;

  const { rows } = await pool.query(q.updateAlojamiento, [
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud,
    id
  ]);

  return rows[0];
};

export const remove = async (id) => {
  await pool.query(q.deleteAlojamiento, [id]);

  return { message: 'Eliminado' };
};