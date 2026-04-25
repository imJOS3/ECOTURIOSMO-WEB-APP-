import * as service from './resena.service.js';

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body, req.user));
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

export const getByAlojamiento = async (req, res, next) => {
  try {
    res.json(await service.getByAlojamiento(req.params.id));
  } catch (err) {
    next(err);
  }
};