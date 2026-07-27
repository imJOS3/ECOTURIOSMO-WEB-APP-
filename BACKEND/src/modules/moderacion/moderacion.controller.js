import { moderateContent, getLogs } from './moderacion.service.js';

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

export const getModeracionLog = async (req, res, next) => {
  try {
    const logs = await getLogs();
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
