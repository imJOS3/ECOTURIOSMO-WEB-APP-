import * as service from './categoria.service.js';

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

    const data = await service.getAll();

    res.json(data);

  } catch (err) {

    next(err);
  }
};

export const getById = async (req, res, next) => {

  try {

    const data = await service.getById(
      req.params.id
    );

    if (!data) {

      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    res.json(data);

  } catch (err) {

    next(err);
  }
};

export const update = async (req, res, next) => {

  try {

    const data = await service.update(
      req.params.id,
      req.body
    );

    if (!data) {

      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    res.json(data);

  } catch (err) {

    next(err);
  }
};

export const remove = async (req, res, next) => {

  try {

    await service.remove(req.params.id);

    res.json({
      message: 'Categoría eliminada'
    });

  } catch (err) {

    next(err);
  }
};