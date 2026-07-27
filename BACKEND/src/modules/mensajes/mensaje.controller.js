import * as service from './mensaje.service.js';

export const openOrCreate = async (req, res, next) => {
  try {
    const data = await service.openOrCreate(req.body, req.user);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const listMine = async (req, res, next) => {
  try {
    const data = await service.listMine(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id, req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const data = await service.sendMessage(req.params.id, req.body.cuerpo, req.user);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};
