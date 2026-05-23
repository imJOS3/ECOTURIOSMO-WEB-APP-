import Joi from 'joi';

export const createAlojamientoSchema = Joi.object({
  titulo: Joi.string().min(3).max(150).required(),

  descripcion: Joi.string().min(10).required(),

  ubicacion: Joi.string().required(),

  latitud: Joi.number().optional().allow(null, ''),

  longitud: Joi.number().optional().allow(null, ''),

  categorias: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .unique()
    .min(1)
    .required()
});