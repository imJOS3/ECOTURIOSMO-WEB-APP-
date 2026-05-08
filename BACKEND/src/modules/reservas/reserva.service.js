import pool from '../../config/database.js';
import * as q from './reserva.queries.js';

export const create = async (data, user) => {

  const {
    id_unidad,
    fecha_inicio,
    fecha_fin
  } = data;

  // ✅ validar fechas
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  if (inicio >= fin) {
    throw {
      status: 400,
      message: 'Invalid reservation dates'
    };
  }

  // ✅ obtener unidad
  const unidadResult = await pool.query(
    q.getUnidadById,
    [id_unidad]
  );

  const unidad = unidadResult.rows[0];

  if (!unidad) {
    throw {
      status: 404,
      message: 'Unit not found'
    };
  }

  // ✅ validar disponible
  if (!unidad.disponible) {
    throw {
      status: 400,
      message: 'Unit not available'
    };
  }

  // 🔒 UNIDAD PRIVADA
  if (!unidad.es_compartido) {

    const overlap = await pool.query(
      q.checkReservaOverlap,
      [id_unidad, fecha_inicio, fecha_fin]
    );

    if (overlap.rows.length > 0) {
      throw {
        status: 400,
        message: 'Unit already reserved for these dates'
      };
    }
  }

  // 👥 UNIDAD COMPARTIDA
  else {

    const reservasActivas = await pool.query(
      q.countReservasActivas,
      [id_unidad, fecha_inicio, fecha_fin]
    );

    const totalReservas =
      parseInt(reservasActivas.rows[0].total);

    if (totalReservas >= unidad.capacidad) {
      throw {
        status: 400,
        message: 'No spots available'
      };
    }
  }

  // ✅ calcular noches
  const noches =
    (fin - inicio) / (1000 * 60 * 60 * 24);

  // ✅ calcular total automático
  const total =
    noches * unidad.precio_noche;

  // ✅ crear reserva
const { rows } = await pool.query(
  q.createReserva,
  [
    user.id,
    id_unidad,
    fecha_inicio,
    fecha_fin,
    total
  ]
);

  return rows[0];
};