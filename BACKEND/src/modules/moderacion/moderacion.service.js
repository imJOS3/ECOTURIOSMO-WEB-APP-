import pool from '../../config/database.js';

const CONFIG = {
  alojamientos: {
    table: 'alojamiento',
    label: 'alojamiento'
  }
};

const ACTION_CONFIG = {
  aprobar: {
    estado: 'aprobado',
    logAction: 'aprobado',
    setMotivo: false
  },
  rechazar: {
    estado: 'rechazado',
    logAction: 'rechazado',
    setMotivo: true
  },
  suspender: {
    estado: 'suspendido',
    logAction: 'suspendido',
    setMotivo: true
  }
};

const assertConfig = (type, action) => {
  const content = CONFIG[type];
  const moderationAction = ACTION_CONFIG[action];

  if (!content || !moderationAction) {
    throw { status: 400, message: 'Invalid moderation request' };
  }

  return { content, moderationAction };
};

export const moderateContent = async ({ type, id, action, motivo, admin }) => {
  const { content, moderationAction } = assertConfig(type, action);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currentResult = await client.query(
      `SELECT id, estado
       FROM ${content.table}
       WHERE id = $1`,
      [id]
    );

    const current = currentResult.rows[0];

    if (!current) {
      throw { status: 404, message: `${content.label} no encontrado` };
    }

    if (moderationAction.setMotivo && action === 'rechazar' && !motivo) {
      throw { status: 400, message: 'Motivo requerido' };
    }

    const updateValues = [
      moderationAction.estado,
      action === 'rechazar' ? motivo : action === 'suspender' ? motivo || null : null,
      admin.id,
      id
    ];

    const updateResult = await client.query(
      `UPDATE ${content.table}
       SET estado = $1,
           motivo_rechazo = $2,
           fecha_revision = NOW(),
           id_admin_revision = $3
       WHERE id = $4
       RETURNING *`,
      updateValues
    );

    const updated = updateResult.rows[0];

    await client.query(
      `INSERT INTO moderacion_log (
         tipo_contenido,
         id_contenido,
         accion,
         motivo,
         estado_anterior,
         estado_nuevo,
         id_admin_revision
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        type,
        id,
        moderationAction.logAction,
        action === 'aprobar' ? null : motivo || null,
        current.estado,              // ← corregido: era current.estado_publicacion
        moderationAction.estado,
        admin.id
      ]
    );

    await client.query('COMMIT');
    return updated;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ─── Log de moderación ────────────────────────────────────────────────────────
export const getLogs = async () => {
  const { rows } = await pool.query(
    `SELECT ml.*, u.nombre AS admin_nombre
     FROM moderacion_log ml
     LEFT JOIN usuario u ON u.id = ml.id_admin_revision
     ORDER BY ml.fecha_revision DESC`
  );
  return rows;
};