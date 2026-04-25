import { Router } from 'express';
import * as ctrl from './pago.controller.js';
import auth from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.getAll);
router.get('/reserva/:id_reserva', auth, ctrl.getByReserva);

export default router;