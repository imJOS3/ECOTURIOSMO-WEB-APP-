  import * as service from './unidad.service.js';

  export const create = async (req, res, next) => {
    try {
      const unidad = await service.create(req.body);

      res.status(201).json({
        success: true,
        data: unidad
      });
    } catch (err) {
      next(err);
    }
  };

  export const getByAlojamiento = async (req, res, next) => {
    try {
      const unidades = await service.getByAlojamiento(
        req.params.id
      );

      res.json({
        success: true,
        data: unidades
      });
    } catch (err) {
      next(err);
    }
  };