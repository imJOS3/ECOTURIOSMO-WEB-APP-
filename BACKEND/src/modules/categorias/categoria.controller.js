import * as service from './categoria.service.js';

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body.nombre));
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