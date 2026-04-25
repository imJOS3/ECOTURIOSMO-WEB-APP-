import * as service from './pago.service.js';

export const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
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

export const getByReserva = async (req, res, next) => {
  try {
    res.json(await service.getByReserva(req.params.id_reserva));
  } catch (err) {
    next(err);
  }
};