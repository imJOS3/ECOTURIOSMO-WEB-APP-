export const createAlojamiento = `
  INSERT INTO alojamiento (
    id_anfitrion,
    titulo,
    descripcion,
    ubicacion,
    latitud,
    longitud
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

// Obtener todos los alojamientos activos
export const getAllAlojamientos = `
  SELECT *
  FROM alojamiento
  WHERE estado = 'activo'
  ORDER BY created_at DESC;
`;

// Obtener un alojamiento por ID
export const getAlojamientoById = `
  SELECT *
  FROM alojamiento
  WHERE id = $1;
`;

// Obtener alojamientos de un anfitrión
export const getByAnfitrion = `
  SELECT *
  FROM alojamiento
  WHERE id_anfitrion = $1
  ORDER BY created_at DESC;
`;

// Actualizar alojamiento
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

// Eliminar alojamiento
export const deleteAlojamiento = `
  DELETE FROM alojamiento
  WHERE id = $1;
`;