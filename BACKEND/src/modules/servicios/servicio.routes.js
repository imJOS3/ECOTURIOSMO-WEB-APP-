import { Router } from 'express';
import * as ctrl from './servicio.controller.js';
import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { servicioSchema } from './servicio.schema.js';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

router.post('/', auth, checkRole('admin'), validate(servicioSchema), ctrl.create);
router.put('/:id', auth, checkRole('admin'), validate(servicioSchema), ctrl.update);
router.delete('/:id', auth, checkRole('admin'), ctrl.remove);

export default router;
