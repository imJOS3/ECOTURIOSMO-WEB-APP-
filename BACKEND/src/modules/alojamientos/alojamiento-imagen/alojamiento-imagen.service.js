import pool from '../../../config/database.js';
import * as q from './alojamiento-imagen.queries.js';
import cloudinary from '../../../config/cloudinary.js';

const normalizeEspacio = (espacio) =>
  q.ESPACIOS_IMAGEN.includes(espacio) ? espacio : q.DEFAULT_ESPACIO;

// =========================
// ACTUALIZAR ARCHIVO
// =========================

export const update = async (id, data) => {
  const { url, public_id } = data;

  const { rows } = await pool.query(q.getImagenById, [id]);
  const imagenActual = rows[0];

  if (!imagenActual) {
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    return null;
  }

  try {
    const { rows: updatedRows } = await pool.query(
      q.updateAlojamientoImagen,
      [url, public_id, id]
    );

    await cloudinary.uploader.destroy(imagenActual.public_id).catch(() => {});

    return updatedRows[0];
  } catch (err) {
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    throw err;
  }
};

// =========================
// ACTUALIZAR ESPACIO
// =========================

export const updateEspacio = async (id, espacio) => {
  const { rows } = await pool.query(
    q.updateAlojamientoImagenEspacio,
    [normalizeEspacio(espacio), id]
  );
  return rows[0] || null;
};

// =========================
// CREAR
// =========================

export const create = async (data) => {
  const { id_alojamiento, url, public_id, espacio } = data;

  try {
    const { rows } = await pool.query(
      q.createAlojamientoImagen,
      [id_alojamiento, url, public_id, normalizeEspacio(espacio)]
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

export const getByAlojamiento = async (id_alojamiento) => {
  const { rows } = await pool.query(
    q.getImagenesByAlojamiento,
    [id_alojamiento]
  );
  return rows;
};

// =========================
// ELIMINAR
// =========================

export const remove = async (id) => {
  const { rows } = await pool.query(q.getImagenById, [id]);
  const imagen = rows[0];

  if (!imagen) {
    return null;
  }

  await cloudinary.uploader.destroy(imagen.public_id);

  await pool.query(q.deleteAlojamientoImagen, [id]);

  return { message: 'Imagen eliminada' };
};
