import { Router } from 'express';
import * as ctrl from './resena.controller.js';
import auth from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', auth, ctrl.create);
router.get('/', ctrl.getAll);
router.get('/alojamiento/:id', ctrl.getByAlojamiento);

export default router;