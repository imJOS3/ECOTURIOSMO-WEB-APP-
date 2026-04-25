import { Router } from 'express';
import * as ctrl from './alojamiento.controller.js';

import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

// 🌍 público
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// 🔐 anfitrion
router.post('/', auth, checkRole('anfitrion'), ctrl.create);
router.get('/mine', auth, checkRole('anfitrion'), ctrl.getMine);
router.put('/:id', auth, checkRole('anfitrion'), ctrl.update);
router.delete('/:id', auth, checkRole('anfitrion'), ctrl.remove);

export default router;