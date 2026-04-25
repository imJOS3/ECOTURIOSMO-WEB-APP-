import { Router } from 'express';
import * as ctrl from './reserva.controller.js';

import auth from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.getAll);
router.get('/mine', auth, ctrl.getMine);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

export default router;