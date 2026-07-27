import Joi from 'joi';

export const createAlojamientoSchema = Joi.object({
  titulo: Joi.string().min(3).max(150).required(),

  descripcion: Joi.string().min(10).required(),

  ubicacion: Joi.string().required(),

  latitud: Joi.number().optional().allow(null, ''),

  longitud: Joi.number().optional().allow(null, ''),

  precio_noche: Joi.number().positive().required(),

  capacidad: Joi.number().integer().positive().required(),

  es_compartido: Joi.boolean().optional().default(false),

  cupos_disponibles: Joi.number().integer().positive().optional().allow(null),

  habitaciones: Joi.number().integer().min(0).optional().allow(null),

  camas: Joi.number().integer().min(0).optional().allow(null),

  banos: Joi.number().integer().min(0).optional().allow(null),

  categorias: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .unique()
    .min(1)
    .required(),

  servicios: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
    )
    .unique()
    .optional()
    .default([])
});
