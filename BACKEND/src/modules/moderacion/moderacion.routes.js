import { Router } from 'express';
import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';
import * as ctrl from './moderacion.controller.js';

const router = Router();

router.post('/alojamientos/:id/aprobar', auth, checkRole('admin'), ctrl.aprobarAlojamiento);
router.post('/alojamientos/:id/rechazar', auth, checkRole('admin'), ctrl.rechazarAlojamiento);
router.post('/alojamientos/:id/suspender', auth, checkRole('admin'), ctrl.suspenderAlojamiento);

router.get('/log', auth, checkRole('admin'), ctrl.getModeracionLog);

export default router;
