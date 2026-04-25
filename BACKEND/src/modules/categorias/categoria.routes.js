import { Router } from 'express';
import * as ctrl from './categoria.controller.js';
import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.post('/', auth, checkRole('admin'), ctrl.create);
router.get('/', ctrl.getAll);

export default router;