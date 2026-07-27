import pool from '../../config/database.js';
import * as q from './mensaje.queries.js';

const assertParticipante = async (conversacionId, userId) => {
  const { rows } = await pool.query(q.isParticipante, [conversacionId, userId]);
  if (!rows[0]) {
    throw { status: 403, message: 'No eres participante de esta conversación' };
  }
};

/**
 * Abre o reutiliza una conversación.
 * - reserva: turista ↔ anfitrión del alojamiento
 * - moderacion: admin ↔ anfitrión del alojamiento
 */
export const openOrCreate = async (data, user) => {
  const { tipo, id_alojamiento, asunto, mensaje_inicial } = data;

  const alojRes = await pool.query(q.getAlojamientoOwner, [id_alojamiento]);
  const alojamiento = alojRes.rows[0];
  if (!alojamiento) {
    throw { status: 404, message: 'Alojamiento no encontrado' };
  }

  const hostId = alojamiento.id_anfitrion;
  let otherUserId = null;

  if (tipo === 'reserva') {
    if (user.rol !== 'turista') {
      throw { status: 403, message: 'Solo los turistas pueden iniciar chat de reserva' };
    }
    if (user.id === hostId) {
      throw { status: 400, message: 'No puedes mensajearte a ti mismo' };
    }
    otherUserId = hostId;
  } else if (tipo === 'moderacion') {
    if (user.rol !== 'admin') {
      throw { status: 403, message: 'Solo los admins pueden iniciar chat de moderación' };
    }
    otherUserId = hostId;
  } else {
    throw { status: 400, message: 'Tipo de conversación inválido' };
  }

  // Reutilizar conversación abierta entre los mismos participantes
  const existing = await pool.query(q.findOpenConversacion, [
    user.id,
    otherUserId,
    tipo,
    id_alojamiento
  ]);

  let conversacion = existing.rows[0];

  if (!conversacion) {
    const created = await pool.query(q.createConversacion, [
      tipo,
      id_alojamiento,
      asunto || (tipo === 'moderacion'
        ? `Moderación: ${alojamiento.titulo}`
        : `Consulta: ${alojamiento.titulo}`)
    ]);
    conversacion = created.rows[0];
    await pool.query(q.addParticipante, [conversacion.id, user.id]);
    await pool.query(q.addParticipante, [conversacion.id, otherUserId]);
  }

  await pool.query(q.createMensaje, [conversacion.id, user.id, mensaje_inicial.trim()]);
  await pool.query(q.touchConversacion, [conversacion.id]);

  return getById(conversacion.id, user);
};

export const listMine = async (user) => {
  const { rows } = await pool.query(q.listMine, [user.id]);
  return rows.map((row) => ({
    ...row,
    participantes: Array.isArray(row.participantes) ? row.participantes : []
  }));
};

export const getById = async (id, user) => {
  await assertParticipante(id, user.id);

  const convRes = await pool.query(q.getConversacionById, [id]);
  const conversacion = convRes.rows[0];
  if (!conversacion) {
    throw { status: 404, message: 'Conversación no encontrada' };
  }

  const listRes = await pool.query(q.listMine, [user.id]);
  const enriched = listRes.rows.find((r) => `${r.id}` === `${id}`) || conversacion;

  const mensajesRes = await pool.query(q.listMensajes, [id]);
  await pool.query(q.markRead, [id, user.id]);

  return {
    ...enriched,
    participantes: Array.isArray(enriched.participantes) ? enriched.participantes : [],
    mensajes: mensajesRes.rows
  };
};

export const sendMessage = async (conversacionId, cuerpo, user) => {
  await assertParticipante(conversacionId, user.id);

  if (!cuerpo?.trim()) {
    throw { status: 400, message: 'El mensaje no puede estar vacío' };
  }

  const { rows } = await pool.query(q.createMensaje, [
    conversacionId,
    user.id,
    cuerpo.trim()
  ]);
  await pool.query(q.touchConversacion, [conversacionId]);

  return {
    ...rows[0],
    nombre_remitente: user.nombre,
    rol_remitente: user.rol
  };
};
