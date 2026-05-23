import Joi from 'joi';

export const createAlojamientoImagenSchema = Joi.object({

  id_alojamiento: Joi.number()
    .integer()
    .positive()
    .required()
});