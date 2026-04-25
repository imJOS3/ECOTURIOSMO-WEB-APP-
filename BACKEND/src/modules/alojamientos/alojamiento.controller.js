import * as service from './alojamiento.service.js';

export const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body, req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getMine = async (req, res, next) => {
  try {
    const data = await service.getMyAlojamientos(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};