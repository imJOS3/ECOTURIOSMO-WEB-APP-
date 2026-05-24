// unidad.service.js

import pool from '../../config/database.js';

import * as q from './unidad.queries.js';

import * as categoriaRelations from '../categorias/categoria.relations.service.js';


// =========================
// CREAR
// =========================

export const create = async (
  data,
  user
) => {

  const {
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    precio_noche,
    cupos_disponibles,
    es_compartido,
    categorias
  } = data;


  // =========================
  // VALIDAR CATEGORIAS
  // =========================

  await categoriaRelations.validateCategoriasExist(
    categorias,
    'unidad'
  );


  // =========================
  // VALIDAR ALOJAMIENTO
  // =========================

  const { rows: alojamientoRows } = await pool.query(
    q.getAlojamientoOwner,
    [id_alojamiento]
  );

  const alojamiento = alojamientoRows[0];

  if (!alojamiento) {
    throw new Error('ALOJAMIENTO_NOT_FOUND');
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
      cupos_disponibles || capacidad,
      es_compartido,
      precio_noche,
      'pendiente_revision'
    ]
  );


  // =========================
  // CATEGORIAS
  // =========================

  await categoriaRelations.setUnidadCategorias(
    rows[0].id,
    categorias
  );


  return categoriaRelations.attachUnidadCategorias(
    rows[0]
  );
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

    return Promise.all(
      rows.map(
        categoriaRelations.attachUnidadCategorias
      )
    );
  }


  // =========================
  // ANFITRION
  // =========================

  if (user && user.rol === 'anfitrion') {

    const { rows } = await pool.query(
      q.getUnidadesForAnfitrion,
      [id, user.id]
    );

    return Promise.all(
      rows.map(
        categoriaRelations.attachUnidadCategorias
      )
    );
  }


  // =========================
  // PUBLICO / TURISTA
  // =========================

  const { rows } = await pool.query(
    q.getUnidadesAprobadas,
    [id]
  );

  return Promise.all(
    rows.map(
      categoriaRelations.attachUnidadCategorias
    )
  );
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

    return categoriaRelations.attachUnidadCategorias(
      unidad
    );
  }


  // =========================
  // PUBLICO / TURISTA
  // =========================

  if (!user || user.rol === 'turista') {

    if (unidad.estado === 'aprobado') {

      return categoriaRelations.attachUnidadCategorias(
        unidad
      );
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

      return categoriaRelations.attachUnidadCategorias(
        unidad
      );
    }


    // de otros solo aprobado
    if (unidad.estado === 'aprobado') {

      return categoriaRelations.attachUnidadCategorias(
        unidad
      );
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

  return Promise.all(
    rows.map(
      categoriaRelations.attachUnidadCategorias
    )
  );
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
    precio_noche,
    categorias
  } = data;


  // =========================
  // VALIDAR CATEGORIAS
  // =========================

  await categoriaRelations.validateCategoriasExist(
    categorias,
    'unidad'
  );


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


  // =========================
  // ACTUALIZAR CATEGORIAS
  // =========================

  await categoriaRelations.setUnidadCategorias(
    updatedRows[0].id,
    categorias
  );


  return categoriaRelations.attachUnidadCategorias(
    updatedRows[0]
  );
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

  await categoriaRelations.setUnidadCategorias(
    id,
    []
  );

  await pool.query(
    q.deleteUnidad,
    [id]
  );

  return {
    message: 'Eliminado correctamente'
  };
};