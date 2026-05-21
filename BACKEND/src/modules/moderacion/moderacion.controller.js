import { moderateContent } from './moderacion.service.js';

const runModeration = (type, action) => async (req, res, next) => {
  try {
    const result = await moderateContent({
      type,
      id: req.params.id,
      action,
      motivo: req.body?.motivo,
      admin: req.user
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const aprobarAlojamiento = runModeration('alojamientos', 'aprobar');
export const rechazarAlojamiento = runModeration('alojamientos', 'rechazar');
export const suspenderAlojamiento = runModeration('alojamientos', 'suspender');

export const aprobarUnidad = runModeration('unidades', 'aprobar');
export const rechazarUnidad = runModeration('unidades', 'rechazar');
export const suspenderUnidad = runModeration('unidades', 'suspender');