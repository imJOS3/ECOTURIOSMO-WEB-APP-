import Joi from 'joi';

export const createUnidadSchema = Joi.object({

  id_alojamiento: Joi.number()
    .integer()
    .positive()
    .required(),

  nombre: Joi.string()
    .min(2)
    .max(255)
    .required(),

  tipo: Joi.string()
    .required(),

  descripcion: Joi.string()
    .allow('', null),

  capacidad: Joi.number()
    .integer()
    .positive()
    .required(),

  precio_noche: Joi.number()
    .positive()
    .required(),

  cupos_disponibles: Joi.number()
    .integer()
    .positive()
    .optional(),

  es_compartido: Joi.boolean()
    .optional(),

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

export const updateUnidadSchema = Joi.object({
  id_alojamiento: Joi.number()
    .integer()
    .positive()
    .optional(),

  nombre: Joi.string()
    .min(3)
    .max(150)
    .required(),

  tipo: Joi.string()
    .min(2)
    .max(50)
    .required(),

  descripcion: Joi.string()
    .min(10)
    .required(),

  capacidad: Joi.number()
    .integer()
    .min(1)
    .required(),

  es_compartido: Joi.boolean()
    .required(),
  precio_noche: Joi.number()
    .min(0)
    .required(),

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