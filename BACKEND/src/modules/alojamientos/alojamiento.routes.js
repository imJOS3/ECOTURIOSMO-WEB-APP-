// routes alojamiento.routes.js

import { Router } from 'express';

import * as ctrl from './alojamiento.controller.js';

import auth from '../../middlewares/auth.middleware.js';
import authOptional from '../../middlewares/authOptional.middleware.js';

import { checkRole } from '../../middlewares/role.middleware.js';

import validate from '../../middlewares/validate.middleware.js';

import {
  createAlojamientoSchema
} from './alojamiento.schema.js';

const router = Router();


// =========================
// PUBLICO / TURISTA / HOST / ADMIN
// =========================

router.get(
  '/',
  authOptional,
  ctrl.getAll
);


// =========================
// VER POR ID
// =========================

router.get(
  '/:id',
  authOptional,
  ctrl.getById
);


// =========================
// CREAR ALOJAMIENTO
// =========================

router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  validate(createAlojamientoSchema),
  ctrl.create
);


// =========================
// MIS ALOJAMIENTOS
// =========================

router.get(
  '/mine',
  auth,
  checkRole('anfitrion'),
  ctrl.getMine
);


// =========================
// ACTUALIZAR
// =========================

router.put(
  '/:id',
  auth,
  checkRole('anfitrion'),
  validate(createAlojamientoSchema),
  ctrl.update
);


// =========================
// ELIMINAR
// =========================

router.delete(
  '/:id',
  auth,
  checkRole('anfitrion'),
  ctrl.remove
);

export default router;