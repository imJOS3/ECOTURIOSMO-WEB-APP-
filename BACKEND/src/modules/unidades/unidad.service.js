// unidad.service.js

import pool from '../../config/database.js';
import * as q from './unidad.queries.js';
import * as categoriaRelations from '../categorias/categoria.relations.service.js';
import * as imagenService from './unidad-imagen/unidad-imagen.service.js';

// ─── NUEVO: helper que adjunta categorías + imágenes en un solo paso ───────
const attachRelations = async (unidad) => {
  const conCategorias = await categoriaRelations.attachUnidadCategorias(unidad);
  const imagenes = await imagenService.getByUnidad(unidad.id);
  return { ...conCategorias, imagenes };
};

// =========================
// CREAR
// =========================
export const create = async (data, user) => {
  const {
    id_alojamiento, nombre, tipo, descripcion, capacidad,
    precio_noche, cupos_disponibles, es_compartido, categorias
  } = data;

  await categoriaRelations.validateCategoriasExist(categorias, 'unidad');

  const { rows: alojamientoRows } = await pool.query(q.getAlojamientoOwner, [id_alojamiento]);
  const alojamiento = alojamientoRows[0];

  if (!alojamiento) throw new Error('ALOJAMIENTO_NOT_FOUND');

  const isOwner = alojamiento.id_anfitrion === user.id;
  const isAdmin = user.rol === 'admin';

  if (!isOwner && !isAdmin) throw new Error('FORBIDDEN');

  const { rows } = await pool.query(
    q.createUnidad,
    [id_alojamiento, nombre, tipo, descripcion, capacidad, cupos_disponibles || capacidad, es_compartido, precio_noche, 'pendiente_revision']
  );

  await categoriaRelations.setUnidadCategorias(rows[0].id, categorias);

  return attachRelations(rows[0]);   // ← antes: categoriaRelations.attachUnidadCategorias(rows[0])
};

// =========================
// OBTENER POR ALOJAMIENTO
// =========================
export const getByAlojamiento = async (id, user = null) => {
  id = Number(id);
  if (isNaN(id)) throw new Error('INVALID_ID');

  if (user && user.rol === 'admin') {
    const { rows } = await pool.query(q.getUnidadesAll, [id]);
    return Promise.all(rows.map(attachRelations));   // ← antes: attachUnidadCategorias
  }

  if (user && user.rol === 'anfitrion') {
    const { rows } = await pool.query(q.getUnidadesForAnfitrion, [id, user.id]);
    return Promise.all(rows.map(attachRelations));
  }

  const { rows } = await pool.query(q.getUnidadesAprobadas, [id]);
  return Promise.all(rows.map(attachRelations));
};

// =========================
// OBTENER UNA
// =========================
export const getById = async (id, user = null) => {
  const { rows } = await pool.query(q.getUnidadById, [id]);
  const unidad = rows[0];
  if (!unidad) return null;

  if (user && user.rol === 'admin') {
    return attachRelations(unidad);
  }

  if (!user || user.rol === 'turista') {
    if (unidad.estado === 'aprobado') {
      return attachRelations(unidad);
    }
    return null;
  }

  if (user.rol === 'anfitrion') {
    const { rows: alojamientoRows } = await pool.query(q.getAlojamientoOwner, [unidad.id_alojamiento]);
    const alojamiento = alojamientoRows[0];
    const isOwner = alojamiento.id_anfitrion === user.id;

    if (isOwner) {
      return attachRelations(unidad);
    }
    if (unidad.estado === 'aprobado') {
      return attachRelations(unidad);
    }
    return null;
  }

  return null;
};

// =========================
// MIS UNIDADES
// =========================
export const getMine = async (user) => {
  const { rows } = await pool.query(q.getUnidadesByOwner, [user.id]);
  return Promise.all(rows.map(attachRelations));
};

// =========================
// ACTUALIZAR
// =========================
export const update = async (id, data, user) => {
  const { rows } = await pool.query(q.getUnidadById, [id]);
  const unidad = rows[0];
  if (!unidad) return null;

  const { rows: alojamientoRows } = await pool.query(q.getAlojamientoOwner, [unidad.id_alojamiento]);
  const alojamiento = alojamientoRows[0];
  if (!alojamiento) throw new Error('FORBIDDEN');

  const isOwner = alojamiento.id_anfitrion === user.id;
  const isAdmin = user.rol === 'admin';
  if (!isOwner && !isAdmin) throw new Error('FORBIDDEN');

  const { nombre, tipo, descripcion, capacidad, es_compartido, precio_noche, categorias } = data;

  await categoriaRelations.validateCategoriasExist(categorias, 'unidad');

  const cupos_disponibles = capacidad;

  const { rows: updatedRows } = await pool.query(
    q.updateUnidad,
    [nombre, tipo, descripcion, capacidad, cupos_disponibles, es_compartido, precio_noche, 'pendiente_revision', id]
  );

  await categoriaRelations.setUnidadCategorias(updatedRows[0].id, categorias);

  return attachRelations(updatedRows[0]);
};

// =========================
// ELIMINAR
// =========================
export const remove = async (id, user) => {
  const { rows } = await pool.query(q.getUnidadById, [id]);
  const unidad = rows[0];
  if (!unidad) return null;

  const { rows: alojamientoRows } = await pool.query(q.getAlojamientoOwner, [unidad.id_alojamiento]);
  const alojamiento = alojamientoRows[0];
  if (!alojamiento) throw new Error('FORBIDDEN');

  const isOwner = alojamiento.id_anfitrion === user.id;
  const isAdmin = user.rol === 'admin';
  if (!isOwner && !isAdmin) throw new Error('FORBIDDEN');

  const imagenes = await imagenService.getByUnidad(id);
  await Promise.all(imagenes.map((img) => imagenService.remove(img.id)));

  await categoriaRelations.setUnidadCategorias(id, []);
  await pool.query(q.deleteUnidad, [id]);

  return { message: 'Eliminado correctamente' };
};