import pool from '../../../config/database.js';

import * as q from './unidad-imagen.queries.js';

import cloudinary from '../../../config/cloudinary.js';


// =========================
// CREAR
// =========================

export const create = async (data) => {

  const {
    id_unidad,
    url,
    public_id
  } = data;

  const { rows } = await pool.query(
    q.createUnidadImagen,
    [
      id_unidad,
      url,
      public_id
    ]
  );

  return rows[0];
};


// =========================
// OBTENER POR UNIDAD
// =========================

export const getByUnidad = async (
  id_unidad
) => {

  const { rows } = await pool.query(
    q.getImagenesByUnidad,
    [id_unidad]
  );

  return rows;
};


// =========================
// ELIMINAR
// =========================

export const remove = async (
  id
) => {

  const { rows } = await pool.query(
    q.getImagenById,
    [id]
  );

  const imagen = rows[0];

  if (!imagen) {
    return null;
  }

  // eliminar cloudinary
  await cloudinary.uploader.destroy(
    imagen.public_id
  );

  // eliminar db
  await pool.query(
    q.deleteUnidadImagen,
    [id]
  );

  return {
    message: 'Imagen eliminada'
  };
};