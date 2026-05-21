// alojamiento.service.js

import pool from '../../config/database.js';
import * as q from './alojamiento.queries.js';


// =========================
// CREAR
// =========================

export const create = async (data, user) => {

  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  } = data;

  const { rows } = await pool.query(
    q.createAlojamiento,
    [
      user.id,
      titulo,
      descripcion,
      ubicacion,
      latitud,
      longitud,
      'pendiente_revision'
    ]
  );

  return rows[0];
};


// =========================
// OBTENER TODOS
// =========================

export const getAll = async (user = null) => {

  console.log(user);

  // ADMIN
  if (user && user.rol === 'admin') {

    const { rows } = await pool.query(
      q.getAllAlojamientosAll
    );

    return rows;
  }

  // ANFITRION
  if (user && user.rol === 'anfitrion') {

    const { rows } = await pool.query(
      q.getAllAlojamientosForAnfitrion,
      [user.id]
    );

    return rows;
  }

  // TURISTA / PUBLICO
  const { rows } = await pool.query(
    q.getAllAlojamientos
  );

  return rows;
};


// =========================
// OBTENER POR ID
// =========================

export const getById = async (id, user = null) => {

  const { rows } = await pool.query(
    q.getAlojamientoByIdAny,
    [id]
  );

  const alojamiento = rows[0];

  if (!alojamiento) {
    return null;
  }

  // ADMIN
  if (user && user.rol === 'admin') {
    return alojamiento;
  }

  // ANFITRION
  if (user && user.rol === 'anfitrion') {

    // Puede ver los suyos
    if (alojamiento.id_anfitrion === user.id) {
      return alojamiento;
    }

    // También aprobados
    if (alojamiento.estado === 'aprobado') {
      return alojamiento;
    }

    return null;
  }

  // TURISTA / PUBLICO
  if (alojamiento.estado === 'aprobado') {
    return alojamiento;
  }

  return null;
};


// =========================
// MIS ALOJAMIENTOS
// =========================

export const getMyAlojamientos = async (user) => {

  const { rows } = await pool.query(
    q.getByAnfitrion,
    [user.id]
  );

  return rows;
};


// =========================
// ACTUALIZAR
// =========================

export const update = async (id, data) => {

  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  } = data;

  const { rows } = await pool.query(
    q.updateAlojamiento,
    [
      titulo,
      descripcion,
      ubicacion,
      latitud,
      longitud,
      id
    ]
  );

  return rows[0];
};


// =========================
// ELIMINAR
// =========================

export const remove = async (id) => {

  await pool.query(
    q.deleteAlojamiento,
    [id]
  );

  return {
    message: 'Eliminado correctamente'
  };
};