import pool from '../../config/database.js';
import * as q from './unidad.queries.js';

export const create = async (data) => {
  const {
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    precio_noche
  } = data;

  const { rows } = await pool.query(q.createUnidad, [
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    precio_noche
  ]);

  return rows[0];
};

export const getByAlojamiento = async (id) => {
  const { rows } = await pool.query(
    q.getUnidadesByAlojamiento,
    [id]
  );

  return rows;
};