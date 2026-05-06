import pool from '../../config/database.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.js';

const SALT_ROUNDS = 10;
const ROLES_VALIDOS = ['turista', 'anfitrion', 'admin'];

/**
 * Registrar usuario
 */
export const register = async ({ nombre, email, password, rol }) => {
  // 🔍 Validaciones básicas
  if (!nombre || !email || !password) {
    throw { status: 400, message: 'Datos incompletos' };
  }

  // 🔒 Normalizar email
  const emailLower = email.toLowerCase();

  // 🔎 Verificar si ya existe
  const exists = await pool.query(
    'SELECT id FROM usuario WHERE email=$1',
    [emailLower]
  );

  if (exists.rows.length > 0) {
    throw { status: 409, message: 'El usuario ya existe' };
  }

  //  Hash de contraseña
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  //  Validar rol (por defecto turista)
  const rolFinal = ROLES_VALIDOS.includes(rol) ? rol : 'turista';

  //  Insertar usuario
  const result = await pool.query(
    `INSERT INTO usuario(nombre,email,password_hash,rol)
     VALUES($1,$2,$3,$4)
     RETURNING id, nombre, email, rol`,
    [nombre, emailLower, hash, rolFinal]
  );

  return result.rows[0];
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

  //  No revelar si el usuario existe o no
  if (!user) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw { status: 401, message: 'Credenciales inválidas' };
  }

  //  Generar token
  const token = generateToken({
    id: user.id,
    rol: user.rol
  });

  //  No devolver password
  const { password_hash, ...userSafe } = user;

  return {
    user: userSafe,
    token
  };
};