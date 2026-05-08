import { Router } from 'express';
import * as ctrl from './unidad.controller.js';

import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  ctrl.create
);

router.get(
  '/alojamiento/:id',
  ctrl.getByAlojamiento
);

export default router;