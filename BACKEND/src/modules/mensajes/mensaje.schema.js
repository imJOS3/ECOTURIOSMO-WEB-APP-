import Joi from 'joi';

export const createConversacionSchema = Joi.object({
  tipo: Joi.string().valid('reserva', 'moderacion').required(),
  id_alojamiento: Joi.number().integer().positive().required(),
  asunto: Joi.string().max(200).allow('', null),
  mensaje_inicial: Joi.string().min(1).max(2000).required()
});

export const createMensajeSchema = Joi.object({
  cuerpo: Joi.string().min(1).max(2000).required()
});
