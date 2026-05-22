import * as service from './reserva.service.js';

export const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body, req.user);
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

export const getMine = async (req, res, next) => {
  try {
    res.json(await service.getMine(req.user));
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────
   RESERVAS RECIBIDAS POR EL ANFITRIÓN
───────────────────────────────────────────── */
export const getAnfitrion = async (req, res, next) => {
  try {

    const data = await service.getReservasAnfitrion(
      req.user
    );

    res.json(data);

  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    res.json(
      await service.update(
        req.params.id,
        req.body.estado
      )
    );
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    res.json(await service.remove(req.params.id));
  } catch (err) {
    next(err);
  }
};