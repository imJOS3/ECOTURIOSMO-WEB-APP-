import pool from '../../config/database.js';
import * as q from './reserva.queries.js';

/* ─────────────────────────────────────────────
   CREAR RESERVA
───────────────────────────────────────────── */
export const create = async (data, user) => {

  const {
    id_unidad,
    fecha_inicio,
    fecha_fin
  } = data;

  // validar fechas
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);

  if (inicio >= fin) {
    throw {
      status: 400,
      message: 'Invalid reservation dates'
    };
  }

  // obtener unidad
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

  // validar moderación
  if (
    unidad.estado !== 'aprobado' ||
    unidad.alojamiento_estado_publicacion !== 'aprobado'
  ) {
    throw {
      status: 403,
      message: 'Content not approved'
    };
  }

  // validar disponibilidad
  if (!unidad.disponible) {
    throw {
      status: 400,
      message: 'Unit not available'
    };
  }

  // unidad privada
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

  // unidad compartida
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

  // calcular noches
  const noches =
    (fin - inicio) / (1000 * 60 * 60 * 24);

  // calcular total
  const total =
    noches * unidad.precio_noche;

  // crear reserva
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

/* ─────────────────────────────────────────────
   TODAS LAS RESERVAS
───────────────────────────────────────────── */
export const getAll = async () => {

  const { rows } = await pool.query(
    q.getReservas
  );

  return rows;
};

/* ─────────────────────────────────────────────
   RESERVAS DEL TURISTA
───────────────────────────────────────────── */
export const getMine = async (user) => {

  const { rows } = await pool.query(
    q.getReservasByUser,
    [user.id]
  );

  return rows;
};

/* ─────────────────────────────────────────────
   RESERVAS DEL ANFITRIÓN
───────────────────────────────────────────── */
export const getReservasAnfitrion = async (user) => {

  const { rows } = await pool.query(
    q.getReservasByAnfitrion,
    [user.id]
  );

  return rows;
};

/* ─────────────────────────────────────────────
   ACTUALIZAR ESTADO
───────────────────────────────────────────── */
export const update = async (id, estado) => {

  const estadosValidos = [
    'pendiente',
    'confirmada',
    'cancelada'
  ];

  if (!estadosValidos.includes(estado)) {
    throw {
      status: 400,
      message: 'Invalid reservation status'
    };
  }

  const { rows } = await pool.query(
    q.updateReserva,
    [estado, id]
  );

  if (!rows[0]) {
    throw {
      status: 404,
      message: 'Reservation not found'
    };
  }

  return rows[0];
};

/* ─────────────────────────────────────────────
   ELIMINAR RESERVA
───────────────────────────────────────────── */
export const remove = async (id) => {

  const reserva = await pool.query(
    q.getReservaById,
    [id]
  );

  if (!reserva.rows[0]) {
    throw {
      status: 404,
      message: 'Reservation not found'
    };
  }

  await pool.query(
    q.deleteReserva,
    [id]
  );

  return {
    success: true,
    message: 'Reservation deleted'
  };
};