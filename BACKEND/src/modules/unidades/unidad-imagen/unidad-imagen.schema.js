import Joi from 'joi';

export const createUnidadImagenSchema = Joi.object({

  id_unidad: Joi.number()
    .integer()
    .positive()
    .required()
});