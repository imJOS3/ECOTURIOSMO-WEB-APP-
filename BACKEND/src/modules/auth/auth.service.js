import pool from '../../config/database.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.js';

export const register = async ({ nombre, email, password }) => {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuario(nombre,email,password_hash,rol)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [nombre, email, hash, 'turista']
  );

  return result.rows[0];
};

export const login = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT * FROM usuario WHERE email=$1',
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error('Usuario no encontrado');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Credenciales inválidas');

  const token = generateToken({
    id: user.id,
    rol: user.rol
  });

  return { user, token };
};