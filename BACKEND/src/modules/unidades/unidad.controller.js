import * as service from './unidad.service.js';


// =========================
// CREAR
// =========================

export const create = async (
  data,
  user
) => {

  const {
    id_alojamiento,
    nombre,
    tipo,
    descripcion,
    capacidad,
    precio_noche,
    cupos_disponibles,
    es_compartido,
    categorias
  } = data;

  // =========================
  // VALIDAR CATEGORIAS
  // =========================

  await categoriaRelations.validateCategoriasExist(
    categorias,
    'unidad'
  );

  // =========================
  // VALIDAR ALOJAMIENTO
  // =========================

  const { rows: alojamientoRows } = await pool.query(
    q.getAlojamientoOwner,
    [id_alojamiento]
  );

  const alojamiento = alojamientoRows[0];

  if (!alojamiento) {
    throw new Error('ALOJAMIENTO_NOT_FOUND');
  }

  // =========================
  // VALIDAR OWNER
  // =========================

  const isOwner =
    alojamiento.id_anfitrion === user.id;

  const isAdmin =
    user.rol === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('FORBIDDEN');
  }

  // =========================
  // CREAR
  // =========================

  const { rows } = await pool.query(
    q.createUnidad,
    [
      id_alojamiento,
      nombre,
      tipo,
      descripcion,
      capacidad,
      cupos_disponibles || capacidad,
      es_compartido,
      precio_noche,
      'pendiente_revision'
    ]
  );

  // =========================
  // CATEGORIAS
  // =========================

  await categoriaRelations.setUnidadCategorias(
    rows[0].id,
    categorias
  );

  return categoriaRelations.attachUnidadCategorias(
    rows[0]
  );
};

// =========================
// OBTENER POR ALOJAMIENTO
// =========================

export const getByAlojamiento = async (
  req,
  res,
  next
) => {

  try {

    const user = req.user || null;

    const unidades = await service.getByAlojamiento(
      req.params.id,
      user
    );

    res.status(200).json({
      success: true,
      data: unidades
    });

  } catch (err) {

    next(err);
  }
};


// =========================
// OBTENER UNA
// =========================

export const getById = async (
  req,
  res,
  next
) => {

  try {

    const unidad = await service.getById(
      req.params.id,
      req.user || null
    );

    if (!unidad) {

      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: unidad
    });

  } catch (err) {

    next(err);
  }
};


// =========================
// MIS UNIDADES
// =========================

export const getMine = async (
  req,
  res,
  next
) => {

  try {

    const unidades = await service.getMine(
      req.user
    );

    res.status(200).json({
      success: true,
      data: unidades
    });

  } catch (err) {

    next(err);
  }
};


// =========================
// ACTUALIZAR
// =========================

export const update = async (
  req,
  res,
  next
) => {

  try {

    const unidad = await service.update(
      req.params.id,
      req.body,
      req.user
    );

    if (!unidad) {

      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: unidad
    });

  } catch (err) {

    if (err.message === 'FORBIDDEN') {

      return res.status(403).json({
        success: false,
        message: 'No tienes permisos'
      });
    }

    next(err);
  }
};


// =========================
// ELIMINAR
// =========================

export const remove = async (
  req,
  res,
  next
) => {

  try {

    const result = await service.remove(
      req.params.id,
      req.user
    );

    if (!result) {

      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Eliminado correctamente'
    });

  } catch (err) {

    if (err.message === 'FORBIDDEN') {

      return res.status(403).json({
        success: false,
        message: 'No tienes permisos'
      });
    }

    next(err);
  }
};