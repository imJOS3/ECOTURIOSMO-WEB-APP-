// alojamiento.service.js

import pool from '../../config/database.js';
import * as q from './alojamiento.queries.js';

export const create = async (data, user) => {
  const { titulo, descripcion, ubicacion, latitud, longitud } = data;
  const { rows } = await pool.query(q.createAlojamiento, [
    user.id, titulo, descripcion, ubicacion, latitud, longitud, 'pendiente_revision'
  ]);
  return rows[0];
};

export const getAll = async (user = null) => {
  // ADMIN
  if (user && user.rol === 'admin') {
    const { rows } = await pool.query(q.getAllAlojamientosAll);
    return rows;
  }
  // ANFITRION -> solo los suyos
  if (user && user.rol === 'anfitrion') {
    const { rows } = await pool.query(q.getByAnfitrion, [user.id]); // ← corregido
    return rows;
  }
  // TURISTA / PUBLICO
  const { rows } = await pool.query(q.getAllAlojamientos);
  return rows;
};

export const getById = async (id, user = null) => {
  const { rows } = await pool.query(q.getAlojamientoByIdAny, [id]);
  const alojamiento = rows[0];
  if (!alojamiento) return null;

  if (user && user.rol === 'admin') return alojamiento;

  if (user && user.rol === 'anfitrion') {
    if (alojamiento.id_anfitrion === user.id) return alojamiento;
    if (alojamiento.estado === 'aprobado') return alojamiento;
    return null;
  }

  if (alojamiento.estado === 'aprobado') return alojamiento;
  return null;
};

export const getMyAlojamientos = async (user) => {
  const { rows } = await pool.query(q.getByAnfitrion, [user.id]);
  return rows;
};

export const update = async (id, data) => {
  const { titulo, descripcion, ubicacion, latitud, longitud } = data;
  const { rows } = await pool.query(q.updateAlojamiento, [
    titulo, descripcion, ubicacion, latitud, longitud, id
  ]);
  return rows[0];
};

export const remove = async (id) => {
  await pool.query(q.deleteAlojamiento, [id]);
  return { message: 'Eliminado correctamente' };
};