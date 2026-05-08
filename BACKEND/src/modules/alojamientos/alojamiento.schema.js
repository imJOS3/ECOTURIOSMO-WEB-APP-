import Joi from 'joi';

export const createAlojamientoSchema = Joi.object({
  titulo: Joi.string().min(3).max(100).required(),

  descripcion: Joi.string().min(10).required(),


  ubicacion: Joi.string().required(),

  latitud: Joi.number().required(),

  longitud: Joi.number().required()
});