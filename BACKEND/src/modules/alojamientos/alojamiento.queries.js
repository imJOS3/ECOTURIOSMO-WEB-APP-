// alojamiento.queries.js

export const createAlojamiento = `
  INSERT INTO alojamiento (
    id_anfitrion, titulo, descripcion, ubicacion, latitud, longitud,
    precio_noche, capacidad, es_compartido, cupos_disponibles,
    habitaciones, camas, banos, estado
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
`;

// Público/turista -> SOLO aprobados
export const getAllAlojamientos = `
  SELECT a.*
  FROM alojamiento a
  WHERE a.estado = 'aprobado'
  ORDER BY created_at DESC;
`;

// Admin -> todos
export const getAllAlojamientosAll = `
  SELECT * FROM alojamiento
  ORDER BY created_at DESC;
`;

// Anfitrión panel -> solo los suyos (se mantiene para compatibilidad pero ya no se usa en getAll)
export const getAllAlojamientosForAnfitrion = `
  SELECT * FROM alojamiento
  WHERE estado = 'aprobado'
     OR id_anfitrion = $1
  ORDER BY created_at DESC;
`;

// Obtener por id sin filtrar
export const getAlojamientoByIdAny = `
  SELECT * FROM alojamiento WHERE id = $1;
`;

// Público -> solo aprobados
export const getAlojamientoById = `
  SELECT * FROM alojamiento WHERE id = $1 AND estado = 'aprobado';
`;

// Mis alojamientos (solo del anfitrión autenticado)
export const getByAnfitrion = `
  SELECT * FROM alojamiento
  WHERE id_anfitrion = $1
  ORDER BY created_at DESC;
`;

export const updateAlojamiento = `
  UPDATE alojamiento
  SET
    titulo = $1,
    descripcion = $2,
    ubicacion = $3,
    latitud = $4,
    longitud = $5,
    precio_noche = $6,
    capacidad = $7,
    es_compartido = $8,
    cupos_disponibles = $9,
    habitaciones = $10,
    camas = $11,
    banos = $12
  WHERE id = $13
  RETURNING *;
`;

// Eliminar
export const deleteAlojamiento = `
  DELETE FROM alojamiento WHERE id = $1;
`;
