import Joi from 'joi';
import { ESPACIOS_IMAGEN, DEFAULT_ESPACIO } from './alojamiento-imagen.queries.js';

export const createAlojamientoImagenSchema = Joi.object({
  id_alojamiento: Joi.number()
    .integer()
    .positive()
    .required(),
  espacio: Joi.string()
    .valid(...ESPACIOS_IMAGEN)
    .default(DEFAULT_ESPACIO),
});

export const updateEspacioSchema = Joi.object({
  espacio: Joi.string()
    .valid(...ESPACIOS_IMAGEN)
    .required(),
});
