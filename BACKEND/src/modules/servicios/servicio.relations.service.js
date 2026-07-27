import pool from '../../config/database.js';
import * as q from './servicio.relations.queries.js';

const normalizeServicioIds = (servicios) => {
  if (servicios === undefined || servicios === null) {
    return undefined;
  }

  if (!Array.isArray(servicios)) {
    return [];
  }

  return [
    ...new Set(
      servicios
        .map((servicio) => Number(servicio))
        .filter((servicioId) => Number.isInteger(servicioId) && servicioId > 0)
    )
  ];
};

export const setAlojamientoServicios = async (id, servicios) => {
  const servicioIds = normalizeServicioIds(servicios);

  if (servicioIds === undefined) {
    return null;
  }

  await pool.query(q.deleteAlojamientoServicios, [id]);

  for (const servicioId of servicioIds) {
    await pool.query(q.insertAlojamientoServicio, [id, servicioId]);
  }

  return servicioIds;
};

export const getAlojamientoServicios = async (id) => {
  const { rows } = await pool.query(q.getAlojamientoServicios, [id]);
  return rows;
};

export const attachAlojamientoServicios = async (alojamiento) => ({
  ...alojamiento,
  servicios: await getAlojamientoServicios(alojamiento.id)
});

export const validateServiciosExist = async (servicios = []) => {
  if (servicios === undefined || servicios === null) {
    return true;
  }

  if (!Array.isArray(servicios)) {
    throw new Error('Los servicios deben ser un arreglo');
  }

  if (servicios.length === 0) {
    return true;
  }

  const { rows } = await pool.query(
    `
    SELECT id
    FROM servicio
    WHERE id = ANY($1)
    `,
    [servicios]
  );

  if (rows.length !== servicios.length) {
    throw new Error('Uno o más servicios son inválidos');
  }

  return true;
};
