import Joi from 'joi';

export const categoriaSchema = Joi.object({

  nombre: Joi.string()
    .min(2)
    .max(100)
    .required(),

  tipo: Joi.string()
    .valid('alojamiento', 'unidad')
    .required()
});