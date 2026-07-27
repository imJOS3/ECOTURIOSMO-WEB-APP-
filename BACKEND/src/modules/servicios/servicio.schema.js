import Joi from 'joi';

export const servicioSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  icono: Joi.string().min(2).max(50).optional().default('check')
});
