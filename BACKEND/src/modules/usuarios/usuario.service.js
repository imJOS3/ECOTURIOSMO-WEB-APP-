import pool from '../../config/database.js';
import bcrypt from 'bcrypt';
import cloudinary from '../../config/cloudinary.js';
import { normalizePhone } from '../auth/auth.validation.js';

const USER_SAFE_COLS =
  'id, nombre, email, rol, avatar_url, telefono, fecha_nacimiento, ciudad, created_at';

// obtener todos
export const getUsers = async () => {
  const { rows } = await pool.query(
    `SELECT ${USER_SAFE_COLS} FROM usuario`
  );
  return rows;
};

// obtener uno
export const getUser = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${USER_SAFE_COLS} FROM usuario WHERE id = $1`,
    [id]
  );
  return rows[0];
};

// crear
export const createUserService = async ({ nombre, email, password, rol }) => {
  const hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO usuario(nombre,email,password_hash,rol)
     VALUES($1,$2,$3,$4)
     RETURNING ${USER_SAFE_COLS}`,
    [nombre, email, hash, rol || 'turista']
  );

  return rows[0];
};

// actualizar
export const updateUserService = async (id, data) => {
  const nombre = String(data.nombre || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const rol = data.rol;
  const telefono = data.telefono != null ? normalizePhone(data.telefono) : null;
  const ciudad = data.ciudad != null ? String(data.ciudad).trim() : null;
  const fecha_nacimiento = data.fecha_nacimiento
    ? String(data.fecha_nacimiento).trim()
    : null;

  if (!nombre || nombre.length < 3) {
    throw { status: 400, message: 'El nombre debe tener al menos 3 caracteres.' };
  }
  if (!email || !email.includes('@')) {
    throw { status: 400, message: 'Correo inválido.' };
  }

  const { rows } = await pool.query(
    `UPDATE usuario
     SET nombre=$1,
         email=$2,
         rol=$3,
         telefono=COALESCE($4, telefono),
         fecha_nacimiento=COALESCE($5, fecha_nacimiento),
         ciudad=COALESCE($6, ciudad)
     WHERE id=$7
     RETURNING ${USER_SAFE_COLS}`,
    [
      nombre,
      email,
      rol,
      telefono || null,
      fecha_nacimiento || null,
      ciudad || null,
      id,
    ]
  );

  return rows[0];
};

// actualizar foto de perfil
export const updateAvatarService = async (id, { url, public_id }) => {
  const current = await pool.query(
    'SELECT avatar_public_id FROM usuario WHERE id = $1',
    [id]
  );

  if (!current.rows[0]) {
    await cloudinary.uploader.destroy(public_id).catch(() => {});
    return null;
  }

  const prevPublicId = current.rows[0].avatar_public_id;

  const { rows } = await pool.query(
    `UPDATE usuario
     SET avatar_url = $1, avatar_public_id = $2
     WHERE id = $3
     RETURNING ${USER_SAFE_COLS}`,
    [url, public_id, id]
  );

  if (prevPublicId && prevPublicId !== public_id) {
    await cloudinary.uploader.destroy(prevPublicId).catch(() => {});
  }

  return rows[0];
};

// eliminar foto de perfil
export const deleteAvatarService = async (id) => {
  const { rows } = await pool.query(
    'SELECT avatar_public_id FROM usuario WHERE id = $1',
    [id]
  );

  if (!rows[0]) return null;

  const publicId = rows[0].avatar_public_id;

  const { rows: updated } = await pool.query(
    `UPDATE usuario
     SET avatar_url = NULL, avatar_public_id = NULL
     WHERE id = $1
     RETURNING ${USER_SAFE_COLS}`,
    [id]
  );

  if (publicId) {
    await cloudinary.uploader.destroy(publicId).catch(() => {});
  }

  return updated[0];
};

// eliminar
export const deleteUserService = async (id) => {
  await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
  return { message: 'Usuario eliminado' };
};
