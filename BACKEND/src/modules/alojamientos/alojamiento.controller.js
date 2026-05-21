// alojamiento.controller.js

import * as service from './alojamiento.service.js';


// =========================
// CREAR
// =========================

export const create = async (req, res, next) => {

  try {

    const data = await service.create(
      req.body,
      req.user
    );

    res.status(201).json(data);

  } catch (err) {

    next(err);
  }
};


// =========================
// OBTENER TODOS
// =========================

export const getAll = async (req, res, next) => {

  try {

    const user = req.user || null;

    const data = await service.getAll(user);

    res.status(200).json(data);

  } catch (err) {

    next(err);
  }
};


// =========================
// OBTENER POR ID
// =========================

export const getById = async (req, res, next) => {

  try {

    const user = req.user || null;

    const data = await service.getById(
      req.params.id,
      user
    );

    if (!data) {

      return res.status(404).json({
        message: 'Alojamiento no encontrado o sin permiso'
      });
    }

    res.status(200).json(data);

  } catch (err) {

    next(err);
  }
};


// =========================
// MIS ALOJAMIENTOS
// =========================

export const getMine = async (req, res, next) => {

  try {

    const data = await service.getMyAlojamientos(
      req.user
    );

    res.status(200).json(data);

  } catch (err) {

    next(err);
  }
};


// =========================
// ACTUALIZAR
// =========================

export const update = async (req, res, next) => {

  try {

    const data = await service.update(
      req.params.id,
      req.body
    );

    if (!data) {

      return res.status(404).json({
        message: 'Alojamiento no encontrado'
      });
    }

    res.status(200).json(data);

  } catch (err) {

    next(err);
  }
};


// =========================
// ELIMINAR
// =========================

export const remove = async (req, res, next) => {

  try {

    const data = await service.remove(
      req.params.id
    );

    if (!data) {

      return res.status(404).json({
        message: 'Alojamiento no encontrado'
      });
    }

    res.status(200).json({
      message: 'Eliminado correctamente'
    });

  } catch (err) {

    next(err);
  }
};