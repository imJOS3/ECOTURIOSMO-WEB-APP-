import pool from '../../config/database.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.js';
import { validateRegisterPayload } from './auth.validation.js';

const SALT_ROUNDS = 10;
const ROLES_VALIDOS = ['turista', 'anfitrion', 'admin'];

const USER_SAFE_COLS =
  'id, nombre, email, rol, avatar_url, telefono, fecha_nacimiento, ciudad, created_at';

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
         telefono, fecha_nacimiento, ciudad, acepta_terminos_at
       )
       VALUES($1,$2,$3,$4,$5,$6,$7,NOW())
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

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  const token = generateToken({
    id: user.id,
    rol: user.rol,
  });

  const {
    password_hash,
    avatar_public_id,
    tipo_documento,
    numero_documento,
    ...userSafe
  } = user;

  return {
    user: userSafe,
    token,
  };
};
