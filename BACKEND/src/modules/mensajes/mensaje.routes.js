import { Router } from 'express';
import * as ctrl from './mensaje.controller.js';
import auth from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createConversacionSchema,
  createMensajeSchema
} from './mensaje.schema.js';

const router = Router();

router.use(auth);

router.get('/', ctrl.listMine);
router.post('/', validate(createConversacionSchema), ctrl.openOrCreate);
router.get('/:id', ctrl.getById);
router.post('/:id/mensajes', validate(createMensajeSchema), ctrl.sendMessage);

export default router;
