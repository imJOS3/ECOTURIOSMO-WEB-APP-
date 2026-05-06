import * as service from './alojamiento.service.js';

export const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body, req.user);
    res.status(201).json(data); // 🔥 CAMBIO CLAVE
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const getMine = async (req, res, next) => {
  try {
    const data = await service.getMyAlojamientos(req.user);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Alojamiento no encontrado' });
    }

    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};