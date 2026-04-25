import pool from '../../config/database.js';
import bcrypt from 'bcrypt';


// obtener todos
export const getUsers = async () => {
  const { rows } = await pool.query(
    'SELECT id, nombre, email, rol FROM usuario'
  );
  return rows;
};


// obtener uno
export const getUser = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, email, rol FROM usuario WHERE id = $1',
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
     RETURNING id,nombre,email,rol`,
    [nombre, email, hash, rol || 'turista']
  );

  return rows[0];
};


// actualizar
export const updateUserService = async (id, data) => {
  const { nombre, email, rol } = data;

  const { rows } = await pool.query(
    `UPDATE usuario
     SET nombre=$1, email=$2, rol=$3
     WHERE id=$4
     RETURNING id,nombre,email,rol`,
    [nombre, email, rol, id]
  );

  return rows[0];
};


// eliminar
export const deleteUserService = async (id) => {
  await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
  return { message: 'Usuario eliminado' };
};