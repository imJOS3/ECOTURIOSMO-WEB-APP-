import pool from '../../config/database.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.js';
import { validateRegisterPayload } from './auth.validation.js';
import { verifyGoogleCredential } from './google.service.js';

const SALT_ROUNDS = 10;
const ROLES_VALIDOS = ['turista', 'anfitrion', 'admin'];

const USER_SAFE_COLS =
  'id, nombre, email, rol, avatar_url, telefono, fecha_nacimiento, ciudad, auth_provider, created_at';

const toSafeUser = (user) => {
  if (!user) return null;
  const {
    password_hash,
    avatar_public_id,
    tipo_documento,
    numero_documento,
    google_id,
    ...userSafe
  } = user;
  return userSafe;
};

/**
 * Registrar usuario
 */
export const register = async (body) => {
  const validated = validateRegisterPayload(body);
  if (validated.error) {
    throw { status: 400, message: validated.error };
  }

  const {
    nombre,
    email,
    password,
    telefono,
    fecha_nacimiento,
    ciudad,
    rol,
  } = validated.data;

  const existsEmail = await pool.query(
    'SELECT id FROM usuario WHERE email=$1',
    [email]
  );
  if (existsEmail.rows.length > 0) {
    throw { status: 409, message: 'El usuario ya existe' };
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const rolFinal = ROLES_VALIDOS.includes(rol) ? rol : 'turista';

  try {
    const result = await pool.query(
      `INSERT INTO usuario(
         nombre, email, password_hash, rol,
         telefono, fecha_nacimiento, ciudad, acepta_terminos_at, auth_provider
       )
       VALUES($1,$2,$3,$4,$5,$6,$7,NOW(),'local')
       RETURNING ${USER_SAFE_COLS}`,
      [
        nombre,
        email,
        hash,
        rolFinal,
        telefono,
        fecha_nacimiento,
        ciudad,
      ]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      throw { status: 409, message: 'El email ya está registrado' };
    }
    throw err;
  }
};

/**
 * Login usuario
 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email y contraseña requeridos' };
  }

  const emailLower = email.toLowerCase();

  const result = await pool.query(
    'SELECT * FROM usuario WHERE email=$1',
    [emailLower]
  );

  const user = result.rows[0];

  if (!user) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  if (!user.password_hash) {
    throw {
      status: 401,
      message: 'Esta cuenta usa Google. Continúa con Google para ingresar.',
    };
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  const token = generateToken({
    id: user.id,
    rol: user.rol,
  });

  return {
    user: toSafeUser(user),
    token,
  };
};

/**
 * Login / registro con Google Identity Services (credential JWT)
 */
export const loginWithGoogle = async ({ credential, rol }) => {
  const profile = await verifyGoogleCredential(credential);
  const rolFinal = ROLES_VALIDOS.includes(rol) ? rol : 'turista';

  // 1) Ya vinculado por google_id
  let result = await pool.query(
    'SELECT * FROM usuario WHERE google_id = $1',
    [profile.googleId]
  );
  let user = result.rows[0];

  // 2) Misma cuenta por email → vincular Google
  if (!user) {
    result = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [profile.email]
    );
    user = result.rows[0];

    if (user) {
      const { rows } = await pool.query(
        `UPDATE usuario
         SET google_id = $1,
             auth_provider = CASE
               WHEN auth_provider = 'local' THEN auth_provider
               ELSE 'google'
             END,
             avatar_url = COALESCE(avatar_url, $2),
             nombre = COALESCE(NULLIF(nombre, ''), $3)
         WHERE id = $4
         RETURNING *`,
        [profile.googleId, profile.avatarUrl, profile.nombre, user.id]
      );
      user = rows[0];
    }
  }

  // 3) Usuario nuevo
  if (!user) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO usuario(
           nombre, email, password_hash, rol, avatar_url,
           auth_provider, google_id, acepta_terminos_at
         )
         VALUES($1,$2,NULL,$3,$4,'google',$5,NOW())
         RETURNING *`,
        [
          profile.nombre,
          profile.email,
          rolFinal === 'admin' ? 'turista' : rolFinal,
          profile.avatarUrl,
          profile.googleId,
        ]
      );
      user = rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw { status: 409, message: 'El email ya está registrado' };
      }
      throw err;
    }
  }

  const token = generateToken({
    id: user.id,
    rol: user.rol,
  });

  return {
    user: toSafeUser(user),
    token,
  };
};
