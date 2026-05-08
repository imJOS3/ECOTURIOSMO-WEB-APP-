import pool from '../../config/database.js';
import * as q from './unidad.queries.js';

export const create = async (data) => {
  const {
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    es_compartido,
    precio_noche
  } = data;

  // inicialmente los cupos disponibles
  // son iguales a la capacidad
  const cupos_disponibles = capacidad;

  const { rows } = await pool.query(q.createUnidad, [
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    cupos_disponibles,
    es_compartido,
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