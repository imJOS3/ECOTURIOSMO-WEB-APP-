// unidad.service.js

import pool from '../../config/database.js';
import * as q from './unidad.queries.js';


// =========================
// CREAR
// =========================

export const create = async (data, user) => {

  const {
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    es_compartido,
    precio_noche
  } = data;


  // =========================
  // VALIDAR ALOJAMIENTO
  // =========================

  const { rows: alojamientoRows } = await pool.query(
    q.getAlojamientoOwner,
    [id_alojamiento]
  );

  const alojamiento = alojamientoRows[0];

  if (!alojamiento) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // VALIDAR OWNER
  // =========================

  if (
    user.rol !== 'admin' &&
    alojamiento.id_anfitrion !== user.id
  ) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // CUPOS
  // =========================

  const cupos_disponibles = capacidad;


  // =========================
  // CREAR
  // =========================

  const { rows } = await pool.query(
    q.createUnidad,
    [
      id_alojamiento,
      nombre,
      tipo,
      descripcion,
      capacidad,
      cupos_disponibles,
      es_compartido,
      precio_noche,
      'pendiente_revision'
    ]
  );

  return rows[0];
};


// =========================
// OBTENER POR ALOJAMIENTO
// =========================

export const getByAlojamiento = async (
  id,
  user = null
) => {

  id = Number(id);

  if (isNaN(id)) {
    throw new Error('INVALID_ID');
  }


  // =========================
  // ADMIN
  // =========================

  if (user && user.rol === 'admin') {

    const { rows } = await pool.query(
      q.getUnidadesAll,
      [id]
    );

    return rows;
  }


  // =========================
  // ANFITRION
  // =========================

  if (user && user.rol === 'anfitrion') {

    const { rows } = await pool.query(
      q.getUnidadesForAnfitrion,
      [id, user.id]
    );

    return rows;
  }


  // =========================
  // PUBLICO / TURISTA
  // =========================

  const { rows } = await pool.query(
    q.getUnidadesAprobadas,
    [id]
  );

  return rows;
};


// =========================
// OBTENER UNA
// =========================

export const getById = async (
  id,
  user = null
) => {

  const { rows } = await pool.query(
    q.getUnidadById,
    [id]
  );

  const unidad = rows[0];

  if (!unidad) {
    return null;
  }


  // =========================
  // ADMIN
  // =========================

  if (user && user.rol === 'admin') {
    return unidad;
  }


  // =========================
  // PUBLICO / TURISTA
  // =========================

  if (!user || user.rol === 'turista') {

    if (unidad.estado === 'aprobado') {
      return unidad;
    }

    return null;
  }


  // =========================
  // ANFITRION
  // =========================

  if (user.rol === 'anfitrion') {

    const { rows: alojamientoRows } = await pool.query(
      q.getAlojamientoOwner,
      [unidad.id_alojamiento]
    );

    const alojamiento = alojamientoRows[0];

    const isOwner =
      alojamiento.id_anfitrion === user.id;

    // puede ver todo lo suyo
    if (isOwner) {
      return unidad;
    }

    // de otros solo aprobado
    if (unidad.estado === 'aprobado') {
      return unidad;
    }

    return null;
  }

  return null;
};


// =========================
// MIS UNIDADES
// =========================

export const getMine = async (
  user
) => {

  const { rows } = await pool.query(
    q.getUnidadesByOwner,
    [user.id]
  );

  return rows;
};


// =========================
// ACTUALIZAR
// =========================

export const update = async (
  id,
  data,
  user
) => {

  // =========================
  // OBTENER UNIDAD
  // =========================

  const { rows } = await pool.query(
    q.getUnidadById,
    [id]
  );

  const unidad = rows[0];

  if (!unidad) {
    return null;
  }


  // =========================
  // OBTENER ALOJAMIENTO
  // =========================

  const { rows: alojamientoRows } = await pool.query(
    q.getAlojamientoOwner,
    [unidad.id_alojamiento]
  );

  const alojamiento = alojamientoRows[0];

  if (!alojamiento) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // VALIDAR OWNER
  // =========================

  const isOwner =
    alojamiento.id_anfitrion === user.id;

  const isAdmin =
    user.rol === 'admin';


  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // DATOS
  // =========================

  const {
    nombre,
    tipo,
    descripcion,
    capacidad,
    es_compartido,
    precio_noche
  } = data;


  const cupos_disponibles = capacidad;


  // =========================
  // UPDATE
  // =========================

  const { rows: updatedRows } = await pool.query(
    q.updateUnidad,
    [
      nombre,
      tipo,
      descripcion,
      capacidad,
      cupos_disponibles,
      es_compartido,
      precio_noche,
      'pendiente_revision',
      id
    ]
  );

  return updatedRows[0];
};


// =========================
// ELIMINAR
// =========================

export const remove = async (
  id,
  user
) => {

  // =========================
  // OBTENER UNIDAD
  // =========================

  const { rows } = await pool.query(
    q.getUnidadById,
    [id]
  );

  const unidad = rows[0];

  if (!unidad) {
    return null;
  }


  // =========================
  // OBTENER ALOJAMIENTO
  // =========================

  const { rows: alojamientoRows } = await pool.query(
    q.getAlojamientoOwner,
    [unidad.id_alojamiento]
  );

  const alojamiento = alojamientoRows[0];

  if (!alojamiento) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // VALIDAR OWNER
  // =========================

  const isOwner =
    alojamiento.id_anfitrion === user.id;

  const isAdmin =
    user.rol === 'admin';


  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN');
  }


  // =========================
  // DELETE
  // =========================

  await pool.query(
    q.deleteUnidad,
    [id]
  );

  return {
    message: 'Eliminado correctamente'
  };
};