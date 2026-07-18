// alojamiento.service.js

import pool from '../../config/database.js';
import * as q from './alojamiento.queries.js';
import * as imagenService from './alojamiento-imagen/alojamiento-imagen.service.js';
import * as categoriaRelations from '../categorias/categoria.relations.service.js';

export const create = async (data, user) => {

  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud,
    categorias
  } = data;

  await categoriaRelations.validateCategoriasExist(
    categorias,
    'alojamiento'
  );

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

  await categoriaRelations.setAlojamientoCategorias(
    rows[0].id,
    categorias
  );

  return categoriaRelations.attachAlojamientoCategorias(
    rows[0]
  );
};

export const getAll = async (user = null) => {
  // ADMIN
  if (user && user.rol === 'admin') {
    const { rows } = await pool.query(q.getAllAlojamientosAll);
    return Promise.all(rows.map(categoriaRelations.attachAlojamientoCategorias));
  }
  // ANFITRION -> solo los suyos
  if (user && user.rol === 'anfitrion') {
    const { rows } = await pool.query(q.getByAnfitrion, [user.id]); // ← corregido
    return Promise.all(rows.map(categoriaRelations.attachAlojamientoCategorias));
  }
  // TURISTA / PUBLICO
  const { rows } = await pool.query(q.getAllAlojamientos);
  return Promise.all(rows.map(categoriaRelations.attachAlojamientoCategorias));
};

export const getById = async (id, user = null) => {
  const { rows } = await pool.query(q.getAlojamientoByIdAny, [id]);
  const alojamiento = rows[0];
  if (!alojamiento) return null;

  if (user && user.rol === 'admin') {
    return categoriaRelations.attachAlojamientoCategorias(alojamiento);
  }

  if (user && user.rol === 'anfitrion') {
    if (alojamiento.id_anfitrion === user.id) {
      return categoriaRelations.attachAlojamientoCategorias(alojamiento);
    }
    if (alojamiento.estado === 'aprobado') {
      return categoriaRelations.attachAlojamientoCategorias(alojamiento);
    }
    return null;
  }

  if (alojamiento.estado === 'aprobado') {
    const { rows: unidadRows } = await pool.query(q.hasApprovedUnit, [id]);
    if (unidadRows.length > 0) {
      return categoriaRelations.attachAlojamientoCategorias(alojamiento);
    }
  }

  return null;
};

export const getMyAlojamientos = async (user) => {
  const { rows } = await pool.query(q.getByAnfitrion, [user.id]);
  return Promise.all(rows.map(categoriaRelations.attachAlojamientoCategorias));
};

export const update = async (id, data) => {
  const { titulo, descripcion, ubicacion, latitud, longitud, categorias } = data;
  const { rows } = await pool.query(q.updateAlojamiento, [
    titulo, descripcion, ubicacion, latitud, longitud, id
  ]);

  await categoriaRelations.setAlojamientoCategorias(rows[0].id, categorias);

  return categoriaRelations.attachAlojamientoCategorias(rows[0]);
};


export const remove = async (id) => {
  // 1. Borrar todas las imágenes (Cloudinary + BD) reutilizando la lógica existente
  const imagenes = await imagenService.getByAlojamiento(id);
  await Promise.all(imagenes.map((img) => imagenService.remove(img.id)));

  // 2. Borrar relaciones de categorías
  await categoriaRelations.setAlojamientoCategorias(id, []);

  // 3. Borrar el alojamiento
  await pool.query(q.deleteAlojamiento, [id]);

  return { message: 'Eliminado correctamente' };
};