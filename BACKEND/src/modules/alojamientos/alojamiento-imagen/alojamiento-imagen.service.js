import pool from '../../../config/database.js';

import * as q from './alojamiento-imagen.queries.js';

import cloudinary from '../../../config/cloudinary.js';


// =========================
// CREAR
// =========================

export const create = async (data) => {

  const {
    id_alojamiento,
    url,
    public_id
  } = data;

  const { rows } = await pool.query(
    q.createAlojamientoImagen,
    [
      id_alojamiento,
      url,
      public_id
    ]
  );

  return rows[0];
};


// =========================
// OBTENER POR ALOJAMIENTO
// =========================

export const getByAlojamiento = async (
  id_alojamiento
) => {

  const { rows } = await pool.query(
    q.getImagenesByAlojamiento,
    [id_alojamiento]
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
    q.deleteAlojamientoImagen,
    [id]
  );

  return {
    message: 'Imagen eliminada'
  };
};