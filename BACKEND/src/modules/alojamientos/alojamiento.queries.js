// alojamiento.queries.js

export const createAlojamiento = `
  INSERT INTO alojamiento (
    id_anfitrion, titulo, descripcion, ubicacion, latitud, longitud, estado
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

// Público/turista -> SOLO aprobados
export const getAllAlojamientos = `
  SELECT * FROM alojamiento
  WHERE estado = 'aprobado'
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

// Actualizar — sin precio (no existe en la tabla)
export const updateAlojamiento = `
  UPDATE alojamiento
  SET
    titulo = $1,
    descripcion = $2,
    ubicacion = $3,
    latitud = $4,
    longitud = $5
  WHERE id = $6
  RETURNING *;
`;

// Eliminar
export const deleteAlojamiento = `
  DELETE FROM alojamiento WHERE id = $1;
`;