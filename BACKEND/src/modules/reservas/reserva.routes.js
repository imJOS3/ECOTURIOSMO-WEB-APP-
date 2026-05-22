import { Router } from 'express';
import * as ctrl from './reserva.controller.js';

import auth from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

/* ─────────────────────────────────────────────
   CREAR RESERVA
───────────────────────────────────────────── */
router.post(
  '/',
  auth,
  ctrl.create
);

/* ─────────────────────────────────────────────
   RESERVAS DEL ANFITRIÓN
───────────────────────────────────────────── */
router.get(
  '/anfitrion',
  auth,
  checkRole('anfitrion'),
  ctrl.getAnfitrion
);

/* ─────────────────────────────────────────────
   MIS RESERVAS (TURISTA)
───────────────────────────────────────────── */
router.get(
  '/mine',
  auth,
  ctrl.getMine
);

/* ─────────────────────────────────────────────
   TODAS LAS RESERVAS
───────────────────────────────────────────── */
router.get(
  '/',
  auth,
  ctrl.getAll
);

/* ─────────────────────────────────────────────
   ACTUALIZAR RESERVA
───────────────────────────────────────────── */
router.put(
  '/:id',
  auth,
  ctrl.update
);

/* ─────────────────────────────────────────────
   ELIMINAR RESERVA
───────────────────────────────────────────── */
router.delete(
  '/:id',
  auth,
  ctrl.remove
);

export default router;