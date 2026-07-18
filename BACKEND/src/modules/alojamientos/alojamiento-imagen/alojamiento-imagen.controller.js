import * as service from './alojamiento-imagen.service.js';


// =========================
// CREAR
// =========================

export const create = async (
  req,
  res,
  next
) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: 'Imagen requerida'
      });
    }

    const data = await service.create({

      id_alojamiento: req.body.id_alojamiento,

      url: req.file.path,

      public_id: req.file.filename
    });

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {

    next(err);
  }
};

// =========================
// ACTUALIZAR
// =========================

export const update = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Imagen requerida'
      });
    }

    const data = await service.update(req.params.id, {
      url: req.file.path,
      public_id: req.file.filename
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
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

    const data = await service.getByAlojamiento(
      req.params.id_alojamiento
    );

    res.status(200).json({
      success: true,
      data
    });

  } catch (err) {

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

    const data = await service.remove(
      req.params.id
    );

    if (!data) {

      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Imagen eliminada'
    });

  } catch (err) {

    next(err);
  }
};