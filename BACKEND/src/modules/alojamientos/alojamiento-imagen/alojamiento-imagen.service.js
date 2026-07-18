import pool from '../../../config/database.js';

import * as q from './alojamiento-imagen.queries.js';

import cloudinary from '../../../config/cloudinary.js';

// =========================
// ACTUALIZAR
// =========================

export const update = async (id, data) => {
  const { url, public_id } = data;

  const { rows } = await pool.query(q.getImagenById, [id]);
  const imagenActual = rows[0];

  if (!imagenActual) {
    // la imagen no existe: borramos la que se acaba de subir, no sirve de nada
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    return null;
  }

  try {
    const { rows: updatedRows } = await pool.query(
      q.updateAlojamientoImagen,
      [url, public_id, id]
    );

    // solo borramos la imagen vieja de Cloudinary si el update en BD fue exitoso
    await cloudinary.uploader.destroy(imagenActual.public_id).catch(() => {});

    return updatedRows[0];
  } catch (err) {
    // si falla el update, borramos la nueva imagen que subimos por error
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    throw err;
  }
};

// =========================
// CREAR
// =========================

export const create = async (data) => {
  const { id_alojamiento, url, public_id } = data;

  try {
    const { rows } = await pool.query(
      q.createAlojamientoImagen,
      [id_alojamiento, url, public_id]
    );
    return rows[0];
  } catch (err) {
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    throw err;
  }
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