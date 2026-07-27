// alojamiento.service.js

import pool from '../../config/database.js';
import * as q from './alojamiento.queries.js';
import * as imagenService from './alojamiento-imagen/alojamiento-imagen.service.js';
import * as categoriaRelations from '../categorias/categoria.relations.service.js';
import * as servicioRelations from '../servicios/servicio.relations.service.js';

const attachRelations = async (alojamiento) => {
  const conCategorias = await categoriaRelations.attachAlojamientoCategorias(alojamiento);
  const conServicios = await servicioRelations.attachAlojamientoServicios(conCategorias);
  const imagenes = await imagenService.getByAlojamiento(alojamiento.id);
  return { ...conServicios, imagenes };
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const create = async (data, user) => {
  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud,
    precio_noche,
    capacidad,
    es_compartido = false,
    cupos_disponibles,
    habitaciones,
    camas,
    banos,
    categorias,
    servicios = []
  } = data;

  await categoriaRelations.validateCategoriasExist(categorias, 'alojamiento');
  await servicioRelations.validateServiciosExist(servicios);

  const { rows } = await pool.query(
    q.createAlojamiento,
    [
      user.id,
      titulo,
      descripcion,
      ubicacion,
      latitud || null,
      longitud || null,
      precio_noche,
      capacidad,
      Boolean(es_compartido),
      toNumberOrNull(cupos_disponibles),
      toNumberOrNull(habitaciones),
      toNumberOrNull(camas),
      toNumberOrNull(banos),
      'pendiente_revision'
    ]
  );

  await categoriaRelations.setAlojamientoCategorias(rows[0].id, categorias);
  await servicioRelations.setAlojamientoServicios(rows[0].id, servicios);

  return attachRelations(rows[0]);
};

export const getAll = async (user = null) => {
  if (user && user.rol === 'admin') {
    const { rows } = await pool.query(q.getAllAlojamientosAll);
    return Promise.all(rows.map(attachRelations));
  }
  if (user && user.rol === 'anfitrion') {
    const { rows } = await pool.query(q.getByAnfitrion, [user.id]);
    return Promise.all(rows.map(attachRelations));
  }
  const { rows } = await pool.query(q.getAllAlojamientos);
  return Promise.all(rows.map(attachRelations));
};

export const getById = async (id, user = null) => {
  const { rows } = await pool.query(q.getAlojamientoByIdAny, [id]);
  const alojamiento = rows[0];
  if (!alojamiento) return null;

  if (user && user.rol === 'admin') {
    return attachRelations(alojamiento);
  }

  if (user && user.rol === 'anfitrion') {
    if (alojamiento.id_anfitrion === user.id) {
      return attachRelations(alojamiento);
    }
    if (alojamiento.estado === 'aprobado') {
      return attachRelations(alojamiento);
    }
    return null;
  }

  if (alojamiento.estado === 'aprobado') {
    return attachRelations(alojamiento);
  }

  return null;
};

export const getMyAlojamientos = async (user) => {
  const { rows } = await pool.query(q.getByAnfitrion, [user.id]);
  return Promise.all(rows.map(attachRelations));
};

export const update = async (id, data) => {
  const {
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud,
    precio_noche,
    capacidad,
    es_compartido = false,
    cupos_disponibles,
    habitaciones,
    camas,
    banos,
    categorias,
    servicios = []
  } = data;

  await categoriaRelations.validateCategoriasExist(categorias, 'alojamiento');
  await servicioRelations.validateServiciosExist(servicios);

  const { rows } = await pool.query(q.updateAlojamiento, [
    titulo,
    descripcion,
    ubicacion,
    latitud || null,
    longitud || null,
    precio_noche,
    capacidad,
    Boolean(es_compartido),
    toNumberOrNull(cupos_disponibles),
    toNumberOrNull(habitaciones),
    toNumberOrNull(camas),
    toNumberOrNull(banos),
    id
  ]);

  await categoriaRelations.setAlojamientoCategorias(rows[0].id, categorias);
  await servicioRelations.setAlojamientoServicios(rows[0].id, servicios);

  return attachRelations(rows[0]);
};

export const remove = async (id) => {
  const imagenes = await imagenService.getByAlojamiento(id);
  await Promise.all(imagenes.map((img) => imagenService.remove(img.id)));

  await categoriaRelations.setAlojamientoCategorias(id, []);

  await pool.query(q.deleteAlojamiento, [id]);

  return { message: 'Eliminado correctamente' };
};
