export const findOpenConversacion = `
  SELECT c.*
  FROM conversacion c
  INNER JOIN conversacion_participante p1
    ON p1.id_conversacion = c.id AND p1.id_usuario = $1
  INNER JOIN conversacion_participante p2
    ON p2.id_conversacion = c.id AND p2.id_usuario = $2
  WHERE c.tipo = $3
    AND c.id_alojamiento = $4
  ORDER BY c.updated_at DESC
  LIMIT 1;
`;

export const createConversacion = `
  INSERT INTO conversacion (tipo, id_alojamiento, asunto)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const addParticipante = `
  INSERT INTO conversacion_participante (id_conversacion, id_usuario)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING;
`;

export const createMensaje = `
  INSERT INTO mensaje (id_conversacion, id_remitente, cuerpo)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const touchConversacion = `
  UPDATE conversacion
  SET updated_at = NOW()
  WHERE id = $1
  RETURNING *;
`;

export const listMine = `
  SELECT
    c.*,
    a.titulo AS alojamiento_titulo,
    (
      SELECT m.cuerpo
      FROM mensaje m
      WHERE m.id_conversacion = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS ultimo_mensaje,
    (
      SELECT m.created_at
      FROM mensaje m
      WHERE m.id_conversacion = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) AS ultimo_mensaje_at,
    (
      SELECT COUNT(*)::int
      FROM mensaje m
      WHERE m.id_conversacion = c.id
        AND m.id_remitente <> $1
        AND m.read_at IS NULL
    ) AS no_leidos,
    (
      SELECT json_agg(json_build_object(
        'id', u.id,
        'nombre', u.nombre,
        'rol', u.rol
      ))
      FROM conversacion_participante cp
      INNER JOIN usuario u ON u.id = cp.id_usuario
      WHERE cp.id_conversacion = c.id
    ) AS participantes
  FROM conversacion c
  INNER JOIN conversacion_participante me
    ON me.id_conversacion = c.id AND me.id_usuario = $1
  LEFT JOIN alojamiento a ON a.id = c.id_alojamiento
  ORDER BY c.updated_at DESC;
`;

export const getConversacionById = `
  SELECT c.*, a.titulo AS alojamiento_titulo, a.id_anfitrion
  FROM conversacion c
  LEFT JOIN alojamiento a ON a.id = c.id_alojamiento
  WHERE c.id = $1;
`;

export const isParticipante = `
  SELECT 1
  FROM conversacion_participante
  WHERE id_conversacion = $1 AND id_usuario = $2
  LIMIT 1;
`;

export const listMensajes = `
  SELECT
    m.*,
    u.nombre AS nombre_remitente,
    u.rol AS rol_remitente
  FROM mensaje m
  INNER JOIN usuario u ON u.id = m.id_remitente
  WHERE m.id_conversacion = $1
  ORDER BY m.created_at ASC;
`;

export const markRead = `
  UPDATE mensaje
  SET read_at = NOW()
  WHERE id_conversacion = $1
    AND id_remitente <> $2
    AND read_at IS NULL;
`;

export const getAlojamientoOwner = `
  SELECT id, id_anfitrion, titulo, estado
  FROM alojamiento
  WHERE id = $1;
`;
